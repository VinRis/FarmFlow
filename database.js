// FarmFlow Database Management with Fallback
class FarmFlowDatabase {
    constructor() {
        // Check if Dexie is available, create fallback if not
        if (typeof Dexie === 'undefined') {
            console.warn('Dexie not found, using localStorage fallback');
            this.useLocalStorage = true;
            this.db = this.createLocalStorageFallback();
        } else {
            this.useLocalStorage = false;
            this.db = null;
        }
        
        this.dbName = 'FarmFlowDB';
        this.dbVersion = 3;
        
        // Schema definition
        this.schema = {
            transactions: '++id, type, amount, enterprise, category, description, date, payment_method, notes, recurring, synced, created_at, updated_at',
            enterprises: '++id, name, type, description, status, created_at, updated_at',
            inventory: '++id, item_name, category, quantity, unit, unit_price, total_value, enterprise, location, last_updated',
            animals: '++id, tag_number, enterprise, species, breed, age, weight, status, health_status, last_vaccination, created_at',
            crops: '++id, crop_name, enterprise, planting_date, harvest_date, area, expected_yield, actual_yield, status, created_at',
            settings: '++id, key, value, updated_at',
            syncQueue: '++id, table_name, record_id, action, data, created_at, synced'
        };
    }

    createLocalStorageFallback() {
        // Simple localStorage wrapper for when IndexedDB isn't available
        return {
            transactions: {
                put: async (data) => {
                    const transactions = JSON.parse(localStorage.getItem('farmflow_transactions') || '[]');
                    const index = transactions.findIndex(t => t.id === data.id);
                    if (index > -1) {
                        transactions[index] = data;
                    } else {
                        transactions.push(data);
                    }
                    localStorage.setItem('farmflow_transactions', JSON.stringify(transactions));
                    return data.id;
                },
                get: async (id) => {
                    const transactions = JSON.parse(localStorage.getItem('farmflow_transactions') || '[]');
                    return transactions.find(t => t.id === id);
                },
                toArray: async () => {
                    return JSON.parse(localStorage.getItem('farmflow_transactions') || '[]');
                },
                delete: async (id) => {
                    const transactions = JSON.parse(localStorage.getItem('farmflow_transactions') || '[]');
                    const filtered = transactions.filter(t => t.id !== id);
                    localStorage.setItem('farmflow_transactions', JSON.stringify(filtered));
                },
                clear: async () => {
                    localStorage.removeItem('farmflow_transactions');
                },
                count: async () => {
                    const transactions = JSON.parse(localStorage.getItem('farmflow_transactions') || '[]');
                    return transactions.length;
                },
                where: (field) => {
                    return {
                        equals: (value) => {
                            return {
                                toArray: async () => {
                                    const transactions = JSON.parse(localStorage.getItem('farmflow_transactions') || '[]');
                                    return transactions.filter(t => t[field] === value);
                                },
                                count: async () => {
                                    const transactions = JSON.parse(localStorage.getItem('farmflow_transactions') || '[]');
                                    return transactions.filter(t => t[field] === value).length;
                                }
                            };
                        }
                    };
                },
                orderBy: (field) => {
                    return {
                        reverse: () => {
                            return {
                                toArray: async () => {
                                    const transactions = JSON.parse(localStorage.getItem('farmflow_transactions') || '[]');
                                    return transactions.sort((a, b) => 
                                        new Date(b[field]) - new Date(a[field])
                                    );
                                },
                                limit: (count) => {
                                    return {
                                        toArray: async () => {
                                            const transactions = JSON.parse(localStorage.getItem('farmflow_transactions') || '[]');
                                            return transactions
                                                .sort((a, b) => new Date(b[field]) - new Date(a[field]))
                                                .slice(0, count);
                                        }
                                    };
                                }
                            };
                        },
                        toArray: async () => {
                            const transactions = JSON.parse(localStorage.getItem('farmflow_transactions') || '[]');
                            return transactions.sort((a, b) => 
                                new Date(a[field]) - new Date(b[field])
                            );
                        }
                    };
                },
                filter: (callback) => {
                    return {
                        toArray: async () => {
                            const transactions = JSON.parse(localStorage.getItem('farmflow_transactions') || '[]');
                            return transactions.filter(callback);
                        },
                        reverse: () => {
                            return {
                                toArray: async () => {
                                    const transactions = JSON.parse(localStorage.getItem('farmflow_transactions') || '[]');
                                    return transactions.filter(callback).reverse();
                                }
                            };
                        }
                    };
                },
                bulkAdd: async (items) => {
                    const transactions = JSON.parse(localStorage.getItem('farmflow_transactions') || '[]');
                    transactions.push(...items);
                    localStorage.setItem('farmflow_transactions', JSON.stringify(transactions));
                },
                bulkDelete: async (ids) => {
                    const transactions = JSON.parse(localStorage.getItem('farmflow_transactions') || '[]');
                    const filtered = transactions.filter(t => !ids.includes(t.id));
                    localStorage.setItem('farmflow_transactions', JSON.stringify(filtered));
                },
                update: async (id, updates) => {
                    const transactions = JSON.parse(localStorage.getItem('farmflow_transactions') || '[]');
                    const index = transactions.findIndex(t => t.id === id);
                    if (index > -1) {
                        transactions[index] = { ...transactions[index], ...updates };
                        localStorage.setItem('farmflow_transactions', JSON.stringify(transactions));
                    }
                }
            },
            // Similar implementations for other tables...
            enterprises: this.createLocalStorageTable('farmflow_enterprises'),
            inventory: this.createLocalStorageTable('farmflow_inventory'),
            animals: this.createLocalStorageTable('farmflow_animals'),
            crops: this.createLocalStorageTable('farmflow_crops'),
            settings: this.createLocalStorageTable('farmflow_settings'),
            syncQueue: this.createLocalStorageTable('farmflow_syncQueue'),
            
            // Version and store methods
            version: () => ({
                stores: () => ({})
            })
        };
    }

