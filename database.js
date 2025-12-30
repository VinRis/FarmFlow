// database.js
class FarmFlowDatabase {
    constructor() {
        this.db = null;
        this.init();
    }
    
    async init() {
        this.db = new Dexie('FarmFlowDB');
        
        this.db.version(1).stores({
            transactions: '++id, date, type, enterprise, category, amount, currency, synced, createdAt',
            enterprises: '++id, name, type, color, icon, createdAt',
            budgets: '++id, enterprise, month, year, amount, spent, createdAt',
            loans: '++id, provider, amount, interest, term, startDate, status, createdAt',
            assets: '++id, name, type, value, purchaseDate, depreciation, createdAt',
            syncQueue: '++id, action, table, data, timestamp, status'
        });
        
        await this.db.open();
        console.log('Database initialized');
    }
    
    // Transaction methods
    async addTransaction(transaction) {
        transaction.createdAt = new Date().toISOString();
        return await this.db.transactions.add(transaction);
    }
    
    async getTransactions(filters = {}) {
        let collection = this.db.transactions.orderBy('date');
        
        if (filters.type) {
            collection = collection.filter(t => t.type === filters.type);
        }
        
        if (filters.enterprise) {
            collection = collection.filter(t => t.enterprise === filters.enterprise);
        }
        
        if (filters.startDate && filters.endDate) {
            collection = collection.filter(t => {
                const date = new Date(t.date);
                return date >= new Date(filters.startDate) && 
                       date <= new Date(filters.endDate);
            });
        }
        
        return await collection.reverse().toArray();
    }
    
    async getTransaction(id) {
        return await this.db.transactions.get(id);
    }
    
    async updateTransaction(id, updates) {
        return await this.db.transactions.update(id, updates);
    }
    
    async deleteTransaction(id) {
        return await this.db.transactions.delete(id);
    }
    
    async getMonthlySummary(year, month) {
        const transactions = await this.db.transactions
            .filter(t => {
                const date = new Date(t.date);
                return date.getFullYear() === year && 
                       date.getMonth() === month;
            })
            .toArray();
        
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        return {
            income,
            expense,
            net: income - expense,
            transactionCount: transactions.length
        };
    }
    
    // Enterprise methods
    async addEnterprise(enterprise) {
        enterprise.createdAt = new Date().toISOString();
        return await this.db.enterprises.add(enterprise);
    }
    
    async getEnterprises() {
        return await this.db.enterprises.toArray();
    }
    
    // Budget methods
    async setBudget(enterprise, month, year, amount) {
        const existing = await this.db.budgets
            .where({ enterprise, month, year })
            .first();
        
        if (existing) {
            return await this.db.budgets.update(existing.id, { amount });
        } else {
            return await this.db.budgets.add({
                enterprise,
                month,
                year,
                amount,
                spent: 0,
                createdAt: new Date().toISOString()
            });
        }
    }
    
    // Sync queue methods
    async addToSyncQueue(action, table, data) {
        return await this.db.syncQueue.add({
            action,
            table,
            data,
            timestamp: new Date().toISOString(),
            status: 'pending'
        });
    }
    
    async getPendingSyncItems() {
        return await this.db.syncQueue
            .where('status')
            .equals('pending')
            .toArray();
    }
    
    async markSyncComplete(id) {
        return await this.db.syncQueue.update(id, { status: 'complete' });
    }
    
    // Export/Import methods
    async exportData() {
        const data = {
            transactions: await this.db.transactions.toArray(),
            enterprises: await this.db.enterprises.toArray(),
            budgets: await this.db.budgets.toArray(),
            loans: await this.db.loans.toArray(),
            assets: await this.db.assets.toArray(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        return JSON.stringify(data, null, 2);
    }
    
    async importData(jsonData) {
        const data = JSON.parse(jsonData);
        
        await this.db.transactions.clear();
        await this.db.enterprises.clear();
        await this.db.budgets.clear();
        await this.db.loans.clear();
        await this.db.assets.clear();
        
        if (data.transactions) {
            await this.db.transactions.bulkAdd(data.transactions);
        }
        
        if (data.enterprises) {
            await this.db.enterprises.bulkAdd(data.enterprises);
        }
        
        if (data.budgets) {
            await this.db.budgets.bulkAdd(data.budgets);
        }
        
        if (data.loans) {
            await this.db.loans.bulkAdd(data.loans);
        }
        
        if (data.assets) {
            await this.db.assets.bulkAdd(data.assets);
        }
        
        return true;
    }
    
    // Backup methods
    async createBackup() {
        const data = await this.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        return {
            url,
            date: new Date().toISOString(),
            size: blob.size
        };
    }
    
    // Search methods
    async searchTransactions(query) {
        return await this.db.transactions
            .filter(t => {
                return t.category.toLowerCase().includes(query.toLowerCase()) ||
                       t.enterprise.toLowerCase().includes(query.toLowerCase()) ||
                       (t.note && t.note.toLowerCase().includes(query.toLowerCase()));
            })
            .toArray();
    }
}

// Initialize database
const database = new FarmFlowDatabase();