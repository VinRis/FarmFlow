// app.js - Updated with all fixes
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
            language: 'en',
            autoSync: true
        };
        
        this.enterprises = [];
        this.categories = {
            income: [
                'Crop Sales', 'Livestock Sales', 'Milk Sales', 'Egg Sales', 
                'Honey Sales', 'Fish Sales', 'Government Support', 'Loan Received',
                'Investment', 'Other Income'
            ],
            expense: [
                'Seeds', 'Fertilizer', 'Animal Feed', 'Veterinary', 'Labor', 
                'Transport', 'Equipment', 'Utilities', 'Rent', 'Loan Repayment',
                'Insurance', 'Market Fees', 'Other Expenses'
            ]
        };
        
        this.init();
    }
    
    async init() {
        this.setupEventListeners();
        this.loadUserSettings();
        this.setupLanguage();
        this.setupTheme();
        this.checkOnlineStatus();
        await this.setupDatabase();
        await this.loadInitialData();
        this.updateDashboard();
        this.setupServiceWorker();
        this.setupInstallPrompt();
    }
    
    setupEventListeners() {
        // Navigation
        document.getElementById('menuBtn').addEventListener('click', () => this.toggleDrawer(true));
        document.getElementById('closeDrawer').addEventListener('click', () => this.toggleDrawer(false));
        
        // Search functionality
        document.getElementById('searchBtn').addEventListener('click', () => this.showSearch());
        document.getElementById('closeSearch').addEventListener('click', () => this.hideSearch());
        document.getElementById('globalSearch').addEventListener('input', (e) => this.performSearch(e.target.value));
        
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
        
        // View all buttons
        document.getElementById('viewAllTransactions').addEventListener('click', () => this.navigateTo('transactions'));
        document.getElementById('viewAllRecentTransactions').addEventListener('click', () => this.navigateTo('transactions'));
        
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
        
        // Filter transactions
        document.getElementById('filterTransactions').addEventListener('click', () => this.toggleTransactionFilters());
        document.getElementById('clearFilters').addEventListener('click', () => this.clearTransactionFilters());
        
        // Enterprise page
        document.getElementById('addEnterpriseBtn').addEventListener('click', () => this.showEnterpriseModal());
        
        // Reports
        document.querySelectorAll('[data-report]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reportType = e.target.getAttribute('data-report');
                this.showReport(reportType);
            });
        });
        
        // Report modal
        document.getElementById('closeReportModal').addEventListener('click', () => this.hideReportModal());
        document.getElementById('printReport').addEventListener('click', () => this.printReport());
        document.getElementById('exportReport').addEventListener('click', () => this.exportReport());
        
        // Backup & Restore
        document.getElementById('createBackup').addEventListener('click', () => this.createBackup());
        document.getElementById('chooseRestoreFile').addEventListener('click', () => document.getElementById('restoreFile').click());
        document.getElementById('restoreFile').addEventListener('change', (e) => this.handleRestoreFile(e));
        document.getElementById('restoreBackup').addEventListener('click', () => this.restoreBackup());
        
        // Settings
        document.getElementById('userNameInput').addEventListener('change', (e) => this.updateUserName(e.target.value));
        document.getElementById('defaultCurrency').addEventListener('change', (e) => this.updateCurrency(e.target.value));
        document.getElementById('themeSelect').addEventListener('change', (e) => this.updateThemeSetting(e.target.value));
        
        // Help FAQ
        document.querySelectorAll('.faq-question').forEach(question => {
            question.addEventListener('click', () => {
                const item = question.parentElement;
                item.classList.toggle('active');
            });
        });
        
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
        console.log('Navigating to:', page);
        
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
                    // Reports loaded on button click
                    break;
                case 'budgets':
                    this.loadBudgets();
                    break;
                case 'invoices':
                    this.loadInvoices();
                    break;
                case 'assets':
                    this.loadAssets();
                    break;
                case 'loans':
                    this.loadLoans();
                    break;
                case 'backup':
                    // Backup page doesn't need data loading
                    break;
                case 'settings':
                    this.loadSettings();
                    break;
                case 'help':
                    // Help page is static
                    break;
            }
        } else {
            console.error('Page not found:', page);
        }
    }
    
    showSearch() {
        document.getElementById('searchOverlay').classList.add('active');
        document.getElementById('globalSearch').focus();
    }
    
    hideSearch() {
        document.getElementById('searchOverlay').classList.remove('active');
        document.getElementById('globalSearch').value = '';
        document.getElementById('searchResults').innerHTML = '';
    }
    
    async performSearch(query) {
        if (query.length < 2) {
            document.getElementById('searchResults').innerHTML = '';
            return;
        }
        
        const results = [];
        
        // Search transactions
        const transactions = await window.database.searchTransactions(query);
        transactions.forEach(t => {
            results.push({
                type: 'transaction',
                title: t.category,
                details: `${t.type === 'income' ? '+' : '-'} ${t.currency} ${t.amount} - ${t.enterprise}`,
                date: t.date,
                action: () => this.viewTransaction(t.id)
            });
        });
        
        // Search enterprises
        const enterprises = await window.database.getEnterprises();
        enterprises.filter(e => e.name.toLowerCase().includes(query.toLowerCase())).forEach(e => {
            results.push({
                type: 'enterprise',
                title: e.name,
                details: e.type,
                action: () => this.viewEnterprise(e.id)
            });
        });
        
        this.displaySearchResults(results);
    }
    
    displaySearchResults(results) {
        const container = document.getElementById('searchResults');
        
        if (results.length === 0) {
            container.innerHTML = `
                <div class="search-result-item">
                    <div class="search-result-title">No results found</div>
                    <div class="search-result-details">Try different keywords</div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = results.map(result => `
            <div class="search-result-item" onclick="app.executeSearchAction(${JSON.stringify(result.action).replace(/"/g, '&quot;')})">
                <div class="search-result-type">${result.type}</div>
                <div class="search-result-title">${result.title}</div>
                <div class="search-result-details">${result.details}</div>
            </div>
        `).join('');
    }
    
    executeSearchAction(action) {
        this.hideSearch();
        action();
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
        // Simple translation implementation
        const translations = {
            en: {
                dashboard: 'Dashboard',
                transactions: 'Transactions',
                enterprises: 'Enterprises',
                reports: 'Reports',
                monthlyIncome: 'Monthly Income',
                monthlyExpenses: 'Monthly Expenses',
                netIncome: 'Net Income'
            },
            sw: {
                dashboard: 'Dashibodi',
                transactions: 'Miamala',
                enterprises: 'Biashara',
                reports: 'Ripoti',
                monthlyIncome: 'Mapato ya Mwezi',
                monthlyExpenses: 'Matumizi ya Mwezi',
                netIncome: 'Mapato Safi'
            }
        };
        
        const trans = translations[this.currentLanguage];
        Object.keys(trans).forEach(key => {
            const elements = document.querySelectorAll(`[data-i18n="${key}"]`);
            elements.forEach(el => {
                el.textContent = trans[key];
            });
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
        this.userSettings.theme = theme;
        
        // Update icon
        const icon = document.querySelector('#themeToggle .material-icons');
        icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
    }
    
    checkOnlineStatus() {
        this.isOnline = navigator.onLine;
        const statusElement = document.getElementById('syncStatus');
        const syncIcon = document.getElementById('syncIcon');
        const syncText = document.getElementById('syncText');
        const offlineIndicator = document.getElementById('offlineIndicator');
        
        if (this.isOnline) {
            statusElement.className = 'sync-status';
            syncIcon.textContent = 'cloud';
            syncText.textContent = 'Online';
            offlineIndicator.classList.remove('show');
        } else {
            statusElement.className = 'sync-status offline';
            syncIcon.textContent = 'cloud_off';
            syncText.textContent = 'Offline';
            offlineIndicator.classList.add('show');
        }
    }
    
    handleOnline() {
        this.isOnline = true;
        this.checkOnlineStatus();
        this.showToast('Back online. Syncing data...', 'wifi');
        
        if (this.userSettings.autoSync && window.syncManager) {
            window.syncManager.manualSync();
        }
    }
    
    handleOffline() {
        this.isOnline = false;
        this.checkOnlineStatus();
        this.showToast('You are offline. Changes will sync when back online.', 'wifi_off');
    }
    
    async setupDatabase() {
        // Use the database class from database.js
        // Wait for database to initialize
        await new Promise(resolve => setTimeout(resolve, 100));
        
        if (window.database) {
            console.log('Database initialized via database.js');
        } else {
            console.error('Database not initialized');
        }
    }
    
    async loadInitialData() {
        // Load enterprises
        if (window.database) {
            this.enterprises = await window.database.getEnterprises();
            
            if (this.enterprises.length === 0) {
                // Add default enterprises
                const defaultEnterprises = [
                    { name: 'Dairy', type: 'dairy', color: '#2196F3', icon: 'agriculture' },
                    { name: 'Poultry', type: 'poultry', color: '#FF9800', icon: 'egg' },
                    { name: 'Crops', type: 'crops', color: '#4CAF50', icon: 'grass' },
                    { name: 'Livestock', type: 'livestock', color: '#795548', icon: 'pets' }
                ];
                
                for (const enterprise of defaultEnterprises) {
                    await window.database.addEnterprise(enterprise);
                }
                
                this.enterprises = await window.database.getEnterprises();
            }
        }
        
        // Update enterprise dropdowns
        this.updateEnterpriseDropdowns();
    }
    
    updateEnterpriseDropdowns() {
        const enterpriseSelects = [
            document.getElementById('transEnterprise'),
            document.getElementById('filterEnterprise')
        ].filter(el => el);
        
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
        
        if (!categorySelect) return;
        
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
        if (!window.database) return;
        
        // Calculate KPIs
        const transactions = await window.database.getTransactions();
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        
        // Filter transactions for current month
        const currentMonthTransactions = transactions.filter(t => {
            const transDate = new Date(t.date);
            return transDate.getMonth() === currentMonth && 
                   transDate.getFullYear() === currentYear;
        });
        
        // Filter transactions for last month
        const lastMonthTransactions = transactions.filter(t => {
            const transDate = new Date(t.date);
            return transDate.getMonth() === lastMonth && 
                   transDate.getFullYear() === lastMonthYear;
        });
        
        // Calculate current month totals
        const monthlyIncome = currentMonthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const monthlyExpense = currentMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const netIncome = monthlyIncome - monthlyExpense;
        
        // Calculate last month totals for comparison
        const lastMonthIncome = lastMonthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const lastMonthExpense = lastMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        // Calculate trends
        const incomeTrend = lastMonthIncome > 0 ? 
            ((monthlyIncome - lastMonthIncome) / lastMonthIncome * 100).toFixed(1) : 0;
        
        const expenseTrend = lastMonthExpense > 0 ? 
            ((monthlyExpense - lastMonthExpense) / lastMonthExpense * 100).toFixed(1) : 0;
        
        // Update KPI elements
        document.getElementById('monthlyIncome').textContent = `KES ${monthlyIncome.toLocaleString()}`;
        document.getElementById('monthlyExpense').textContent = `KES ${monthlyExpense.toLocaleString()}`;
        document.getElementById('netIncome').textContent = `KES ${netIncome.toLocaleString()}`;
        
        // Update trends
        document.getElementById('incomeTrend').textContent = 
            `${incomeTrend >= 0 ? '+' : ''}${incomeTrend}% from last month`;
        
        document.getElementById('expenseTrend').textContent = 
            `${expenseTrend >= 0 ? '+' : ''}${expenseTrend}% from last month`;
        
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
        const ctx = document.getElementById('incomeChart');
        if (!ctx) return;
        
        const ctx2d = ctx.getContext('2d');
        const last6Months = Array.from({length: 6}, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            return {
                month: date.toLocaleString('default', { month: 'short' }),
                year: date.getFullYear(),
                monthIndex: date.getMonth()
            };
        }).reverse();
        
        const incomeByMonth = last6Months.map(({monthIndex, year}) => {
            const monthIncome = transactions
                .filter(t => t.type === 'income')
                .filter(t => {
                    const transDate = new Date(t.date);
                    return transDate.getMonth() === monthIndex &&
                           transDate.getFullYear() === year;
                })
                .reduce((sum, t) => sum + t.amount, 0);
            return monthIncome;
        });
        
        if (this.incomeChart) {
            this.incomeChart.destroy();
        }
        
        this.incomeChart = new Chart(ctx2d, {
            type: 'line',
            data: {
                labels: last6Months.map(m => m.month),
                datasets: [{
                    label: 'Income',
                    data: incomeByMonth,
                    borderColor: '#2E7D32',
                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                    tension: 0.4,
                    fill: true,
                    borderWidth: 2
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
        if (!container) return;
        
        const transactions = await window.database.getTransactions();
        
        if (transactions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="material-icons">receipt</span>
                    <p>No transactions yet</p>
                    <button class="btn primary" id="addFirstTrans">Add your first transaction</button>
                </div>
            `;
            document.getElementById('addFirstTrans')?.addEventListener('click', () => this.showTransactionModal());
            return;
        }
        
        container.innerHTML = transactions.map(trans => `
            <div class="transaction-item" data-id="${trans.id}">
                <div class="transaction-info">
                    <div class="transaction-category">${trans.category}</div>
                    <div class="transaction-meta">
                        <span>${trans.enterprise}</span>
                        <span>${new Date(trans.date).toLocaleDateString()}</span>
                        ${trans.note ? `<span class="transaction-note">${trans.note}</span>` : ''}
                    </div>
                </div>
                <div class="transaction-actions">
                    <div class="transaction-amount ${trans.type}">
                        ${trans.type === 'income' ? '+' : '-'} KES ${trans.amount.toLocaleString()}
                    </div>
                    <button class="icon-btn small edit-transaction" data-id="${trans.id}">
                        <span class="material-icons">edit</span>
                    </button>
                    <button class="icon-btn small delete-transaction" data-id="${trans.id}">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-transaction').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').getAttribute('data-id');
                this.editTransaction(parseInt(id));
            });
        });
        
        document.querySelectorAll('.delete-transaction').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('button').getAttribute('data-id');
                this.deleteTransaction(parseInt(id));
            });
        });
    }
    
    async loadEnterprises() {
        const container = document.getElementById('enterprisesList');
        if (!container) return;
        
        const enterprises = await window.database.getEnterprises();
        
        if (enterprises.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="material-icons">business</span>
                    <p>No enterprises yet</p>
                    <p class="empty-state-sub">Add your farm enterprises to start tracking</p>
                    <button class="btn primary" id="addFirstEnterprise">Add your first enterprise</button>
                </div>
            `;
            document.getElementById('addFirstEnterprise')?.addEventListener('click', () => this.showEnterpriseModal());
            return;
        }
        
        container.innerHTML = enterprises.map(ent => `
            <div class="enterprise-card enterprise-${ent.type}" data-id="${ent.id}">
                <div class="enterprise-icon" style="background-color: ${ent.color}20; color: ${ent.color};">
                    <span class="material-icons">${this.getEnterpriseIcon(ent.type)}</span>
                </div>
                <h3>${ent.name}</h3>
                <p>${ent.type.charAt(0).toUpperCase() + ent.type.slice(1)} enterprise</p>
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
            </div>
        `).join('');
        
        // Make enterprise cards clickable
        document.querySelectorAll('.enterprise-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                this.viewEnterprise(parseInt(id));
            });
        });
    }
    
    getEnterpriseIcon(type) {
        const icons = {
            dairy: 'agriculture',
            poultry: 'egg',
            crops: 'grass',
            livestock: 'pets',
            fisheries: 'water',
            apiary: 'hive',
            other: 'business'
        };
        return icons[type] || 'business';
    }
    
    showReport(reportType) {
        const reportTitle = document.getElementById('reportTitle');
        const reportContent = document.getElementById('reportContent');
        
        let title = '';
        let content = '';
        
        switch(reportType) {
            case 'pl':
                title = 'Profit & Loss Report';
                content = this.generateProfitLossReport();
                break;
            case 'cashflow':
                title = 'Cash Flow Report';
                content = this.generateCashFlowReport();
                break;
            case 'seasonal':
                title = 'Seasonal Comparison Report';
                content = this.generateSeasonalReport();
                break;
            case 'roi':
                title = 'ROI Calculator';
                content = this.generateROIReport();
                break;
        }
        
        reportTitle.textContent = title;
        reportContent.innerHTML = content;
        document.getElementById('reportModal').classList.add('active');
    }
    
    generateProfitLossReport() {
        return `
            <div class="report-section">
                <h4>Monthly Profit & Loss</h4>
                <table class="report-table">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Income</th>
                            <th>Expenses</th>
                            <th>Net Profit</th>
                        </tr>
                    </thead>
                    <tbody id="plTableBody">
                        <!-- Will be populated with JavaScript -->
                        <tr>
                            <td>January 2024</td>
                            <td>KES 50,000</td>
                            <td>KES 30,000</td>
                            <td class="positive">KES 20,000</td>
                        </tr>
                        <tr>
                            <td>February 2024</td>
                            <td>KES 45,000</td>
                            <td>KES 25,000</td>
                            <td class="positive">KES 20,000</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }
    
    generateCashFlowReport() {
        return `
            <div class="report-section">
                <h4>Cash Flow Statement</h4>
                <div class="cashflow-summary">
                    <div class="cashflow-item">
                        <span>Opening Balance</span>
                        <span>KES 100,000</span>
                    </div>
                    <div class="cashflow-item">
                        <span>Cash Inflows</span>
                        <span class="positive">KES 200,000</span>
                    </div>
                    <div class="cashflow-item">
                        <span>Cash Outflows</span>
                        <span class="negative">KES 150,000</span>
                    </div>
                    <div class="cashflow-item total">
                        <span>Closing Balance</span>
                        <span>KES 150,000</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateSeasonalReport() {
        return `
            <div class="report-section">
                <h4>Seasonal Performance</h4>
                <p>Compare harvest season vs non-harvest season performance.</p>
                <div class="seasonal-comparison">
                    <div class="season">
                        <h5>Harvest Season (Jun-Aug)</h5>
                        <p>Average Monthly Income: <strong>KES 75,000</strong></p>
                        <p>Average Monthly Expenses: <strong>KES 40,000</strong></p>
                        <p>Net Profit Margin: <strong class="positive">47%</strong></p>
                    </div>
                    <div class="season">
                        <h5>Non-Harvest Season (Dec-Feb)</h5>
                        <p>Average Monthly Income: <strong>KES 35,000</strong></p>
                        <p>Average Monthly Expenses: <strong>KES 25,000</strong></p>
                        <p>Net Profit Margin: <strong class="positive">29%</strong></p>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateROIReport() {
        return `
            <div class="report-section">
                <h4>Return on Investment Calculator</h4>
                <div class="roi-calculator">
                    <div class="form-group">
                        <label>Initial Investment (KES)</label>
                        <input type="number" id="roiInvestment" value="100000" class="roi-input">
                    </div>
                    <div class="form-group">
                        <label>Annual Revenue (KES)</label>
                        <input type="number" id="roiRevenue" value="200000" class="roi-input">
                    </div>
                    <div class="form-group">
                        <label>Annual Costs (KES)</label>
                        <input type="number" id="roiCosts" value="120000" class="roi-input">
                    </div>
                    <button class="btn primary" onclick="app.calculateROI()">Calculate ROI</button>
                    <div class="roi-result" id="roiResult">
                        <h5>Results:</h5>
                        <p>Annual Net Profit: <strong id="roiNetProfit">KES 80,000</strong></p>
                        <p>ROI: <strong id="roiPercentage" class="positive">80%</strong></p>
                        <p>Payback Period: <strong id="roiPayback">1.25 years</strong></p>
                    </div>
                </div>
            </div>
        `;
    }
    
    calculateROI() {
        const investment = parseFloat(document.getElementById('roiInvestment').value) || 0;
        const revenue = parseFloat(document.getElementById('roiRevenue').value) || 0;
        const costs = parseFloat(document.getElementById('roiCosts').value) || 0;
        
        const netProfit = revenue - costs;
        const roiPercentage = investment > 0 ? (netProfit / investment * 100).toFixed(1) : 0;
        const paybackPeriod = netProfit > 0 ? (investment / netProfit).toFixed(2) : 'N/A';
        
        document.getElementById('roiNetProfit').textContent = `KES ${netProfit.toLocaleString()}`;
        document.getElementById('roiPercentage').textContent = `${roiPercentage}%`;
        document.getElementById('roiPayback').textContent = `${paybackPeriod} years`;
    }
    
    hideReportModal() {
        document.getElementById('reportModal').classList.remove('active');
    }
    
    printReport() {
        window.print();
    }
    
    exportReport() {
        const reportContent = document.getElementById('reportContent').innerText;
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showToast('Report exported successfully', 'download');
    }
    
    showTransactionModal() {
        document.getElementById('transactionModal').classList.add('active');
        document.getElementById('transDate').valueAsDate = new Date();
        this.updateTransactionCategories();
        
        // Set default currency
        document.getElementById('transCurrency').value = this.userSettings.currency;
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
            amount: parseFloat(form.transAmount.value) || 0,
            currency: form.transCurrency.value,
            note: form.transNote.value,
            synced: this.isOnline,
            createdAt: new Date().toISOString()
        };
        
        try {
            await window.database.addTransaction(transaction);
            this.hideTransactionModal();
            this.showToast('Transaction saved successfully!', 'check_circle');
            
            // Update UI
            this.updateDashboard();
            if (this.currentPage === 'transactions') {
                this.loadTransactions();
            }
            
        } catch (error) {
            console.error('Error saving transaction:', error);
            this.showToast('Error saving transaction', 'error');
        }
    }
    
    async editTransaction(id) {
        const transaction = await window.database.getTransaction(id);
        if (transaction) {
            this.showTransactionModal();
            // Populate form with transaction data
            document.getElementById('transDate').value = transaction.date;
            document.getElementById('transAmount').value = transaction.amount;
            document.getElementById('transCurrency').value = transaction.currency;
            document.getElementById('transEnterprise').value = transaction.enterprise;
            document.getElementById('transNote').value = transaction.note || '';
            
            // Set type
            const typeBtn = document.querySelector(`.type-btn[data-type="${transaction.type}"]`);
            if (typeBtn) {
                document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
                typeBtn.classList.add('active');
                this.updateTransactionCategories();
                document.getElementById('transCategory').value = transaction.category;
            }
            
            // Change form to update mode
            const form = document.getElementById('transactionForm');
            form.dataset.editId = id;
            form.querySelector('button[type="submit"]').textContent = 'Update Transaction';
        }
    }
    
    async deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            await window.database.deleteTransaction(id);
            this.showToast('Transaction deleted', 'delete');
            
            // Update UI
            this.updateDashboard();
            if (this.currentPage === 'transactions') {
                this.loadTransactions();
            }
        }
    }
    
    toggleTransactionFilters() {
        const filters = document.getElementById('transactionFilters');
        filters.style.display = filters.style.display === 'none' ? 'block' : 'none';
    }
    
    clearTransactionFilters() {
        document.getElementById('filterEnterprise').value = '';
        document.getElementById('filterType').value = '';
        document.getElementById('filterDateFrom').value = '';
        document.getElementById('filterDateTo').value = '';
        document.getElementById('filterSearch').value = '';
        
        this.loadTransactions();
    }
    
    handleQuickAction(action) {
        this.showTransactionModal();
        
        switch(action) {
            case 'sell-produce':
                document.querySelectorAll('.type-btn')[0].click();
                document.getElementById('transCategory').value = 'Crop Sales';
                break;
            case 'buy-feed':
                document.querySelectorAll('.type-btn')[1].click();
                document.getElementById('transCategory').value = 'Animal Feed';
                break;
            case 'record-payment':
                document.querySelectorAll('.type-btn')[0].click();
                document.getElementById('transCategory').value = 'Other Income';
                break;
            case 'pay-wages':
                document.querySelectorAll('.type-btn')[1].click();
                document.getElementById('transCategory').value = 'Labor';
                break;
        }
    }
    
    showEnterpriseModal() {
        document.getElementById('enterpriseModal').classList.add('active');
        
        // Set up color picker
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
                e.target.classList.add('selected');
                document.getElementById('enterpriseColor').value = e.target.getAttribute('data-color');
            });
        });
        
        // Select first color by default
        document.querySelector('.color-option').classList.add('selected');
    }
    
    hideEnterpriseModal() {
        document.getElementById('enterpriseModal').classList.remove('active');
        document.getElementById('enterpriseForm').reset();
    }
    
    async saveEnterprise(e) {
        if (e) e.preventDefault();
        
        const form = document.getElementById('enterpriseForm');
        const enterprise = {
            name: form.enterpriseName.value,
            type: form.enterpriseType.value,
            color: form.enterpriseColor.value,
            description: form.enterpriseDescription.value,
            createdAt: new Date().toISOString()
        };
        
        try {
            await window.database.addEnterprise(enterprise);
            this.hideEnterpriseModal();
            this.showToast('Enterprise saved successfully!', 'check_circle');
            
            // Refresh enterprises list
            this.enterprises = await window.database.getEnterprises();
            this.updateEnterpriseDropdowns();
            if (this.currentPage === 'enterprises') {
                this.loadEnterprises();
            }
            
        } catch (error) {
            console.error('Error saving enterprise:', error);
            this.showToast('Error saving enterprise', 'error');
        }
    }
    
    viewEnterprise(id) {
        console.log('Viewing enterprise:', id);
        // In a full implementation, this would show enterprise details
        this.showToast(`Viewing enterprise ${id}`, 'business');
    }
    
    async createBackup() {
        try {
            const data = await window.database.exportData();
            const encrypt = document.getElementById('encryptBackup').checked;
            const password = document.getElementById('backupPassword').value;
            
            let backupData = data;
            if (encrypt && password) {
                // Simple base64 "encryption" for demo
                backupData = btoa(JSON.stringify({
                    encrypted: true,
                    data: btoa(data),
                    timestamp: new Date().toISOString()
                }));
            }
            
            const blob = new Blob([backupData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `farmflow-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showToast('Backup created successfully!', 'cloud_download');
            
        } catch (error) {
            console.error('Error creating backup:', error);
            this.showToast('Error creating backup', 'error');
        }
    }
    
    handleRestoreFile(e) {
        const file = e.target.files[0];
        if (file) {
            document.getElementById('restoreBackup').disabled = false;
            this.restoreFile = file;
        }
    }
    
    async restoreBackup() {
        if (!this.restoreFile) return;
        
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                let data = e.target.result;
                
                // Check if encrypted
                if (data.startsWith('eyJ')) { // Simple check for JSON encoded in base64
                    try {
                        const decoded = JSON.parse(atob(data));
                        if (decoded.encrypted) {
                            // For demo, we'll just decode from base64
                            data = atob(decoded.data);
                        }
                    } catch (err) {
                        // Not encrypted in our format
                    }
                }
                
                await window.database.importData(data);
                this.showToast('Data restored successfully!', 'cloud_upload');
                
                // Refresh app
                await this.loadInitialData();
                this.updateDashboard();
                
                if (this.currentPage === 'enterprises') {
                    this.loadEnterprises();
                } else if (this.currentPage === 'transactions') {
                    this.loadTransactions();
                }
                
                // Reset file input
                document.getElementById('restoreFile').value = '';
                document.getElementById('restoreBackup').disabled = true;
                this.restoreFile = null;
            };
            reader.readAsText(this.restoreFile);
            
        } catch (error) {
            console.error('Error restoring backup:', error);
            this.showToast('Error restoring backup', 'error');
        }
    }
    
    loadSettings() {
        document.getElementById('userNameInput').value = this.userSettings.name;
        document.getElementById('defaultCurrency').value = this.userSettings.currency;
        document.getElementById('themeSelect').value = this.userSettings.theme;
        document.getElementById('autoSync').checked = this.userSettings.autoSync;
    }
    
    updateUserName(name) {
        this.userSettings.name = name;
        this.saveUserSettings();
        document.getElementById('userName').textContent = name;
    }
    
    updateCurrency(currency) {
        this.userSettings.currency = currency;
        this.saveUserSettings();
    }
    
    updateThemeSetting(theme) {
        if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = prefersDark ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', theme);
        this.userSettings.theme = theme;
        this.saveUserSettings();
    }
    
    showToast(message, icon = 'info') {
        const toast = document.getElementById('syncToast');
        const iconElement = document.getElementById('syncToastIcon');
        const messageElement = document.getElementById('syncToastMessage');
        
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
        }
    }
    
    // Placeholder methods for other pages
    async loadBudgets() {
        console.log('Loading budgets...');
        // Implementation for budgets page
    }
    
    async loadInvoices() {
        console.log('Loading invoices...');
        // Implementation for invoices page
    }
    
    async loadAssets() {
        console.log('Loading assets...');
        // Implementation for assets page
    }
    
    async loadLoans() {
        console.log('Loading loans...');
        // Implementation for loans page
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FarmFlowApp();
    
    // Set up enterprise form submission
    document.getElementById('enterpriseForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        window.app.saveEnterprise(e);
    });
    
    // Set up enterprise modal close buttons
    document.getElementById('closeEnterpriseModal')?.addEventListener('click', () => {
        window.app.hideEnterpriseModal();
    });
    
    document.getElementById('cancelEnterprise')?.addEventListener('click', () => {
        window.app.hideEnterpriseModal();
    });
    
    // Set up encryption checkbox
    document.getElementById('encryptBackup')?.addEventListener('change', (e) => {
        document.getElementById('backupPassword').disabled = !e.target.checked;
    });
});