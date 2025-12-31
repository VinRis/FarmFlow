// sync.js - Simplified
class SyncManager {
    constructor() {
        this.syncInProgress = false;
        this.lastSync = null;
        this.init();
    }
    
    async init() {
        this.isOnline = navigator.onLine;
        
        // Listen for online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        // Initial sync check
        if (this.isOnline) {
            this.sync();
        }
    }
    
    async sync() {
        if (this.syncInProgress || !this.isOnline) return;
        
        this.syncInProgress = true;
        this.updateSyncStatus('syncing');
        
        try {
            // Simulate sync delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.lastSync = new Date();
            this.updateSyncStatus('success');
            
            if (window.app) {
                window.app.showToast('Data synced successfully', 'cloud_done');
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
        
        switch(status) {
            case 'syncing':
                statusElement.className = 'sync-status syncing';
                syncIcon.textContent = 'sync';
                syncIcon.style.animation = 'spin 1s linear infinite';
                syncText.textContent = 'Syncing...';
                break;
                
            case 'success':
                statusElement.className = 'sync-status';
                syncIcon.textContent = 'cloud_done';
                syncIcon.style.animation = '';
                syncText.textContent = 'Up to date';
                break;
                
            case 'error':
                statusElement.className = 'sync-status offline';
                syncIcon.textContent = 'cloud_off';
                syncIcon.style.animation = '';
                syncText.textContent = 'Sync failed';
                break;
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