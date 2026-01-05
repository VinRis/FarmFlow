// FarmFlow Database Manager
class FarmFlowDatabase {
    constructor() {
        this.db = new Dexie('FarmFlowDB');
        
        // Define schema
        this.db.version(3).stores({
            transactions: '++id, date, type, amount, enterpriseId, category, description, notes, syncStatus',
            enterprises: '++id, name, type, description, createdAt, isActive',
            categories: '++id, name, type, enterpriseId',
            users: '++id, name, farmName, currency, language',
            settings: 'key, value',
            syncQueue: '++id, table, recordId, action, timestamp'
        });
        
        this.initializeDefaults();
    }
    
    async initializeDefaults() {
        // Create default enterprises if none exist
        const enterpriseCount = await this.db.enterprises.count();
        if (enterpriseCount === 0) {
            const defaultEnterprises = [
                { name: 'Dairy Farming', type: 'livestock', description: 'Milk production and dairy products', isActive: true, createdAt: new Date() },
                { name: 'Poultry', type: 'poultry', description: 'Chicken eggs and meat production', isActive: true, createdAt: new Date() },
                { name: 'Crop Farming', type: 'crops', description: 'Maize, beans, vegetables', isActive: true, createdAt: new Date() },
                { name: 'Horticulture', type: 'crops', description: 'Fruits and vegetables', isActive: true, createdAt: new Date() }
            ];
            
            await this.db.enterprises.bulkAdd(defaultEnterprises);
            
            // Add default categories for each enterprise type
            const categories = [
                // Income categories
                { name: 'Milk Sales', type: 'income', enterpriseId: 1 },
                { name: 'Egg Sales', type: 'income', enterpriseId: 2 },
                { name: 'Crop Sales', type: 'income', enterpriseId: 3 },
                { name: 'Vegetable Sales', type: 'income', enterpriseId: 4 },
                
                // Expense categories
                { name: 'Animal Feed', type: 'expense', enterpriseId: 1 },
                { name: 'Veterinary', type: 'expense', enterpriseId: 1 },
                { name: 'Labor', type: 'expense', enterpriseId: null },
                { name: 'Seeds', type: 'expense', enterpriseId: 3 },
                { name: 'Fertilizer', type: 'expense', enterpriseId: 3 },
                { name: 'Equipment', type: 'expense', enterpriseId: null },
                { name: 'Transport', type: 'expense', enterpriseId: null }
            ];
            
            await this.db.categories.bulkAdd(categories);
        }
        
        // Initialize user settings
        const userCount = await this.db.users.count();
        if (userCount === 0) {
            await this.db.users.add({
                name: 'Farmer',
                farmName: 'Family Farm',
                currency: 'KES',
                language: 'en',
                createdAt: new Date()
            });
        }
    }
    
