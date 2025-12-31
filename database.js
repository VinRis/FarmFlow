// database.js - Simplified working version
class FarmFlowDatabase {
    constructor() {
        this.db = null;
        this.init();
    }
    
    async init() {
        this.db = new Dexie('FarmFlowDB');
        
        this.db.version(1).stores({
            transactions: '++id, date, type, enterprise, category, amount, currency, note, synced, createdAt',
            enterprises: '++id, name, type, color, description, createdAt'
        });
        
        await this.db.open();
        console.log('Database initialized');
        
        // Add default enterprises if none exist
        const enterpriseCount = await this.db.enterprises.count();
        if (enterpriseCount === 0) {
            await this.db.enterprises.bulkAdd([
                { name: 'Dairy', type: 'dairy', color: '#2196F3', description: 'Dairy farming', createdAt: new Date().toISOString() },
                { name: 'Poultry', type: 'poultry', color: '#FF9800', description: 'Poultry farming', createdAt: new Date().toISOString() },
                { name: 'Crops', type: 'crops', color: '#4CAF50', description: 'Crop farming', createdAt: new Date().toISOString() },
                { name: 'Livestock', type: 'livestock', color: '#795548', description: 'Livestock farming', createdAt: new Date().toISOString() }
            ]);
        }
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
        
        return await collection.reverse().toArray();
    }
    
    async getTransaction(id) {
        return await this.db.transactions.get(id);
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
    
    // Export/Import
    async exportData() {
        const data = {
            transactions: await this.db.transactions.toArray(),
            enterprises: await this.db.enterprises.toArray(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        return JSON.stringify(data, null, 2);
    }
    
    async importData(jsonData) {
        const data = JSON.parse(jsonData);
        
        await this.db.transactions.clear();
        await this.db.enterprises.clear();
        
        if (data.transactions) {
            await this.db.transactions.bulkAdd(data.transactions);
        }
        
        if (data.enterprises) {
            await this.db.enterprises.bulkAdd(data.enterprises);
        }
        
        return true;
    }
}

// Initialize database
document.addEventListener('DOMContentLoaded', () => {
    window.database = new FarmFlowDatabase();
});
