// sync.js - Fixed version
class SyncManager {
    constructor() {
        this.syncInProgress = false;
        this.lastSync = null;
        this.syncInterval = 5 * 60 * 1000; // 5 minutes
        this.init();
    }
    
    async init() {
        this.isOnline = navigator.onLine;
        this.updateSyncStatus();
        
        // Listen for online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        // Initial sync check
        if (this.isOnline) {
            this.sync();
        }
        
        // Start periodic sync
        this.startPeriodicSync();
    }
    
    startPeriodicSync() {
        setInterval(() => {
            if (this.isOnline && !this.syncInProgress) {
                this.sync();
            }
        }, this.syncInterval);
    }
    
    async sync() {
        if (this.syncInProgress || !this.isOnline) return;
        
        this.syncInProgress = true;
        this.updateSyncStatus('syncing');
        
        try {
            // Simulate sync delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // In a real app, this would sync with a server
            // For now, we'll just mark success
            this.lastSync = new Date();
            this.updateSyncStatus('success');
            
            // Show success message
            if (window.app) {
                window.app.showToast('Data synced successfully!', 'cloud_done');
            }
            
        } catch (error) {
            console.error('Sync error:', error);
            this.updateSyncStatus('error');
            
            if (window.app) {
                window.app.showToast('Sync failed. Will retry later.', 'error');
            }
        } finally {
            this.syncInProgress = false;
        }
    }
    
    updateSyncStatus(status) {
        const statusElement = document.getElementById('syncStatus');
        const syncIcon = document.getElementById('syncIcon');
        const syncText = document.getElementById('syncText');
        
        if (!statusElement || !syncIcon || !syncText) return;
        
        // If no status provided, determine based on online state
        if (!status) {
            status = this.isOnline ? 'online' : 'offline';
        }
        
        switch(status) {
            case 'syncing':
                statusElement.className = 'sync-status syncing';
                syncIcon.textContent = 'sync';
                syncIcon.style.animation = 'spin 1.5s linear infinite';
                syncText.textContent = 'Syncing...';
                break;
                
            case 'success':
                statusElement.className = 'sync-status';
                syncIcon.textContent = 'cloud_done';
                syncIcon.style.animation = '';
                syncText.textContent = 'Synced';
                break;
                
            case 'error':
                statusElement.className = 'sync-status offline';
                syncIcon.textContent = 'cloud_off';
                syncIcon.style.animation = '';
                syncText.textContent = 'Sync failed';
                break;
                
            case 'online':
                statusElement.className = 'sync-status';
                syncIcon.textContent = 'cloud_done';
                syncIcon.style.animation = '';
                syncText.textContent = 'Online';
                break;
                
            case 'offline':
                statusElement.className = 'sync-status offline';
                syncIcon.textContent = 'cloud_off';
                syncIcon.style.animation = '';
                syncText.textContent = 'Offline';
                break;
        }
    }
    
    handleOnline() {
        this.isOnline = true;
        this.updateSyncStatus('online');
        
        if (window.app?.userSettings?.autoSync) {
            setTimeout(() => this.sync(), 1000);
        }
    }
    
    handleOffline() {
        this.isOnline = false;
        this.updateSyncStatus('offline');
    }
    
    // Manual sync trigger
    async manualSync() {
        if (!this.isOnline) {
            if (window.app) {
                window.app.showToast('Cannot sync while offline', 'wifi_off');
            }
            return;
        }
        
        await this.sync();
    }
}

// Initialize sync manager
document.addEventListener('DOMContentLoaded', () => {
    window.syncManager = new SyncManager();
});