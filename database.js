// database.js - Updated with more methods
class FarmFlowDatabase {
    constructor() {
        this.db = null;
        this.init();
    }
    
    async init() {
        this.db = new Dexie('FarmFlowDB');
        
        this.db.version(2).stores({
            transactions: '++id, date, type, enterprise, category, amount, currency, synced, createdAt',
            enterprises: '++id, name, type, color, icon, description, createdAt',
            budgets: '++id, enterprise, month, year, amount, spent, alerts, createdAt',
            invoices: '++id, number, customer, amount, date, status, items, createdAt',
            assets: '++id, name, type, value, purchaseDate, depreciation, status, createdAt',
            loans: '++id, provider, amount, interest, term, startDate, status, payments, createdAt'
        });
        
        await this.db.open();
        console.log('Database initialized');
    }
    
    // Enhanced transaction methods with enterprise stats
    async getEnterpriseStats(enterpriseName, period = 'month') {
        const transactions = await this.db.transactions.toArray();
        const now = new Date();
        let filteredTransactions = transactions;
        
        if (period === 'month') {
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            filteredTransactions = transactions.filter(t => {
                const transDate = new Date(t.date);
                return transDate.getMonth() === currentMonth && 
                       transDate.getFullYear() === currentYear &&
                       t.enterprise === enterpriseName;
            });
        } else if (period === 'year') {
            const currentYear = now.getFullYear();
            filteredTransactions = transactions.filter(t => {
                const transDate = new Date(t.date);
                return transDate.getFullYear() === currentYear &&
                       t.enterprise === enterpriseName;
            });
        }
        
        const income = filteredTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expense = filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        return {
            income,
            expense,
            net: income - expense,
            transactionCount: filteredTransactions.length
        };
    }
    
    async getBestPerformingEnterprise(period = 'month') {
        const enterprises = await this.db.enterprises.toArray();
        const transactions = await this.db.transactions.toArray();
        const now = new Date();
        
        let bestEnterprise = null;
        let bestNet = -Infinity;
        
        for (const enterprise of enterprises) {
            let filteredTransactions = transactions.filter(t => t.enterprise === enterprise.name);
            
            if (period === 'month') {
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                filteredTransactions = filteredTransactions.filter(t => {
                    const transDate = new Date(t.date);
                    return transDate.getMonth() === currentMonth && 
                           transDate.getFullYear() === currentYear;
                });
            }
            
            const income = filteredTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
            
            const expense = filteredTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
            
            const net = income - expense;
            
            if (net > bestNet) {
                bestNet = net;
                bestEnterprise = {
                    ...enterprise,
                    income,
                    expense,
                    net
                };
            }
        }
        
        return bestEnterprise;
    }
    
    // Other methods remain...
}

// Initialize database
document.addEventListener('DOMContentLoaded', () => {
    window.database = new FarmFlowDatabase();
});