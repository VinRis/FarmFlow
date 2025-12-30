// sync.js
class SyncManager {
    constructor() {
        this.syncInProgress = false;
        this.lastSync = null;
        this.syncInterval = 5 * 60 * 1000; // 5 minutes
        this.init();
    }
    
    async init() {
        // Check for online status
        this.isOnline = navigator.onLine;
        
        // Register background sync if supported
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
            await this.registerBackgroundSync();
        }
        
        // Start periodic sync
        this.startPeriodicSync();
        
        // Listen for online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
    }
    
    async registerBackgroundSync() {
        const registration = await navigator.serviceWorker.ready;
        
        try {
            await registration.sync.register('sync-transactions');
            console.log('Background sync registered');
        } catch (error) {
            console.log('Background sync registration failed:', error);
        }
    }
    
    startPeriodicSync() {
        // Sync immediately if online
        if (this.isOnline) {
            this.sync();
        }
        
        // Set up periodic sync
        setInterval(() => {
            if (this.isOnline && !this.syncInProgress) {
                this.sync();
            }
        }, this.syncInterval);
    }
    
    async sync() {
        if (this.syncInProgress) return;
        
        this.syncInProgress = true;
        this.updateSyncStatus('syncing');
        
        try {
            // Get pending sync items
            const pendingItems = await database.getPendingSyncItems();
            
            if (pendingItems.length === 0) {
                this.lastSync = new Date();
                this.updateSyncStatus('up-to-date');
                return;
            }
            
            // Process each sync item
            for (const item of pendingItems) {
                await this.processSyncItem(item);
                await database.markSyncComplete(item.id);
            }
            
            this.lastSync = new Date();
            this.updateSyncStatus('success');
            this.showSyncNotification('Data synced successfully');
            
        } catch (error) {
            console.error('Sync error:', error);
            this.updateSyncStatus('error');
            this.showSyncNotification('Sync failed. Will retry later.');
        } finally {
            this.syncInProgress = false;
        }
    }
    
    async processSyncItem(item) {
        // In a real app, this would sync with Firebase
        // For now, we'll simulate the sync
        
        switch(item.action) {
            case 'create':
                console.log('Creating item:', item);
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 100));
                break;
                
            case 'update':
                console.log('Updating item:', item);
                await new Promise(resolve => setTimeout(resolve, 100));
                break;
                
            case 'delete':
                console.log('Deleting item:', item);
                await new Promise(resolve => setTimeout(resolve, 100));
                break;
        }
        
        return true;
    }
    
    updateSyncStatus(status) {
        const statusElement = document.getElementById('syncStatus');
        const icon = document.querySelector('#syncBtn .material-icons');
        
        switch(status) {
            case 'syncing':
                statusElement.textContent = 'Syncing...';
                statusElement.className = 'sync-status syncing';
                icon.textContent = 'sync';
                icon.style.animation = 'spin 1s linear infinite';
                break;
                
            case 'success':
                statusElement.textContent = 'Up to date';
                statusElement.className = 'sync-status';
                icon.textContent = 'cloud_done';
                icon.style.animation = '';
                break;
                
            case 'error':
                statusElement.textContent = 'Sync failed';
                statusElement.className = 'sync-status offline';
                icon.textContent = 'cloud_off';
                icon.style.animation = '';
                break;
                
            case 'up-to-date':
                statusElement.textContent = 'Online';
                statusElement.className = 'sync-status';
                icon.textContent = 'cloud_done';
                icon.style.animation = '';
                break;
        }
    }
    
    showSyncNotification(message) {
        if ('app' in window) {
            app.showToast(message, 'cloud_done');
        }
    }
    
    handleOnline() {
        this.isOnline = true;
        this.sync();
    }
    
    handleOffline() {
        this.isOnline = false;
        this.updateSyncStatus('offline');
    }
    
    // Manual sync trigger
    async manualSync() {
        if (!this.isOnline) {
            this.showSyncNotification('Cannot sync while offline');
            return;
        }
        
        await this.sync();
    }
    
    // Conflict resolution
    async resolveConflict(localData, remoteData) {
        // Simple conflict resolution - prefer local changes
        // In a real app, this would be more sophisticated
        return {
            resolved: localData,
            resolution: 'local_wins'
        };
    }
    
    // Delta sync - only sync changes since last sync
    async deltaSync() {
        if (!this.lastSync) {
            return this.sync();
        }
        
        // Get changes since last sync
        const transactions = await database.db.transactions
            .where('createdAt')
            .above(this.lastSync.toISOString())
            .toArray();
        
        // Process changes
        for (const transaction of transactions) {
            if (!transaction.synced) {
                await this.processSyncItem({
                    action: 'create',
                    table: 'transactions',
                    data: transaction
                });
                
                await database.db.transactions.update(transaction.id, { synced: true });
            }
        }
    }
}

// Initialize sync manager
const syncManager = new SyncManager();