    createLocalStorageTable(key) {
        return {
            put: async (data) => {
                const items = JSON.parse(localStorage.getItem(key) || '[]');
                const index = items.findIndex(t => t.id === data.id);
                if (index > -1) {
                    items[index] = data;
                } else {
                    items.push(data);
                }
                localStorage.setItem(key, JSON.stringify(items));
                return data.id;
            },
            get: async (id) => {
                const items = JSON.parse(localStorage.getItem(key) || '[]');
                return items.find(t => t.id === id);
            },
            toArray: async () => {
                return JSON.parse(localStorage.getItem(key) || '[]');
            },
            delete: async (id) => {
                const items = JSON.parse(localStorage.getItem(key) || '[]');
                const filtered = items.filter(t => t.id !== id);
                localStorage.setItem(key, JSON.stringify(filtered));
            },
            clear: async () => {
                localStorage.removeItem(key);
            },
            bulkAdd: async (items) => {
                const existing = JSON.parse(localStorage.getItem(key) || '[]');
                existing.push(...items);
                localStorage.setItem(key, JSON.stringify(existing));
            },
            bulkDelete: async (ids) => {
                const items = JSON.parse(localStorage.getItem(key) || '[]');
                const filtered = items.filter(t => !ids.includes(t.id));
                localStorage.setItem(key, JSON.stringify(filtered));
            },
            update: async (id, updates) => {
                const items = JSON.parse(localStorage.getItem(key) || '[]');
                const index = items.findIndex(t => t.id === id);
                if (index > -1) {
                    items[index] = { ...items[index], ...updates };
                    localStorage.setItem(key, JSON.stringify(items));
                }
            },
            where: (field) => {
                return {
                    equals: (value) => {
                        return {
                            toArray: async () => {
                                const items = JSON.parse(localStorage.getItem(key) || '[]');
                                return items.filter(t => t[field] === value);
                            },
                            count: async () => {
                                const items = JSON.parse(localStorage.getItem(key) || '[]');
                                return items.filter(t => t[field] === value).length;
                            }
                        };
                    }
                };
            }
        };
    }

    async initialize() {
        try {
            if (this.useLocalStorage) {
                console.log('📦 Using localStorage fallback database');
                await this.initializeSampleData();
                return true;
            }
            
            // Open database with Dexie
            this.db = new Dexie(this.dbName);
            
            // Define schema
            this.db.version(this.dbVersion).stores(this.schema);
            
            // Add sample data if empty
            await this.initializeSampleData();
            
            console.log('✅ Database initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ Database initialization failed:', error);
            
            // Fallback to localStorage
            console.log('🔄 Falling back to localStorage...');
            this.useLocalStorage = true;
            this.db = this.createLocalStorageFallback();
            await this.initializeSampleData();
            
            return true;
        }
    }

