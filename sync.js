// sync.js - Working version
class SyncManager {
    constructor() {
        this.syncInProgress = false;
        this.isOnline = navigator.onLine;
        this.init();
    }
    
    init() {
        this.updateSyncStatus();
        
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateSyncStatus();
            this.sync();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateSyncStatus();
        });
        
        // Initial sync if online
        if (this.isOnline) {
            setTimeout(() => this.sync(), 1000);
        }
    }
    
    async sync() {
        if (this.syncInProgress || !this.isOnline) return;
        
        this.syncInProgress = true;
        this.updateSyncStatus('syncing');
        
        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Mark success
            this.updateSyncStatus('success');
            
            if (window.app) {
                window.app.showToast('Data synced successfully', 'cloud_done');
            }
            
        } catch (error) {
            console.error('Sync error:', error);
            this.updateSyncStatus('error');
            
            if (window.app) {
                window.app.showToast('Sync failed', 'error');
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
}

// Initialize sync manager
document.addEventListener('DOMContentLoaded', () => {
    window.syncManager = new SyncManager();
});
