// FarmFlow Service Worker - Offline-first PWA
const CACHE_NAME = 'farmflow-v2.0.0';
const DYNAMIC_CACHE = 'farmflow-dynamic-v1';

// Assets to cache immediately on install
const STATIC_ASSETS = [
    '/FarmFlow/',
    '/FarmFlow/index.html',
    '/FarmFlow/styles.css',
    '/FarmFlow/app.js',
    '/FarmFlow/database.js',
    '/FarmFlow/sync.js',
    '/FarmFlow/ui.js',
    '/FarmFlow/calculators.js',
    '/FarmFlow/reports.js',
    '/FarmFlow/manifest.json',
    '/FarmFlow/icons/icon-72x72.png',
    '/FarmFlow/icons/icon-96x96.png',
    '/FarmFlow/icons/icon-128x128.png',
    '/FarmFlow/icons/icon-144x144.png',
    '/FarmFlow/icons/icon-152x152.png',
    '/FarmFlow/icons/icon-192x192.png',
    '/FarmFlow/icons/icon-384x384.png',
    '/FarmFlow/icons/icon-512x512.png',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Rubik:wght@400;500;600&display=swap',
    'https://fonts.googleapis.com/icon?family=Material+Icons+Round',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Install event - cache static assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Caching static assets...');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('✅ Service Worker installed');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Cache installation failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - offline-first strategy with network fallback
self.addEventListener('fetch', event => {
    // Skip non-GET requests and chrome-extension requests
    if (event.request.method !== 'GET' || event.request.url.startsWith('chrome-extension://')) {
        return;
    }

    // Handle API requests differently
    if (event.request.url.includes('/api/')) {
        event.respondWith(networkFirstStrategy(event.request));
    } else {
        event.respondWith(cacheFirstStrategy(event.request));
    }
});

// Cache-first strategy for static assets
async function cacheFirstStrategy(request) {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            // Update cache in background
            updateCacheInBackground(request);
            return cachedResponse;
        }

        // If not in cache, try network
        const networkResponse = await fetch(request);
        
        // Cache the new response
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('🌐 Network failed, showing offline page:', error);
        
        // If offline and HTML request, return offline page
        if (request.headers.get('Accept').includes('text/html')) {
            const cache = await caches.open(CACHE_NAME);
            return cache.match('/FarmFlow/');
        }
        
        // For other requests, return a custom offline response
        return new Response(JSON.stringify({
            error: 'You are offline',
            message: 'Please check your internet connection',
            timestamp: new Date().toISOString()
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Network-first strategy for API calls
async function networkFirstStrategy(request) {
    try {
        // Try network first
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('🌐 Network failed for API, trying cache...');
        
        // Try cache as fallback
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Return offline response
        return new Response(JSON.stringify({
            status: 'offline',
            message: 'You are offline. Data will sync when connection is restored.',
            data: []
        }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Update cache in background
async function updateCacheInBackground(request) {
    try {
        const response = await fetch(request);
        if (response.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, response);
        }
    } catch (error) {
        // Silently fail - we already have cached version
    }
}

// Background sync for offline data
self.addEventListener('sync', event => {
    if (event.tag === 'sync-transactions') {
        event.waitUntil(syncPendingTransactions());
    }
});

// Sync pending transactions when back online
async function syncPendingTransactions() {
    try {
        // Get pending transactions from IndexedDB
        const pendingTransactions = await getPendingTransactions();
        
        if (pendingTransactions.length === 0) {
            return;
        }
        
        // Sync each transaction
        for (const transaction of pendingTransactions) {
            await syncTransaction(transaction);
        }
        
        // Notify client
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({
                    type: 'sync-complete',
                    count: pendingTransactions.length
                });
            });
        });
    } catch (error) {
        console.error('❌ Background sync failed:', error);
    }
}

// Helper function to get pending transactions from IndexedDB
async function getPendingTransactions() {
    // This would interface with the app's IndexedDB
    // For now, return empty array
    return [];
}

// Helper function to sync a transaction
async function syncTransaction(transaction) {
    // Implementation would send to your backend
    console.log('Syncing transaction:', transaction);
}

// Push notifications
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    
    const options = {
        body: data.body || 'FarmFlow Notification',
        icon: '/FarmFlow/icons/icon-192x192.png',
        badge: '/FarmFlow/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/FarmFlow/'
        },
        actions: [
            {
                action: 'view',
                title: 'View'
            },
            {
                action: 'dismiss',
                title: 'Dismiss'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'FarmFlow', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow(event.notification.data.url)
        );
    }
});

// Periodic sync (if supported)
if ('periodicSync' in self.registration) {
    self.addEventListener('periodicsync', event => {
        if (event.tag === 'daily-sync') {
            event.waitUntil(syncAllData());
        }
    });
}

// Sync all farm data
async function syncAllData() {
    console.log('🔄 Performing periodic sync...');
    // Implement full data sync
}

// Message handler for communication with app
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_ASSETS') {
        cacheAdditionalAssets(event.data.urls);
    }
});

// Cache additional assets on demand
async function cacheAdditionalAssets(urls) {
    const cache = await caches.open(DYNAMIC_CACHE);
    await cache.addAll(urls);
}

// Precache calculator assets on install
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                const calculatorAssets = [
                    '/FarmFlow/assets/calculators/poultry.html',
                    '/FarmFlow/assets/calculators/dairy.html',
                    '/FarmFlow/assets/calculators/crops.html',
                    '/FarmFlow/assets/calculators/livestock.html'
                ];
                return cache.addAll(calculatorAssets);
            })
    );
});
