// FarmFlow Service Worker v3.0
const CACHE_NAME = 'farmflow-v3';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/database.js',
    '/js/ui.js',
    '/js/reports.js',
    '/js/sync.js',
    '/manifest.json',
    '/icons/icon-72.png',
    '/icons/icon-96.png',
    '/icons/icon-128.png',
    '/icons/icon-144.png',
    '/icons/icon-152.png',
    '/icons/icon-192.png',
    '/icons/icon-384.png',
    '/icons/icon-512.png'
];

// Install event
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate event
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event with network-first strategy for API, cache-first for assets
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;
    
    // Skip Chrome extensions
    if (event.request.url.startsWith('chrome-extension://')) return;
    
    // Handle API requests with network-first strategy
    if (event.request.url.includes('/api/')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Cache successful API responses
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => cache.put(event.request, responseClone));
                    }
                    return response;
                })
                .catch(() => {
                    // Fallback to cache if network fails
                    return caches.match(event.request);
                })
        );
    } else {
        // Handle static assets with cache-first strategy
        event.respondWith(
            caches.match(event.request)
                .then(cachedResponse => {
                    if (cachedResponse) {
                        // Update cache in background
                        fetch(event.request)
                            .then(response => {
                                if (response.ok) {
                                    caches.open(CACHE_NAME)
                                        .then(cache => cache.put(event.request, response));
                                }
                            });
                        return cachedResponse;
                    }
                    
                    // If not in cache, fetch from network
                    return fetch(event.request)
                        .then(response => {
                            // Don't cache if not successful
                            if (!response.ok) return response;
                            
                            // Cache the new resource
                            const responseClone = response.clone();
                            caches.open(CACHE_NAME)
                                .then(cache => cache.put(event.request, responseClone));
                            
                            return response;
                        })
                        .catch(error => {
                            console.error('Fetch failed:', error);
                            // Return offline page for navigation requests
                            if (event.request.mode === 'navigate') {
                                return caches.match('/offline.html') || 
                                    new Response('You are offline. Please check your connection.');
                            }
                            throw error;
                        });
                })
        );
    }
});

// Background sync for offline data
self.addEventListener('sync', event => {
    if (event.tag === 'sync-transactions') {
        event.waitUntil(syncPendingData());
    }
});

async function syncPendingData() {
    // This would integrate with your sync.js logic
    console.log('Background sync triggered');
}