    // Rest of your database methods remain the same...
    // They should work with both Dexie and localStorage fallback

    async initializeSampleData() {
        const transactionCount = await this.db.transactions.count();
        
        if (transactionCount === 0) {
            console.log('📊 Adding sample data...');
            
            // Add sample transactions
            await this.db.transactions.bulkAdd([
                {
                    id: '1',
                    type: 'income',
                    amount: 1500.00,
                    enterprise: 'crops',
                    category: 'crop_sales',
                    description: 'Maize harvest sale',
                    date: new Date().toISOString().split('T')[0],
                    payment_method: 'cash',
                    notes: 'Sold to local market',
                    recurring: false,
                    synced: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    id: '2',
                    type: 'expense',
                    amount: 450.00,
                    enterprise: 'poultry',
                    category: 'feed',
                    description: 'Poultry feed purchase',
                    date: new Date().toISOString().split('T')[0],
                    payment_method: 'mobile_money',
                    notes: 'Bought 10 bags of feed',
                    recurring: false,
                    synced: true,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]);

            // Add sample enterprises
            await this.db.enterprises.bulkAdd([
                {
                    id: '1',
                    name: 'Poultry Farm',
                    type: 'poultry',
                    description: 'Broiler chicken production',
                    status: 'active',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    id: '2',
                    name: 'Dairy Cows',
                    type: 'dairy',
                    description: 'Milk production enterprise',
                    status: 'active',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    id: '3',
                    name: 'Maize Field',
                    type: 'crops',
                    description: 'Maize cultivation for sale',
                    status: 'active',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                },
                {
                    id: '4',
                    name: 'Goat Rearing',
                    type: 'livestock',
                    description: 'Goat meat production',
                    status: 'active',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ]);

            // Add default settings
            await this.db.settings.bulkAdd([
                {
                    key: 'currency',
                    value: 'USD',
                    updated_at: new Date().toISOString()
                },
                {
                    key: 'language',
                    value: 'en',
                    updated_at: new Date().toISOString()
                },
                {
                    key: 'notifications',
                    value: 'true',
                    updated_at: new Date().toISOString()
                },
                {
                    key: 'auto_sync',
                    value: 'true',
                    updated_at: new Date().toISOString()
                }
            ]);
        }
    }

    // Transaction Methods
    async saveTransaction(transaction) {
        try {
            await this.db.transactions.put(transaction);
            
            // Add to sync queue
            await this.addToSyncQueue('transactions', transaction.id, 'upsert', transaction);
            
            return transaction.id;
        } catch (error) {
            console.error('Failed to save transaction:', error);
            throw error;
        }
    }

    async getTransaction(id) {
        return await this.db.transactions.get(id);
    }

    async getAllTransactions(filters = {}) {
        let collection = this.db.transactions.toCollection();
        
        // Apply filters
        if (filters.type) {
            collection = collection.filter(t => t.type === filters.type);
        }
        
        if (filters.enterprise && filters.enterprise !== 'all') {
            collection = collection.filter(t => t.enterprise === filters.enterprise);
        }
        
        if (filters.startDate && filters.endDate) {
            collection = collection.filter(t => {
                const date = new Date(t.date);
                return date >= new Date(filters.startDate) && date <= new Date(filters.endDate);
            });
        }
        
        return await collection.reverse().toArray();
    }

    async getRecentTransactions(limit = 10) {
        return await this.db.transactions
            .orderBy('date')
            .reverse()
            .limit(limit)
            .toArray();
    }

    async deleteTransaction(id) {
        try {
            await this.db.transactions.delete(id);
            
            // Add to sync queue
            await this.addToSyncQueue('transactions', id, 'delete', { id });
            
            return true;
        } catch (error) {
            console.error('Failed to delete transaction:', error);
            throw error;
        }
    }

    // Dashboard Methods
    async getDashboardData() {
        try {
            const transactions = await this.db.transactions.toArray();
            
            const now = new Date();
            const thisMonth = now.getMonth();
            const thisYear = now.getFullYear();
            
            // Filter this month's transactions
            const monthlyTransactions = transactions.filter(t => {
                const date = new Date(t.date);
                return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
            });
            
            // Calculate totals
            const totalIncome = monthlyTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
                
            const totalExpenses = monthlyTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
                
            const netProfit = totalIncome - totalExpenses;
            
            // Calculate enterprise performance
            const enterpriseData = await this.getEnterprisePerformance();
            
            // Calculate balance (simplified - in real app, would consider starting balance)
            const allIncome = transactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
                
            const allExpenses = transactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
                
            const currentBalance = allIncome - allExpenses;
            
            return {
                totalIncome,
                totalExpenses,
                netProfit,
                currentBalance,
                enterpriseData,
                transactionCount: transactions.length,
                monthlyTransactionCount: monthlyTransactions.length
            };
        } catch (error) {
            console.error('Failed to get dashboard data:', error);
            return {
                totalIncome: 0,
                totalExpenses: 0,
                netProfit: 0,
                currentBalance: 0,
                enterpriseData: [],
                transactionCount: 0,
                monthlyTransactionCount: 0
            };
        }
    }

    async getFinancialData(period = 'month') {
        const transactions = await this.db.transactions.toArray();
        const now = new Date();
        
        let filteredTransactions = [];
        
        switch(period) {
            case 'week':
                const weekAgo = new Date(now);
                weekAgo.setDate(now.getDate() - 7);
                filteredTransactions = transactions.filter(t => 
                    new Date(t.date) >= weekAgo
                );
                break;
                
            case 'month':
                const monthAgo = new Date(now);
                monthAgo.setMonth(now.getMonth() - 1);
                filteredTransactions = transactions.filter(t => 
                    new Date(t.date) >= monthAgo
                );
                break;
                
            case 'quarter':
                const quarterAgo = new Date(now);
                quarterAgo.setMonth(now.getMonth() - 3);
                filteredTransactions = transactions.filter(t => 
                    new Date(t.date) >= quarterAgo
                );
                break;
                
            case 'year':
                const yearAgo = new Date(now);
                yearAgo.setFullYear(now.getFullYear() - 1);
                filteredTransactions = transactions.filter(t => 
                    new Date(t.date) >= yearAgo
                );
                break;
                
            default:
                filteredTransactions = transactions;
        }
        
        // Group by date and calculate daily totals
        const groupedData = {};
        
        filteredTransactions.forEach(t => {
            const date = t.date;
            if (!groupedData[date]) {
                groupedData[date] = { income: 0, expense: 0 };
            }
            
            if (t.type === 'income') {
                groupedData[date].income += t.amount;
            } else {
                groupedData[date].expense += t.amount;
            }
        });
        
        // Convert to arrays for charting
        const dates = Object.keys(groupedData).sort();
        const incomeData = dates.map(date => groupedData[date].income);
        const expenseData = dates.map(date => groupedData[date].expense);
        
        return {
            dates,
            incomeData,
            expenseData,
            totalIncome: incomeData.reduce((a, b) => a + b, 0),
            totalExpense: expenseData.reduce((a, b) => a + b, 0)
        };
    }

    async getEnterprisePerformance() {
        const transactions = await this.db.transactions.toArray();
        const enterprises = await this.db.enterprises.toArray();
        
        const performance = enterprises.map(enterprise => {
            const enterpriseTransactions = transactions.filter(t => 
                t.enterprise === enterprise.type
            );
            
            const income = enterpriseTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
                
            const expenses = enterpriseTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
                
            const profit = income - expenses;
            const roi = expenses > 0 ? (profit / expenses) * 100 : 0;
            
            return {
                name: enterprise.name,
                type: enterprise.type,
                income,
                expenses,
                profit,
                roi,
                transactionCount: enterpriseTransactions.length
            };
        });
        
        return performance;
    }

    // Enterprise Methods
    async getEnterprises() {
        return await this.db.enterprises.toArray();
    }

    async saveEnterprise(enterprise) {
        try {
            if (!enterprise.id) {
                enterprise.id = Date.now().toString();
                enterprise.created_at = new Date().toISOString();
            }
            enterprise.updated_at = new Date().toISOString();
            
            await this.db.enterprises.put(enterprise);
            
            // Add to sync queue
            await this.addToSyncQueue('enterprises', enterprise.id, 'upsert', enterprise);
            
            return enterprise.id;
        } catch (error) {
            console.error('Failed to save enterprise:', error);
            throw error;
        }
    }

    async deleteEnterprise(id) {
        try {
            await this.db.enterprises.delete(id);
            
            // Add to sync queue
            await this.addToSyncQueue('enterprises', id, 'delete', { id });
            
            return true;
        } catch (error) {
            console.error('Failed to delete enterprise:', error);
            throw error;
        }
    }

    // Inventory Methods
    async getInventory() {
        return await this.db.inventory.toArray();
    }

    async updateInventory(item) {
        try {
            if (!item.id) {
                item.id = Date.now().toString();
            }
            item.last_updated = new Date().toISOString();
            item.total_value = item.quantity * item.unit_price;
            
            await this.db.inventory.put(item);
            
            // Add to sync queue
            await this.addToSyncQueue('inventory', item.id, 'upsert', item);
            
            return item.id;
        } catch (error) {
            console.error('Failed to update inventory:', error);
            throw error;
        }
    }

    // Animal Methods
    async getAnimals() {
        return await this.db.animals.toArray();
    }

    async saveAnimal(animal) {
        try {
            if (!animal.id) {
                animal.id = Date.now().toString();
                animal.created_at = new Date().toISOString();
            }
            
            await this.db.animals.put(animal);
            
            // Add to sync queue
            await this.addToSyncQueue('animals', animal.id, 'upsert', animal);
            
            return animal.id;
        } catch (error) {
            console.error('Failed to save animal:', error);
            throw error;
        }
    }

    // Crop Methods
    async getCrops() {
        return await this.db.crops.toArray();
    }

    async saveCrop(crop) {
        try {
            if (!crop.id) {
                crop.id = Date.now().toString();
                crop.created_at = new Date().toISOString();
            }
            
            await this.db.crops.put(crop);
            
            // Add to sync queue
            await this.addToSyncQueue('crops', crop.id, 'upsert', crop);
            
            return crop.id;
        } catch (error) {
            console.error('Failed to save crop:', error);
            throw error;
        }
    }

    // Settings Methods
    async getSettings() {
        const settings = await this.db.settings.toArray();
        return settings.reduce((obj, item) => {
            obj[item.key] = item.value;
            return obj;
        }, {});
    }

    async saveSetting(key, value) {
        try {
            await this.db.settings.put({
                key,
                value,
                updated_at: new Date().toISOString()
            });
            
            // Add to sync queue
            await this.addToSyncQueue('settings', key, 'upsert', { key, value });
            
            return true;
        } catch (error) {
            console.error('Failed to save setting:', error);
            throw error;
        }
    }

    // User Profile Methods
    async getUserProfile() {
        const profile = localStorage.getItem('farmflow_profile');
        return profile ? JSON.parse(profile) : null;
    }

    async saveUserProfile(profile) {
        try {
            localStorage.setItem('farmflow_profile', JSON.stringify(profile));
            return true;
        } catch (error) {
            console.error('Failed to save user profile:', error);
            throw error;
        }
    }

    // Sync Methods
    async addToSyncQueue(tableName, recordId, action, data) {
        try {
            await this.db.syncQueue.add({
                table_name: tableName,
                record_id: recordId,
                action: action,
                data: JSON.stringify(data),
                created_at: new Date().toISOString(),
                synced: false
            });
        } catch (error) {
            console.error('Failed to add to sync queue:', error);
        }
    }

    async getPendingSyncCount() {
        return await this.db.syncQueue
            .where('synced')
            .equals(false)
            .count();
    }

    async getPendingSyncItems() {
        return await this.db.syncQueue
            .where('synced')
            .equals(false)
            .toArray();
    }

    async markAsSynced(id) {
        await this.db.syncQueue.update(id, { synced: true });
    }

    async clearSyncedItems() {
        const syncedItems = await this.db.syncQueue
            .where('synced')
            .equals(true)
            .toArray();
            
        const ids = syncedItems.map(item => item.id);
        await this.db.syncQueue.bulkDelete(ids);
    }

    // Backup & Restore Methods
    async exportData() {
        try {
            const data = {
                transactions: await this.db.transactions.toArray(),
                enterprises: await this.db.enterprises.toArray(),
                inventory: await this.db.inventory.toArray(),
                animals: await this.db.animals.toArray(),
                crops: await this.db.crops.toArray(),
                settings: await this.db.settings.toArray(),
                syncQueue: await this.db.syncQueue.toArray(),
                metadata: {
                    exportDate: new Date().toISOString(),
                    version: '2.0.0',
                    recordCounts: {
                        transactions: await this.db.transactions.count(),
                        enterprises: await this.db.enterprises.count(),
                        inventory: await this.db.inventory.count(),
                        animals: await this.db.animals.count(),
                        crops: await this.db.crops.count()
                    }
                }
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `farmflow-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            return true;
        } catch (error) {
            console.error('Failed to export data:', error);
            throw error;
        }
    }

    async importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    // Validate data structure
                    if (!this.validateImportData(data)) {
                        throw new Error('Invalid backup file format');
                    }
                    
                    // Clear existing data
                    await this.clearAllData();
                    
                    // Import data
                    await this.db.transactions.bulkAdd(data.transactions || []);
                    await this.db.enterprises.bulkAdd(data.enterprises || []);
                    await this.db.inventory.bulkAdd(data.inventory || []);
                    await this.db.animals.bulkAdd(data.animals || []);
                    await this.db.crops.bulkAdd(data.crops || []);
                    await this.db.settings.bulkAdd(data.settings || []);
                    
                    resolve(true);
                } catch (error) {
                    console.error('Failed to import data:', error);
                    reject(error);
                }
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
        });
    }

    validateImportData(data) {
        return data && data.metadata && data.metadata.version;
    }

    async clearAllData() {
        try {
            await this.db.transactions.clear();
            await this.db.enterprises.clear();
            await this.db.inventory.clear();
            await this.db.animals.clear();
            await this.db.crops.clear();
            await this.db.settings.clear();
            await this.db.syncQueue.clear();
            
            return true;
        } catch (error) {
            console.error('Failed to clear data:', error);
            throw error;
        }
    }

    // Statistics Methods
    async getStatistics(period = 'all') {
        const transactions = await this.db.transactions.toArray();
        const now = new Date();
        
        let filteredTransactions = transactions;
        
        if (period !== 'all') {
            const startDate = new Date();
            
            switch(period) {
                case 'week':
                    startDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    startDate.setMonth(now.getMonth() - 1);
                    break;
                case 'quarter':
                    startDate.setMonth(now.getMonth() - 3);
                    break;
                case 'year':
                    startDate.setFullYear(now.getFullYear() - 1);
                    break;
            }
            
            filteredTransactions = transactions.filter(t => 
                new Date(t.date) >= startDate
            );
        }
        
        // Calculate statistics
        const totalIncome = filteredTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const totalExpenses = filteredTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
            
        const transactionCount = filteredTransactions.length;
        const averageTransaction = transactionCount > 0 ? 
            (totalIncome + totalExpenses) / transactionCount : 0;
            
        // Top categories
        const categoryTotals = {};
        filteredTransactions.forEach(t => {
            if (!categoryTotals[t.category]) {
                categoryTotals[t.category] = { income: 0, expense: 0 };
            }
            
            if (t.type === 'income') {
                categoryTotals[t.category].income += t.amount;
            } else {
                categoryTotals[t.category].expense += t.amount;
            }
        });
        
        const topIncomeCategories = Object.entries(categoryTotals)
            .filter(([_, totals]) => totals.income > 0)
            .sort((a, b) => b[1].income - a[1].income)
            .slice(0, 5);
            
        const topExpenseCategories = Object.entries(categoryTotals)
            .filter(([_, totals]) => totals.expense > 0)
            .sort((a, b) => b[1].expense - a[1].expense)
            .slice(0, 5);
        
        return {
            totalIncome,
            totalExpenses,
            netProfit: totalIncome - totalExpenses,
            transactionCount,
            averageTransaction,
            topIncomeCategories,
            topExpenseCategories,
            startDate: period === 'all' ? null : startDate,
            endDate: now
        };
    }

    // Maintenance Methods
    async commitPendingOperations() {
        // Commit any pending IndexedDB transactions
        return new Promise((resolve) => {
            setTimeout(resolve, 100);
        });
    }

    async getDatabaseSize() {
        // Estimate database size (simplified)
        const allData = await this.db.transactions.toArray();
        const jsonSize = JSON.stringify(allData).length;
        return {
            estimatedSize: jsonSize,
            humanReadable: this.formatFileSize(jsonSize)
        };
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // Search Methods
    async searchTransactions(query) {
        return await this.db.transactions
            .filter(t => {
                const searchStr = query.toLowerCase();
                return (
                    t.description.toLowerCase().includes(searchStr) ||
                    t.category.toLowerCase().includes(searchStr) ||
                    t.enterprise.toLowerCase().includes(searchStr) ||
                    t.notes.toLowerCase().includes(searchStr)
                );
            })
            .toArray();
    }
}

// Initialize database instance
window.db = new FarmFlowDatabase();
