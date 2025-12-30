// database.js - Simplified version
class FarmFlowDatabase {
    constructor() {
        this.db = null;
        this.init();
    }
    
    async init() {
        this.db = new Dexie('FarmFlowDB');
        
        this.db.version(1).stores({
            transactions: '++id, date, type, enterprise, category, amount, currency, synced, createdAt',
            enterprises: '++id, name, type, color, description, createdAt',
            budgets: '++id, enterprise, month, year, amount, spent, createdAt',
            loans: '++id, provider, amount, interest, term, startDate, status, createdAt',
            assets: '++id, name, type, value, purchaseDate, depreciation, createdAt'
        });
        
        await this.db.open();
        console.log('Database initialized');
    }
    
    // Transaction methods
    async addTransaction(transaction) {
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
    
    async searchTransactions(query) {
        const allTransactions = await this.db.transactions.toArray();
        return allTransactions.filter(t => 
            t.category.toLowerCase().includes(query.toLowerCase()) ||
            t.enterprise.toLowerCase().includes(query.toLowerCase()) ||
            (t.note && t.note.toLowerCase().includes(query.toLowerCase()))
        );
    }
    
    // Enterprise methods
    async addEnterprise(enterprise) {
        return await this.db.enterprises.add(enterprise);
    }
    
    async getEnterprises() {
        return await this.db.enterprises.toArray();
    }
    
    async getEnterprise(id) {
        return await this.db.enterprises.get(id);
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
        
        // Clear existing data
        await this.db.transactions.clear();
        await this.db.enterprises.clear();
        await this.db.budgets.clear();
        await this.db.loans.clear();
        await this.db.assets.clear();
        
        // Import new data
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
}

// Initialize database when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.database = new FarmFlowDatabase();
});