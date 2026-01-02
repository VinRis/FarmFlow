// FarmFlow Synchronization Manager
class FarmFlowSync {
    constructor() {
        this.syncInterval = 5 * 60 * 1000; // 5 minutes
        this.maxRetries = 3;
        this.retryDelay = 5000; // 5 seconds
        this.isSyncing = false;
        this.pendingOperations = [];
        this.syncEnabled = true;
    }

    async initialize() {
        // Load sync settings
        const settings = await window.db.getSettings();
        this.syncEnabled = settings.auto_sync !== 'false';
        
        // Start sync interval
        if (this.syncEnabled) {
            this.startSyncInterval();
        }
        
        // Listen for online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        console.log('🔄 Sync manager initialized');
    }

    startSyncInterval() {
        setInterval(() => {
            if (navigator.onLine && this.syncEnabled && !this.isSyncing) {
                this.syncAllData();
            }
        }, this.syncInterval);
    }

    async handleOnline() {
        console.log('🌐 Online - starting sync');
        window.ui.showToast('Connection restored. Syncing data...', 'info');
        
        if (this.syncEnabled) {
            await this.syncAllData();
        }
    }

    handleOffline() {
        console.log('📴 Offline - queueing operations');
        window.ui.showToast('You are offline. Changes will sync when connection is restored.', 'warning');
    }

    async syncAllData() {
        if (this.isSyncing || !navigator.onLine) {
            return;
        }

        this.isSyncing = true;
        window.farmFlow?.updateSyncStatus('syncing');

        try {
            console.log('🔄 Starting full sync...');
            
            // Sync pending items
            const pendingCount = await window.db.getPendingSyncCount();
            if (pendingCount > 0) {
                await this.syncPendingTransactions();
            }
            
            // Sync other data types
            await this.syncEnterprises();
            await this.syncInventory();
            await this.syncAnimals();
            await this.syncCrops();
            
            // Clear synced items
            await window.db.clearSyncedItems();
            
            console.log('✅ Sync completed successfully');
            window.ui.showToast(`Sync completed. ${pendingCount} items synced.`, 'success');
            
            // Update UI
            window.farmFlow?.updateSyncStatus('online');
            
            // Refresh dashboard if needed
            if (window.farmFlow?.currentPage === 'dashboard') {
                window.farmFlow.refreshDashboard();
            }
        } catch (error) {
            console.error('❌ Sync failed:', error);
            window.ui.showToast('Sync failed. Will retry later.', 'error');
            
            // Retry logic
            await this.retrySync();
        } finally {
            this.isSyncing = false;
        }
    }

    async syncPendingTransactions() {
        const pendingItems = await window.db.getPendingSyncItems();
        
        for (const item of pendingItems) {
            try {
                await this.syncItem(item);
                await window.db.markAsSynced(item.id);
                
                // Update UI progress
                this.updateSyncProgress(pendingItems.indexOf(item) + 1, pendingItems.length);
            } catch (error) {
                console.error(`Failed to sync item ${item.id}:`, error);
                // Continue with next item
            }
        }
    }

    async syncItem(item) {
        // In a real app, this would send to your backend API
        // For now, simulate API call
        return this.simulateAPICall(item);
    }

