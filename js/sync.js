// Sync Manager
class FarmFlowSync {
    constructor() {
        this.syncInProgress = false;
        this.syncEndpoint = 'https://your-api-endpoint.com/sync'; // Replace with your API
        this.setupSync();
    }
    
    setupSync() {
        // Check for pending sync when coming online
        window.addEventListener('online', () => {
            this.processSyncQueue();
        });
        
        // Periodically check for sync (every 5 minutes)
        setInterval(() => {
            if (navigator.onLine && !this.syncInProgress) {
                this.processSyncQueue();
            }
        }, 5 * 60 * 1000);
    }
    
    async processSyncQueue() {
        if (this.syncInProgress || !navigator.onLine) return;
        
        this.syncInProgress = true;
        
        try {
            const queue = await farmDB.getSyncQueue();
            
            for (const item of queue) {
                await this.syncItem(item);
                await farmDB.clearSyncQueueItem(item.id);
            }
            
            console.log('Sync completed successfully');
            this.showSyncNotification('Data synchronized successfully', 'success');
            
        } catch (error) {
            console.error('Sync error:', error);
            this.showSyncNotification('Sync failed. Will retry later.', 'error');
        } finally {
            this.syncInProgress = false;
        }
    }
    
    async syncItem(item) {
        try {
            const response = await fetch(this.syncEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: item.action,
                    table: item.table,
                    recordId: item.recordId,
                    data: JSON.parse(item.data)
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            return await response.json();
            
        } catch (error) {
            console.error(`Failed to sync item ${item.id}:`, error);
            throw error;
        }
    }
    
    showSyncNotification(message, type) {
        // Update sync status indicator
        const syncIcon = document.querySelector('#syncStatus .material-icons');
        const app = window.app;
        
        if (app && app.showNotification) {
            app.showNotification(message, type);
        }
        
        // Visual feedback
        if (type === 'success') {
            syncIcon.style.animation = 'pulse 1s';
            setTimeout(() => {
                syncIcon.style.animation = '';
            }, 1000);
        }
    }
}

// Initialize sync manager
if (navigator.serviceWorker) {
    window.farmSync = new FarmFlowSync();
}
