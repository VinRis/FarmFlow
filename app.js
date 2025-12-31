// app.js
class FarmFlowApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.currentLanguage = 'en';
        this.isOnline = navigator.onLine;
        this.syncQueue = [];
        this.userSettings = {
            name: 'FarmFlow User',
            currency: 'KES',
            theme: 'light',
            language: 'en'
        };
        
        this.enterprises = [
            { id: 1, name: 'Dairy', type: 'dairy', color: '#2196F3', icon: 'agriculture' },
            { id: 2, name: 'Poultry', type: 'poultry', color: '#FFC107', icon: 'egg' },
            { id: 3, name: 'Crops', type: 'crops', color: '#4CAF50', icon: 'grass' },
            { id: 4, name: 'Livestock', type: 'livestock', color: '#795548', icon: 'pets' }
        ];
        
        this.categories = {
            income: ['Crop Sales', 'Livestock Sales', 'Milk Sales', 'Egg Sales', 'Government Support', 'Other Income'],
            expense: ['Seeds', 'Fertilizer', 'Animal Feed', 'Veterinary', 'Labor', 'Transport', 'Equipment', 'Utilities', 'Other Expenses']
        };
        
        this.init();
    }
    
    async init() {
        this.setupEventListeners();
        this.loadUserSettings();
        this.setupLanguage();
        this.setupTheme();
        this.checkOnlineStatus();
        this.setupDatabase();
        await this.loadInitialData();
        this.updateDashboard();
        this.setupServiceWorker();
        this.setupInstallPrompt();
    }
    
    setupEventListeners() {
        // Navigation
        document.getElementById('menuBtn').addEventListener('click', () => this.toggleDrawer(true));
        document.getElementById('closeDrawer').addEventListener('click', () => this.toggleDrawer(false));
        
        // Page navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                this.navigateTo(page);
                this.toggleDrawer(false);
            });
        });
        
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());
        
        // Language selection
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                this.setLanguage(lang);
            });
        });
        
        // Quick actions
        document.querySelectorAll('.quick-action').forEach(action => {
            action.addEventListener('click', () => {
                const actionType = action.getAttribute('data-action');
                this.handleQuickAction(actionType);
            });
        });
        
        // FAB
        document.getElementById('fab').addEventListener('click', () => this.showTransactionModal());
        document.getElementById('addTransaction').addEventListener('click', () => this.showTransactionModal());
        document.getElementById('addFirstTransaction').addEventListener('click', () => this.showTransactionModal());
        
        // Transaction modal
        document.getElementById('closeTransactionModal').addEventListener('click', () => this.hideTransactionModal());
        document.getElementById('cancelTransaction').addEventListener('click', () => this.hideTransactionModal());
        document.getElementById('transactionForm').addEventListener('submit', (e) => this.saveTransaction(e));
        
        // Transaction type toggle
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateTransactionCategories();
            });
        });
        
        // Sync button
        document.getElementById('syncBtn').addEventListener('click', () => this.manualSync());
        
        // Online/offline events
        window.addEventListener('online', () => this.handleOnline());
        window.addEventListener('offline', () => this.handleOffline());
        
        // Before install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPrompt();
        });
    }
    
    toggleDrawer(show) {
        const drawer = document.getElementById('drawer');
        if (show) {
            drawer.classList.add('open');
        } else {
            drawer.classList.remove('open');
        }
    }
    
    navigateTo(page) {
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-page') === page) {
                item.classList.add('active');
            }
        });
        
        // Update active page
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const pageElement = document.getElementById(`${page}Page`);
        if (pageElement) {
            pageElement.classList.add('active');
            this.currentPage = page;
            
            // Load page-specific data
            switch(page) {
                case 'dashboard':
                    this.updateDashboard();
                    break;
                case 'transactions':
                    this.loadTransactions();
                    break;
                case 'enterprises':
                    this.loadEnterprises();
                    break;
                case 'reports':
                    this.loadReports();
                    break;
            }
        }
    }
    
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        this.userSettings.theme = newTheme;
        this.saveUserSettings();
        
        // Update icon
        const icon = document.querySelector('#themeToggle .material-icons');
        icon.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
    }
    
    setLanguage(lang) {
        this.currentLanguage = lang;
        this.userSettings.language = lang;
        this.saveUserSettings();
        
        // Update UI
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            }
        });
        
        // Update content based on language
        this.updateContentForLanguage();
    }
    
    updateContentForLanguage() {
        // This would update all text content based on selected language
        // For now, just update a few key elements
        const translations = {
            en: {
                dashboard: 'Dashboard',
                transactions: 'Transactions',
                enterprises: 'Enterprises',
                reports: 'Reports'
            },
            sw: {
                dashboard: 'Dashibodi',
                transactions: 'Miamala',
                enterprises: 'Biashara',
                reports: 'Ripoti'
            }
        };
        
        const trans = translations[this.currentLanguage];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (trans[key]) {
                el.textContent = trans[key];
            }
        });
    }
    
    setupLanguage() {
        // Try to detect browser language
        const browserLang = navigator.language.split('-')[0];
        if (browserLang === 'sw') {
            this.setLanguage('sw');
        } else {
            this.setLanguage('en');
        }
    }
    
    setupTheme() {
        // Check for saved theme or prefer-color-scheme
        const savedTheme = localStorage.getItem('farmflow-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        let theme = savedTheme || (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update icon
        const icon = document.querySelector('#themeToggle .material-icons');
        icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    }
    
    checkOnlineStatus() {
        this.isOnline = navigator.onLine;
        const statusElement = document.getElementById('syncStatus');
        const offlineIndicator = document.getElementById('offlineIndicator');
        
        if (this.isOnline) {
            statusElement.textContent = 'Online';
            statusElement.className = 'sync-status';
            offlineIndicator.classList.remove('show');
        } else {
            statusElement.textContent = 'Offline';
            statusElement.className = 'sync-status offline';
            offlineIndicator.classList.add('show');
        }
    }
    
    handleOnline() {
        this.isOnline = true;
        this.checkOnlineStatus();
        this.showToast('Back online. Syncing data...', 'sync');
        this.manualSync();
    }
    
    handleOffline() {
        this.isOnline = false;
        this.checkOnlineStatus();
        this.showToast('You are offline. Changes will sync when back online.', 'wifi_off');
    }
    
    async setupDatabase() {
        // Initialize Dexie database
        this.db = new Dexie('FarmFlowDB');
        
        this.db.version(1).stores({
            transactions: '++id, date, type, enterprise, category, amount, currency, synced',
            enterprises: '++id, name, type, color, icon',
            budgets: '++id, enterprise, month, year, amount, spent',
            syncQueue: '++id, action, table, data, timestamp'
        });
        
        // Initialize with sample data if empty
        const count = await this.db.transactions.count();
        if (count === 0) {
            await this.initializeSampleData();
        }
    }
    
    async initializeSampleData() {
        // Add sample enterprises
        await this.db.enterprises.bulkPut(this.enterprises);
        
        // Add sample transactions
        const sampleTransactions = [
            {
                date: new Date().toISOString().split('T')[0],
                type: 'income',
                enterprise: 'Dairy',
                category: 'Milk Sales',
                amount: 15000,
                currency: 'KES',
                note: 'Monthly milk sale to cooperative',
                synced: true
            },
            {
                date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
                type: 'expense',
                enterprise: 'Crops',
                category: 'Fertilizer',
                amount: 5000,
                currency: 'KES',
                note: 'Fertilizer for maize field',
                synced: true
            }
        ];
        
        await this.db.transactions.bulkAdd(sampleTransactions);
    }
    
    async loadInitialData() {
        // Load enterprises for dropdowns
        const enterprises = await this.db.enterprises.toArray();
        this.enterprises = enterprises;
        
        // Update enterprise dropdowns
        this.updateEnterpriseDropdowns();
    }
    
    updateEnterpriseDropdowns() {
        const enterpriseSelects = document.querySelectorAll('select[id$="Enterprise"]');
        
        enterpriseSelects.forEach(select => {
            // Clear existing options except first
            while (select.options.length > 1) {
                select.remove(1);
            }
            
            // Add enterprise options
            this.enterprises.forEach(enterprise => {
                const option = document.createElement('option');
                option.value = enterprise.name;
                option.textContent = enterprise.name;
                select.appendChild(option);
            });
        });
    }
    
    updateTransactionCategories() {
        const type = document.querySelector('.type-btn.active').getAttribute('data-type');
        const categorySelect = document.getElementById('transCategory');
        
        // Clear existing options
        while (categorySelect.options.length > 1) {
            categorySelect.remove(1);
        }
        
        // Add categories based on type
        this.categories[type].forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }
    
    async updateDashboard() {
        // Calculate KPIs
        const transactions = await this.db.transactions.toArray();
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        // Filter transactions for current month
        const monthlyTransactions = transactions.filter(t => {
            const transDate = new Date(t.date);
            return transDate.getMonth() === currentMonth && 
                   transDate.getFullYear() === currentYear;
        });
        
        // Calculate totals
        const monthlyIncome = monthlyTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const monthlyExpense = monthlyTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const netIncome = monthlyIncome - monthlyExpense;
        
        // Calculate overall balance (simplified)
        const allIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const allExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const currentBalance = allIncome - allExpense;
        
        // Update KPI elements
        document.getElementById('monthlyIncome').textContent = `KES ${monthlyIncome.toLocaleString()}`;
        document.getElementById('monthlyExpense').textContent = `KES ${monthlyExpense.toLocaleString()}`;
        document.getElementById('netIncome').textContent = `KES ${netIncome.toLocaleString()}`;
        document.getElementById('currentBalance').textContent = `KES ${currentBalance.toLocaleString()}`;
        
        // Update recent transactions
        this.updateRecentTransactions(transactions);
        
        // Update chart
        this.updateIncomeChart(transactions);
    }
    
    updateRecentTransactions(transactions) {
        const container = document.getElementById('recentTransactions');
        const recent = transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        if (recent.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="material-icons">receipt</span>
                    <p>No transactions yet</p>
                    <button class="btn primary" id="addFirstTransaction">Add your first transaction</button>
                </div>
            `;
            document.getElementById('addFirstTransaction').addEventListener('click', () => this.showTransactionModal());
            return;
        }
        
        container.innerHTML = recent.map(trans => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-category">${trans.category}</div>
                    <div class="transaction-meta">
                        <span>${trans.enterprise}</span>
                        <span>${new Date(trans.date).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="transaction-amount ${trans.type}">
                    ${trans.type === 'income' ? '+' : '-'} KES ${trans.amount.toLocaleString()}
                </div>
            </div>
        `).join('');
    }
    
    updateIncomeChart(transactions) {
        const ctx = document.getElementById('incomeChart').getContext('2d');
        const last6Months = Array.from({length: 6}, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            return {
                month: date.toLocaleString('default', { month: 'short' }),
                year: date.getFullYear()
            };
        }).reverse();
        
        const incomeByMonth = last6Months.map(({month, year}) => {
            const monthIncome = transactions
                .filter(t => t.type === 'income')
                .filter(t => {
                    const transDate = new Date(t.date);
                    return transDate.getMonth() === new Date(`${month} 1, ${year}`).getMonth() &&
                           transDate.getFullYear() === year;
                })
                .reduce((sum, t) => sum + t.amount, 0);
            return monthIncome;
        });
        
        if (this.incomeChart) {
            this.incomeChart.destroy();
        }
        
        this.incomeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last6Months.map(m => m.month),
                datasets: [{
                    label: 'Income',
                    data: incomeByMonth,
                    borderColor: '#2E7D32',
                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            callback: function(value) {
                                return 'KES ' + value.toLocaleString();
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
    
    async loadTransactions() {
        const container = document.getElementById('allTransactions');
        const transactions = await this.db.transactions
            .orderBy('date')
            .reverse()
            .toArray();
        
        if (transactions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="material-icons">receipt</span>
                    <p>No transactions yet</p>
                    <button class="btn primary" id="addFirstTrans">Add your first transaction</button>
                </div>
            `;
            document.getElementById('addFirstTrans').addEventListener('click', () => this.showTransactionModal());
            return;
        }
        
        container.innerHTML = transactions.map(trans => `
            <div class="transaction-item" data-id="${trans.id}">
                <div class="transaction-info">
                    <div class="transaction-category">${trans.category}</div>
                    <div class="transaction-meta">
                        <span>${trans.enterprise}</span>
                        <span>${new Date(trans.date).toLocaleDateString()}</span>
                        ${trans.note ? `<span>${trans.note}</span>` : ''}
                    </div>
                </div>
                <div class="transaction-actions">
                    <div class="transaction-amount ${trans.type}">
                        ${trans.type === 'income' ? '+' : '-'} KES ${trans.amount.toLocaleString()}
                    </div>
                    <button class="icon-btn small" onclick="app.editTransaction(${trans.id})">
                        <span class="material-icons">edit</span>
                    </button>
                    <button class="icon-btn small" onclick="app.deleteTransaction(${trans.id})">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    async loadEnterprises() {
        const container = document.getElementById('enterprisesList');
        const enterprises = await this.db.enterprises.toArray();
        
        container.innerHTML = enterprises.map(ent => `
            <div class="enterprise-card enterprise-${ent.type}">
                <div class="enterprise-icon" style="background-color: ${ent.color}20; color: ${ent.color};">
                    <span class="material-icons">${ent.icon}</span>
                </div>
                <h3>${ent.name}</h3>
                <p>Manage your ${ent.name.toLowerCase()} enterprise</p>
                <div class="enterprise-stats">
                    <div class="stat">
                        <span class="stat-label">This Month</span>
                        <span class="stat-value">KES 0</span>
                    </div>
                    <div class="stat">
                        <span class="stat-label">YTD</span>
                        <span class="stat-value">KES 0</span>
                    </div>
                </div>
                <button class="btn outline" onclick="app.viewEnterprise(${ent.id})">View Details</button>
            </div>
        `).join('');
    }
    
    loadReports() {
        // Reports are loaded via buttons
    }
    
    showTransactionModal() {
        document.getElementById('transactionModal').classList.add('active');
        document.getElementById('transDate').valueAsDate = new Date();
        this.updateTransactionCategories();
    }
    
    hideTransactionModal() {
        document.getElementById('transactionModal').classList.remove('active');
        document.getElementById('transactionForm').reset();
    }
    
    async saveTransaction(e) {
        e.preventDefault();
        
        const form = e.target;
        const type = document.querySelector('.type-btn.active').getAttribute('data-type');
        
        const transaction = {
            date: form.transDate.value,
            type: type,
            enterprise: form.transEnterprise.value,
            category: form.transCategory.value,
            amount: parseFloat(form.transAmount.value),
            currency: 'KES',
            note: form.transNote.value,
            synced: this.isOnline
        };
        
        try {
            await this.db.transactions.add(transaction);
            this.hideTransactionModal();
            this.showToast('Transaction saved successfully!', 'check_circle');
            
            // Update UI
            if (this.currentPage === 'dashboard') {
                this.updateDashboard();
            } else if (this.currentPage === 'transactions') {
                this.loadTransactions();
            }
            
            // Add to sync queue if offline
            if (!this.isOnline) {
                await this.addToSyncQueue('create', 'transactions', transaction);
            }
            
        } catch (error) {
            console.error('Error saving transaction:', error);
            this.showToast('Error saving transaction', 'error');
        }
    }
    
    async editTransaction(id) {
        const transaction = await this.db.transactions.get(id);
        if (transaction) {
            this.showTransactionModal();
            // Pre-populate form with transaction data
            // This would be implemented in a full version
        }
    }
    
    async deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            await this.db.transactions.delete(id);
            this.showToast('Transaction deleted', 'delete');
            
            // Update UI
            if (this.currentPage === 'dashboard') {
                this.updateDashboard();
            } else if (this.currentPage === 'transactions') {
                this.loadTransactions();
            }
            
            // Add to sync queue if offline
            if (!this.isOnline) {
                await this.addToSyncQueue('delete', 'transactions', { id });
            }
        }
    }
    
    async addToSyncQueue(action, table, data) {
        const queueItem = {
            action,
            table,
            data,
            timestamp: new Date().toISOString()
        };
        
        await this.db.syncQueue.add(queueItem);
        this.syncQueue.push(queueItem);
        
        // Show sync pending indicator
        const statusElement = document.getElementById('syncStatus');
        statusElement.textContent = 'Sync Pending';
        statusElement.className = 'sync-status syncing';
    }
    
    async manualSync() {
        if (!this.isOnline) {
            this.showToast('Cannot sync while offline', 'wifi_off');
            return;
        }
        
        const statusElement = document.getElementById('syncStatus');
        statusElement.textContent = 'Syncing...';
        statusElement.className = 'sync-status syncing';
        
        this.showToast('Syncing data...', 'sync');
        
        // Simulate sync delay
        setTimeout(async () => {
            // In a real app, this would sync with Firebase
            const queueItems = await this.db.syncQueue.toArray();
            
            if (queueItems.length === 0) {
                statusElement.textContent = 'Online';
                statusElement.className = 'sync-status';
                this.showToast('Data is up to date', 'check_circle');
                return;
            }
            
            // Clear sync queue
            await this.db.syncQueue.clear();
            this.syncQueue = [];
            
            // Mark transactions as synced
            await this.db.transactions.toCollection().modify({ synced: true });
            
            statusElement.textContent = 'Online';
            statusElement.className = 'sync-status';
            this.showToast('Sync completed successfully!', 'check_circle');
            
            // Refresh data
            if (this.currentPage === 'dashboard') {
                this.updateDashboard();
            }
            
        }, 1500);
    }
    
    handleQuickAction(action) {
        switch(action) {
            case 'add-income':
                this.showTransactionModal();
                document.querySelectorAll('.type-btn')[0].click();
                break;
            case 'add-expense':
                this.showTransactionModal();
                document.querySelectorAll('.type-btn')[1].click();
                break;
            case 'sell-produce':
                this.showTransactionModal();
                document.querySelectorAll('.type-btn')[0].click();
                document.getElementById('transCategory').value = 'Crop Sales';
                break;
            case 'record-payment':
                this.showTransactionModal();
                document.querySelectorAll('.type-btn')[0].click();
                document.getElementById('transCategory').value = 'Other Income';
                break;
        }
    }
    
    showToast(message, icon = 'info') {
        const toast = document.getElementById('syncToast');
        const iconElement = document.getElementById('syncIcon');
        const messageElement = document.getElementById('syncMessage');
        
        iconElement.textContent = icon;
        messageElement.textContent = message;
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    loadUserSettings() {
        const saved = localStorage.getItem('farmflow-settings');
        if (saved) {
            this.userSettings = JSON.parse(saved);
        }
        
        // Apply settings
        document.getElementById('userName').textContent = this.userSettings.name;
    }
    
    saveUserSettings() {
        localStorage.setItem('farmflow-settings', JSON.stringify(this.userSettings));
    }
    
    setupServiceWorker() {
        // Already registered in HTML
        console.log('Service Worker setup complete');
    }
    
    setupInstallPrompt() {
        // Implementation for install prompt
    }
    
    showInstallPrompt() {
        // Show custom install prompt
        if (this.deferredPrompt) {
            this.showToast('Install FarmFlow for quick access!', 'download');
            // Could add a custom install button here
        }
    }
    
    viewEnterprise(id) {
        // Navigate to enterprise details
        console.log('View enterprise:', id);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FarmFlowApp();
});