    async simulateAPICall(item) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate 95% success rate
                if (Math.random() > 0.05) {
                    resolve({
                        success: true,
                        id: item.record_id,
                        synced_at: new Date().toISOString()
                    });
                } else {
                    reject(new Error('Simulated API failure'));
                }
            }, 100);
        });
    }

    async syncTransaction(transaction) {
        if (!navigator.onLine || !this.syncEnabled) {
            // Queue for later sync
            await window.db.addToSyncQueue('transactions', transaction.id, 'upsert', transaction);
            return;
        }

        try {
            await this.simulateAPICall({
                table_name: 'transactions',
                record_id: transaction.id,
                action: 'upsert',
                data: transaction
            });
            
            // Mark as synced in database
            await window.db.addToSyncQueue('transactions', transaction.id, 'upsert', transaction);
            await window.db.markAsSynced(Date.now().toString());
            
        } catch (error) {
            console.error('Failed to sync transaction:', error);
            // Queue for retry
            await window.db.addToSyncQueue('transactions', transaction.id, 'upsert', transaction);
        }
    }

    async syncEnterprises() {
        const enterprises = await window.db.getEnterprises();
        
        for (const enterprise of enterprises) {
            // Check if needs sync
            const pendingSync = await window.db.getPendingSyncCount();
            if (pendingSync > 0) {
                await this.syncItem({
                    table_name: 'enterprises',
                    record_id: enterprise.id,
                    action: 'upsert',
                    data: enterprise
                });
            }
        }
    }

    async syncInventory() {
        const inventory = await window.db.getInventory();
        
        for (const item of inventory) {
            // Similar sync logic as above
            // Implementation would depend on your backend API
        }
    }

    async syncAnimals() {
        const animals = await window.db.getAnimals();
        
        for (const animal of animals) {
            // Similar sync logic
        }
    }

    async syncCrops() {
        const crops = await window.db.getCrops();
        
        for (const crop of crops) {
            // Similar sync logic
        }
    }

    async retrySync() {
        let retryCount = 0;
        
        while (retryCount < this.maxRetries) {
            retryCount++;
            console.log(`🔄 Retry attempt ${retryCount} of ${this.maxRetries}`);
            
            await this.delay(this.retryDelay * retryCount);
            
            if (navigator.onLine) {
                try {
                    await this.syncAllData();
                    return;
                } catch (error) {
                    console.error(`Retry ${retryCount} failed:`, error);
                }
            }
        }
        
        console.error('Max retries exceeded');
        window.ui.showToast('Sync failed after multiple attempts. Please check connection.', 'error');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    updateSyncProgress(current, total) {
        // Update progress in UI if needed
        const progress = Math.round((current / total) * 100);
        
        // Could update a progress bar in the sync status
        const syncStatus = document.getElementById('sync-status');
        if (syncStatus && total > 1) {
            const text = syncStatus.querySelector('.sync-text');
            if (text) {
                text.textContent = `Syncing... ${progress}%`;
            }
        }
    }

    async toggleAutoSync(enabled) {
        this.syncEnabled = enabled;
        await window.db.saveSetting('auto_sync', enabled.toString());
        
        if (enabled && navigator.onLine) {
            await this.syncAllData();
        }
        
        window.ui.showToast(
            enabled ? 'Auto-sync enabled' : 'Auto-sync disabled',
            'info'
        );
    }

    async forceSync() {
        if (this.isSyncing) {
            window.ui.showToast('Sync already in progress', 'info');
            return;
        }
        
        if (!navigator.onLine) {
            window.ui.showToast('Cannot sync while offline', 'error');
            return;
        }
        
        window.ui.showLoading();
        
        try {
            await this.syncAllData();
            window.ui.showToast('Manual sync completed', 'success');
        } catch (error) {
            window.ui.showToast('Manual sync failed', 'error');
        } finally {
            window.ui.hideLoading();
        }
    }

    async getSyncStatus() {
        const pendingCount = await window.db.getPendingSyncCount();
        const lastSync = localStorage.getItem('last_sync');
        
        return {
            isOnline: navigator.onLine,
            isSyncing: this.isSyncing,
            syncEnabled: this.syncEnabled,
            pendingCount,
            lastSync: lastSync ? new Date(lastSync) : null,
            nextSync: new Date(Date.now() + this.syncInterval)
        };
    }

    async clearSyncQueue() {
        await window.db.syncQueue.clear();
        window.ui.showToast('Sync queue cleared', 'success');
    }

    // Conflict resolution
    async resolveConflict(localData, serverData) {
        // Simple conflict resolution: Use most recent update
        const localDate = new Date(localData.updated_at || localData.created_at);
        const serverDate = new Date(serverData.updated_at || serverData.created_at);
        
        if (localDate > serverDate) {
            return { resolved: localData, source: 'local' };
        } else {
            return { resolved: serverData, source: 'server' };
        }
    }

    // Batch operations
    async batchSync(operations) {
        if (!navigator.onLine) {
            // Queue all operations
            for (const op of operations) {
                await window.db.addToSyncQueue(op.table, op.id, op.action, op.data);
            }
            return;
        }

        try {
            // In a real app, send batch to API
            const results = await this.simulateBatchAPICall(operations);
            
            // Process results
            for (const result of results) {
                if (result.success) {
                    await window.db.markAsSynced(result.localId);
                } else {
                    console.warn('Batch operation failed:', result);
                }
            }
            
            return results;
        } catch (error) {
            console.error('Batch sync failed:', error);
            throw error;
        }
    }

    async simulateBatchAPICall(operations) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const results = operations.map(op => ({
                    success: Math.random() > 0.1, // 90% success rate
                    localId: op.id,
                    serverId: Math.random().toString(36).substr(2, 9)
                }));
                resolve(results);
            }, 500);
        });
    }
}

// Initialize sync manager
window.sync = new FarmFlowSync();

// Initialize when database is ready
window.db.initialize().then(() => {
    window.sync.initialize();
});