    // Transaction Methods
    async addTransaction(transaction) {
        const tx = {
            ...transaction,
            date: new Date(transaction.date),
            amount: parseFloat(transaction.amount),
            syncStatus: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const id = await this.db.transactions.add(tx);
        
        // Add to sync queue
        await this.addToSyncQueue('transactions', id, 'create', tx);
        
        // Emit event for UI updates
        this.emitDataChange('transactions', { action: 'add', id });
        
        return id;
    }
    
    async updateTransaction(id, updates) {
        updates.updatedAt = new Date();
        updates.syncStatus = 'pending';
        
        await this.db.transactions.update(id, updates);
        await this.addToSyncQueue('transactions', id, 'update', updates);
        
        this.emitDataChange('transactions', { action: 'update', id });
    }
    
    async deleteTransaction(id) {
        const transaction = await this.db.transactions.get(id);
        await this.db.transactions.delete(id);
        await this.addToSyncQueue('transactions', id, 'delete', transaction);
        
        this.emitDataChange('transactions', { action: 'delete', id });
    }
    
    async getTransactions(filters = {}) {
        let collection = this.db.transactions.orderBy('date').reverse();
        
        if (filters.enterpriseId) {
            collection = collection.filter(tx => tx.enterpriseId === filters.enterpriseId);
        }
        
        if (filters.type) {
            collection = collection.filter(tx => tx.type === filters.type);
        }
        
        if (filters.startDate && filters.endDate) {
            const start = new Date(filters.startDate);
            const end = new Date(filters.endDate);
            collection = collection.filter(tx => {
                const txDate = new Date(tx.date);
                return txDate >= start && txDate <= end;
            });
        }
        
        if (filters.search) {
            const search = filters.search.toLowerCase();
            collection = collection.filter(tx => 
                tx.description.toLowerCase().includes(search) ||
                (tx.notes && tx.notes.toLowerCase().includes(search))
            );
        }
        
        return await collection.toArray();
    }
    
    async getRecentTransactions(limit = 10) {
        return await this.db.transactions
            .orderBy('date')
            .reverse()
            .limit(limit)
            .toArray();
    }
    
    // Enterprise Methods
    async addEnterprise(enterprise) {
        const ent = {
            ...enterprise,
            isActive: true,
            createdAt: new Date(),
            syncStatus: 'pending'
        };
        
        const id = await this.db.enterprises.add(ent);
        await this.addToSyncQueue('enterprises', id, 'create', ent);
        
        this.emitDataChange('enterprises', { action: 'add', id });
        return id;
    }
    
    async getEnterprises(activeOnly = true) {
        if (activeOnly) {
            return await this.db.enterprises
                .where('isActive')
                .equals(true)
                .toArray();
        }
        return await this.db.enterprises.toArray();
    }
    
    // Statistics Methods
    async getFinancialStats(startDate, endDate) {
        const transactions = await this.getTransactions({ startDate, endDate });
        
        const stats = {
            totalIncome: 0,
            totalExpenses: 0,
            netBalance: 0,
            byEnterprise: {},
            byCategory: {}
        };
        
        transactions.forEach(tx => {
            const amount = parseFloat(tx.amount);
            
            if (tx.type === 'income') {
                stats.totalIncome += amount;
            } else {
                stats.totalExpenses += amount;
            }
            
            // Group by enterprise
            if (tx.enterpriseId) {
                if (!stats.byEnterprise[tx.enterpriseId]) {
                    stats.byEnterprise[tx.enterpriseId] = {
                        income: 0,
                        expenses: 0
                    };
                }
                
                if (tx.type === 'income') {
                    stats.byEnterprise[tx.enterpriseId].income += amount;
                } else {
                    stats.byEnterprise[tx.enterpriseId].expenses += amount;
                }
            }
            
            // Group by category
            if (tx.category) {
                if (!stats.byCategory[tx.category]) {
                    stats.byCategory[tx.category] = {
                        income: 0,
                        expenses: 0
                    };
                }
                
                if (tx.type === 'income') {
                    stats.byCategory[tx.category].income += amount;
                } else {
                    stats.byCategory[tx.category].expenses += amount;
                }
            }
        });
        
        stats.netBalance = stats.totalIncome - stats.totalExpenses;
        return stats;
    }
    
    // Sync Queue Methods
    async addToSyncQueue(table, recordId, action, data) {
        if (!navigator.onLine) {
            return; // Only queue if offline
        }
        
        await this.db.syncQueue.add({
            table,
            recordId,
            action,
            data: JSON.stringify(data),
            timestamp: new Date(),
            attempts: 0
        });
    }
    
    async getSyncQueue() {
        return await this.db.syncQueue.toArray();
    }
    
    async clearSyncQueueItem(id) {
        await this.db.syncQueue.delete(id);
    }
    
    // Event System for UI Updates
    emitDataChange(table, details) {
        const event = new CustomEvent('data-changed', {
            detail: { table, ...details }
        });
        window.dispatchEvent(event);
    }
    
    // User Settings
    async getUserSettings() {
        const user = await this.db.users.orderBy('id').first();
        return user || {};
    }
    
    async updateUserSettings(updates) {
        const user = await this.getUserSettings();
        if (user.id) {
            await this.db.users.update(user.id, updates);
        }
    }
    
    // Categories
    async getCategories(type = null, enterpriseId = null) {
        let collection = this.db.categories;
        
        if (type) {
            collection = collection.where('type').equals(type);
        }
        
        if (enterpriseId) {
            collection = collection.where('enterpriseId').equals(enterpriseId);
        }
        
        return await collection.toArray();
    }
}

// Create global database instance
window.farmDB = new FarmFlowDatabase();
