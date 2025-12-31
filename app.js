// app.js - Complete fixed version
class FarmFlowApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.currentLanguage = 'en';
        this.isOnline = navigator.onLine;
        this.syncQueue = [];
        this.translations = {
            en: {
                // Dashboard
                appName: 'FarmFlow',
                dashboard: 'Dashboard',
                monthlyIncome: 'Monthly Income',
                monthlyExpenses: 'Monthly Expenses',
                netIncome: 'Net Income',
                thisMonth: 'This month',
                enterprisePerformance: 'Enterprise Performance',
                noInsights: 'No performance data yet',
                addTransactionsForInsights: 'Add transactions to see enterprise insights',
                quickActions: 'Quick Actions',
                viewAll: 'View all',
                sellProduce: 'Sell Produce',
                buyFeed: 'Buy Feed',
                recordPayment: 'Record Payment',
                payWages: 'Pay Wages',
                incomeByEnterprise: 'Income by Enterprise',
                recentTransactions: 'Recent Transactions',
                noTransactions: 'No transactions yet',
                addFirstTransaction: 'Add your first transaction',
                thisQuarter: 'This Quarter',
                thisYear: 'This Year',
                
                // Enterprises
                enterprises: 'Enterprises',
                add: 'Add',
                topPerformer: 'Top Performer This Month',
                netProfit: 'Net Profit',
                
                // Reports
                reports: 'Reports',
                roiCalculator: 'ROI Calculator',
                save: 'Save',
                initialInvestment: 'Initial Investment (KES)',
                investmentHelp: 'Total amount invested',
                annualRevenue: 'Annual Revenue (KES)',
                revenueHelp: 'Expected yearly income',
                annualCosts: 'Annual Costs (KES)',
                costsHelp: 'Yearly operating costs',
                timePeriod: 'Time Period (Years)',
                yearsHelp: 'Investment period',
                calculateROI: 'Calculate ROI',
                calculationResults: 'Calculation Results',
                roi: 'ROI',
                annualNetProfit: 'Annual Net Profit',
                revenueMinusCosts: 'Revenue - Costs',
                paybackPeriod: 'Payback Period',
                timeToRecover: 'Time to recover investment',
                totalReturn: 'Total Return',
                overInvestmentPeriod: 'Over investment period',
                annualizedReturn: 'Annualized Return',
                averageYearlyReturn: 'Average yearly return',
                investmentBreakdown: 'Investment Breakdown',
                
                // Settings
                settings: 'Settings',
                profile: 'Profile',
                profilePicture: 'Profile Picture',
                yourName: 'Your Name',
                general: 'General',
                defaultCurrency: 'Default Currency',
                autoSync: 'Auto-sync when online',
                notifications: 'Notifications',
                appearance: 'Appearance',
                darkMode: 'Dark Mode',
                reduceMotion: 'Reduce motion',
                dataManagement: 'Data Management',
                clearCache: 'Clear Cache',
                resetData: 'Reset All Data',
                about: 'About',
                madeByKPF: 'Made with ❤️ by KPF',
                forFarmers: 'For smallholder farmers worldwide',
                
                // Common
                farmer: 'Farmer',
                main: 'Main',
                tools: 'Tools',
                language: 'Language',
                english: 'English',
                kiswahili: 'Kiswahili',
                online: 'Online',
                offlineMessage: 'You\'re offline. Changes will sync when you reconnect.'
            },
            sw: {
                // Dashboard
                appName: 'FarmFlow',
                dashboard: 'Dashibodi',
                monthlyIncome: 'Mapato ya Mwezi',
                monthlyExpenses: 'Matumizi ya Mwezi',
                netIncome: 'Mapato Safi',
                thisMonth: 'Mwezi huu',
                enterprisePerformance: 'Ufanisi wa Biashara',
                noInsights: 'Hakuna data ya utendaji bado',
                addTransactionsForInsights: 'Ongeza miamala kuona ufanisi wa biashara',
                quickActions: 'Vitendo Haraka',
                viewAll: 'Tazama yote',
                sellProduce: 'Uza Mazao',
                buyFeed: 'Nunua Chakula cha Mifugo',
                recordPayment: 'Andika Malipo',
                payWages: 'Lipa Mishahara',
                incomeByEnterprise: 'Mapato kwa Biashara',
                recentTransactions: 'Miamala ya Hivi Karibuni',
                noTransactions: 'Hakuna miamala bado',
                addFirstTransaction: 'Ongeza miamala yako ya kwanza',
                thisQuarter: 'Robo Hii',
                thisYear: 'Mwaka Huu',
                
                // Enterprises
                enterprises: 'Biashara',
                add: 'Ongeza',
                topPerformer: 'Bora zaidi Mwezi Huu',
                netProfit: 'Faida Safi',
                
                // Reports
                reports: 'Ripoti',
                roiCalculator: 'Kikokotoo cha ROI',
                save: 'Hifadhi',
                initialInvestment: 'Uwekezaji wa Awali (KES)',
                investmentHelp: 'Jumla ya fedha zilizowekezwa',
                annualRevenue: 'Mapato ya Mwaka (KES)',
                revenueHelp: 'Mapato yanayotarajiwa kwa mwaka',
                annualCosts: 'Gharama za Mwaka (KES)',
                costsHelp: 'Gharama za uendeshaji kwa mwaka',
                timePeriod: 'Muda (Miaka)',
                yearsHelp: 'Muda wa uwekezaji',
                calculateROI: 'Kokotoa ROI',
                calculationResults: 'Matokeo ya Hesabu',
                roi: 'ROI',
                annualNetProfit: 'Faida ya Mwaka',
                revenueMinusCosts: 'Mapato - Gharama',
                paybackPeriod: 'Muda wa Kurudisha',
                timeToRecover: 'Muda wa kurejesha uwekezaji',
                totalReturn: 'Mapato ya Jumla',
                overInvestmentPeriod: 'Katika muda wa uwekezaji',
                annualizedReturn: 'Mapato ya Mwaka',
                averageYearlyReturn: 'Wastani wa mapato ya mwaka',
                investmentBreakdown: 'Mgawanyiko wa Uwekezaji',
                
                // Settings
                settings: 'Mipangilio',
                profile: 'Wasifu',
                profilePicture: 'Picha ya Wasifu',
                yourName: 'Jina Lako',
                general: 'Mipangilio ya Jumla',
                defaultCurrency: 'Sarafu Chaguomsingi',
                autoSync: 'Sanikisha kiotomatiki mtandaoni',
                notifications: 'Arifa',
                appearance: 'Mwonekano',
                darkMode: 'Hali ya Giza',
                reduceMotion: 'Punguza mwendo',
                dataManagement: 'Usimamizi wa Data',
                clearCache: 'Futa Kache',
                resetData: 'Weka Upya Data Yote',
                about: 'Kuhusu',
                madeByKPF: 'Imetengenezwa kwa ❤️ na KPF',
                forFarmers: 'Kwa wakulima wadogo duniani',
                
                // Common
                farmer: 'Mkulima',
                main: 'Kuu',
                tools: 'Zana',
                language: 'Lugha',
                english: 'Kiingereza',
                kiswahili: 'Kiswahili',
                online: 'Mtandaoni',
                offlineMessage: 'Haupo mtandaoni. Mabadiliko yatasafirishwa ukirudishwa mtandaoni.'
            }
        };
        
        this.userSettings = {
            name: 'FarmFlow User',
            currency: 'KES',
            theme: 'light',
            language: 'en',
            avatar: 'F',
            autoSync: true,
            notifications: true,
            reduceMotion: false
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
        
        this.avatars = ['F', '🌾', '🐄', '🐔', '🌽', '🐟', '🐝', '🚜', '💰', '👨‍🌾', '👩‍🌾'];
        
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
        this.setupDrawerOverlay();
        
        // Initialize sync manager
        if (window.syncManager) {
            window.syncManager.init();
        }
    }
    
    setupEventListeners() {
        // Navigation
        document.getElementById('menuBtn').addEventListener('click', () => this.toggleDrawer(true));
        document.getElementById('closeDrawer').addEventListener('click', () => this.toggleDrawer(false));
        
        // Search functionality - FIXED
        document.getElementById('searchBtn').addEventListener('click', () => this.showSearch());
        document.getElementById('closeSearch').addEventListener('click', () => this.hideSearch());
        document.getElementById('globalSearch').addEventListener('input', (e) => this.performSearch(e.target.value));
        
        // Modern theme toggle - FIXED
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', (e) => {
                this.toggleTheme(e.target.checked);
            });
        }
        
        // Header theme toggle - FIXED
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const isDark = currentTheme === 'dark';
                this.toggleTheme(!isDark);
                
                // Update toggle in settings
                if (document.getElementById('darkModeToggle')) {
                    document.getElementById('darkModeToggle').checked = !isDark;
                }
            });
        }
        
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
        
        // View all buttons - FIXED
        document.getElementById('viewAllTransactions').addEventListener('click', () => this.navigateTo('transactions'));
        document.getElementById('viewAllRecentTransactions').addEventListener('click', () => this.navigateTo('transactions'));
        
        // FAB - FIXED
        document.getElementById('fab').addEventListener('click', () => this.showTransactionModal());
        
        // Transaction page buttons - FIXED
        document.getElementById('addTransaction')?.addEventListener('click', () => this.showTransactionModal());
        document.getElementById('addFirstTransaction')?.addEventListener('click', () => this.showTransactionModal());
        
        // Insights period change
        document.getElementById('insightsPeriod')?.addEventListener('change', () => this.updateEnterpriseInsights());
        document.getElementById('chartPeriod')?.addEventListener('change', () => this.updateDashboard());
        
        // Enterprise page - FIXED
        document.getElementById('addEnterpriseBtn')?.addEventListener('click', () => this.showEnterpriseModal());
        
        // Reports page - FIXED
        document.querySelectorAll('[data-report]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const reportType = e.currentTarget.getAttribute('data-report');
                this.showReport(reportType);
            });
        });
        
        // Add buttons for different pages - FIXED
        document.getElementById('addBudgetBtn')?.addEventListener('click', () => this.showBudgetModal());
        document.getElementById('addInvoiceBtn')?.addEventListener('click', () => this.showInvoiceModal());
        document.getElementById('addAssetBtn')?.addEventListener('click', () => this.showAssetModal());
        document.getElementById('addLoanBtn')?.addEventListener('click', () => this.showLoanModal());
        
        // Transaction form - FIXED
        document.getElementById('transactionForm')?.addEventListener('submit', (e) => this.saveTransaction(e));
        document.getElementById('closeTransactionModal')?.addEventListener('click', () => this.hideTransactionModal());
        document.getElementById('cancelTransaction')?.addEventListener('click', () => this.hideTransactionModal());
        
        // Transaction type toggle
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateTransactionCategories();
            });
        });
        
        // Settings
        document.getElementById('userNameInput')?.addEventListener('change', (e) => this.updateUserName(e.target.value));
        document.getElementById('defaultCurrency')?.addEventListener('change', (e) => this.updateCurrency(e.target.value));
        document.getElementById('autoSync')?.addEventListener('change', (e) => this.updateAutoSync(e.target.checked));
        document.getElementById('notifications')?.addEventListener('change', (e) => this.updateNotifications(e.target.checked));
        document.getElementById('reduceMotion')?.addEventListener('change', (e) => this.updateReduceMotion(e.target.checked));
        
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
    
    setupDrawerOverlay() {
        // Create overlay for closing drawer on outside click
        const overlay = document.createElement('div');
        overlay.className = 'drawer-overlay';
        overlay.id = 'drawerOverlay';
        overlay.addEventListener('click', () => this.toggleDrawer(false));
        document.body.appendChild(overlay);
    }
    
    toggleDrawer(show) {
        const drawer = document.getElementById('drawer');
        const overlay = document.getElementById('drawerOverlay');
        
        if (show) {
            drawer.classList.add('open');
            overlay.classList.add('active');
        } else {
            drawer.classList.remove('open');
            overlay.classList.remove('active');
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
                    // Reports are loaded on button click
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
                    this.loadBackupPage();
                    break;
                case 'settings':
                    this.loadSettings();
                    break;
                case 'help':
                    this.loadHelpPage();
                    break;
            }
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
        if (window.database) {
            const transactions = await window.database.searchTransactions(query);
            transactions.forEach(t => {
                results.push({
                    type: 'transaction',
                    title: t.category,
                    details: `${t.type === 'income' ? '+' : '-'} ${t.currency} ${t.amount} - ${t.enterprise}`,
                    date: t.date,
                    action: () => {
                        this.hideSearch();
                        this.navigateTo('transactions');
                    }
                });
            });
            
            // Search enterprises
            const enterprises = await window.database.getEnterprises();
            enterprises.filter(e => e.name.toLowerCase().includes(query.toLowerCase())).forEach(e => {
                results.push({
                    type: 'enterprise',
                    title: e.name,
                    details: e.type,
                    action: () => {
                        this.hideSearch();
                        this.navigateTo('enterprises');
                    }
                });
            });
        }
        
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
        action();
    }
    
    toggleTheme(isDark) {
        const newTheme = isDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        this.userSettings.theme = newTheme;
        this.saveUserSettings();
        
        // Update theme toggle UI
        const themeIcon = document.querySelector('#themeIcon');
        if (themeIcon) {
            themeIcon.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
        }
        
        // Update header theme toggle
        const headerThemeIcon = document.querySelector('.theme-icon');
        if (headerThemeIcon) {
            headerThemeIcon.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
        }
        
        // Update toggle switch state
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.checked = isDark;
        }
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
        
        // Translate the entire page
        this.translatePage();
    }
    
    translatePage() {
        const translations = this.translations[this.currentLanguage];
        
        // Translate all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[key]) {
                element.textContent = translations[key];
            }
        });
        
        // Update sync status text
        const syncText = document.getElementById('syncText');
        if (syncText && translations.online) {
            syncText.textContent = this.isOnline ? translations.online : 'Offline';
        }
    }
    
    checkOnlineStatus() {
        this.isOnline = navigator.onLine;
        const statusElement = document.getElementById('syncStatus');
        const syncIcon = document.getElementById('syncIcon');
        const syncText = document.getElementById('syncText');
        
        if (this.isOnline) {
            statusElement.className = 'sync-status';
            syncIcon.textContent = 'cloud_done';
            syncText.textContent = 'Online';
            document.getElementById('offlineIndicator').classList.remove('show');
        } else {
            statusElement.className = 'sync-status offline';
            syncIcon.textContent = 'cloud_off';
            syncText.textContent = 'Offline';
            document.getElementById('offlineIndicator').classList.add('show');
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
        // Wait for database to initialize
        return new Promise((resolve) => {
            const checkDatabase = () => {
                if (window.database) {
                    console.log('Database initialized');
                    resolve();
                } else {
                    setTimeout(checkDatabase, 100);
                }
            };
            checkDatabase();
        });
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
            document.getElementById('transEnterprise')
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
        const type = document.querySelector('.type-btn.active')?.getAttribute('data-type');
        if (!type) return;
        
        const categorySelect = document.getElementById('transCategory');
        if (!categorySelect) return;
        
        // Clear existing options
        while (categorySelect.options.length > 1) {
            categorySelect.remove(1);
        }
        
        // Add categories based on type
        this.categories[type]?.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }
    
    async updateDashboard() {
        if (!window.database) {
            console.error('Database not available');
            return;
        }
        
        try {
            // Calculate KPIs
            const transactions = await window.database.getTransactions();
            await this.updateKPIs(transactions);
            
            // Update enterprise insights
            await this.updateEnterpriseInsights();
            
            // Update chart
            this.updateIncomeChart(transactions);
            
            // Update recent transactions
            this.updateRecentTransactions(transactions);
        } catch (error) {
            console.error('Error updating dashboard:', error);
        }
    }
    
    async updateKPIs(transactions) {
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
        const incomeTrendEl = document.getElementById('incomeTrend');
        const expenseTrendEl = document.getElementById('expenseTrend');
        
        if (incomeTrendEl) {
            incomeTrendEl.textContent = `${incomeTrend >= 0 ? '+' : ''}${incomeTrend}% from last month`;
            incomeTrendEl.className = `kpi-trend ${parseFloat(incomeTrend) >= 0 ? 'positive' : 'negative'}`;
        }
        
        if (expenseTrendEl) {
            expenseTrendEl.textContent = `${expenseTrend >= 0 ? '+' : ''}${expenseTrend}% from last month`;
            expenseTrendEl.className = `kpi-trend ${parseFloat(expenseTrend) >= 0 ? 'negative' : 'positive'}`;
        }
    }
    
    async updateEnterpriseInsights() {
        if (!window.database || this.enterprises.length === 0) return;
        
        try {
            const transactions = await window.database.getTransactions();
            const period = document.getElementById('insightsPeriod')?.value || 'month';
            const now = new Date();
            
            // Filter transactions based on period
            let filteredTransactions = transactions;
            if (period === 'month') {
                const currentMonth = now.getMonth();
                const currentYear = now.getFullYear();
                filteredTransactions = transactions.filter(t => {
                    const transDate = new Date(t.date);
                    return transDate.getMonth() === currentMonth && 
                           transDate.getFullYear() === currentYear;
                });
            } else if (period === 'quarter') {
                const currentQuarter = Math.floor(now.getMonth() / 3);
                const currentYear = now.getFullYear();
                filteredTransactions = transactions.filter(t => {
                    const transDate = new Date(t.date);
                    const quarter = Math.floor(transDate.getMonth() / 3);
                    return quarter === currentQuarter && 
                           transDate.getFullYear() === currentYear;
                });
            } else if (period === 'year') {
                const currentYear = now.getFullYear();
                filteredTransactions = transactions.filter(t => {
                    const transDate = new Date(t.date);
                    return transDate.getFullYear() === currentYear;
                });
            }
            
            // Calculate enterprise performance
            const enterprisePerformance = {};
            this.enterprises.forEach(ent => {
                enterprisePerformance[ent.name] = {
                    income: 0,
                    expense: 0,
                    net: 0,
                    color: ent.color,
                    icon: ent.icon || 'business'
                };
            });
            
            filteredTransactions.forEach(t => {
                if (enterprisePerformance[t.enterprise]) {
                    if (t.type === 'income') {
                        enterprisePerformance[t.enterprise].income += t.amount;
                    } else {
                        enterprisePerformance[t.enterprise].expense += t.amount;
                    }
                }
            });
            
            // Calculate net and find best performer
            let bestEnterprise = null;
            let bestNet = -Infinity;
            
            Object.keys(enterprisePerformance).forEach(name => {
                const perf = enterprisePerformance[name];
                perf.net = perf.income - perf.expense;
                
                if (perf.net > bestNet) {
                    bestNet = perf.net;
                    bestEnterprise = { name, ...perf };
                }
            });
            
            // Update insights grid
            this.updateInsightsGrid(enterprisePerformance);
            
            // Update best enterprise on enterprises page
            this.updateBestEnterpriseSummary(bestEnterprise);
        } catch (error) {
            console.error('Error updating enterprise insights:', error);
        }
    }
    
    updateInsightsGrid(enterprisePerformance) {
        const container = document.getElementById('enterpriseInsights');
        const enterprises = Object.keys(enterprisePerformance);
        
        if (enterprises.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="material-icons">insights</span>
                    <p data-i18n="noInsights">No performance data yet</p>
                    <p class="empty-state-sub" data-i18n="addTransactionsForInsights">Add transactions to see enterprise insights</p>
                </div>
            `;
            this.translatePage();
            return;
        }
        
        container.innerHTML = enterprises.map(name => {
            const perf = enterprisePerformance[name];
            const profitMargin = perf.income > 0 ? ((perf.net / perf.income) * 100).toFixed(1) : 0;
            
            return `
                <div class="insight-card">
                    <div class="insight-header">
                        <div class="insight-icon" style="background-color: ${perf.color};">
                            <span class="material-icons">${perf.icon}</span>
                        </div>
                        <div class="insight-title">${name}</div>
                    </div>
                    <div class="insight-stats">
                        <div class="insight-stat">
                            <div class="insight-stat-value" style="color: ${perf.color};">KES ${perf.income.toLocaleString()}</div>
                            <div class="insight-stat-label">Income</div>
                        </div>
                        <div class="insight-stat">
                            <div class="insight-stat-value">KES ${perf.expense.toLocaleString()}</div>
                            <div class="insight-stat-label">Expenses</div>
                        </div>
                    </div>
                    <div class="insight-trend">
                        <div style="display: flex; justify-content: space-between;">
                            <span>Net Profit: <strong>KES ${perf.net.toLocaleString()}</strong></span>
                            <span style="color: ${perf.net >= 0 ? '#4CAF50' : '#F44336'}">
                                ${profitMargin >= 0 ? '+' : ''}${profitMargin}%
                            </span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    updateBestEnterpriseSummary(bestEnterprise) {
        const container = document.getElementById('bestEnterpriseSummary');
        const iconEl = document.getElementById('bestEnterpriseIcon');
        const nameEl = document.getElementById('bestEnterpriseName');
        const statsEl = document.getElementById('bestEnterpriseStats');
        const profitEl = document.getElementById('bestEnterpriseProfit');
        
        if (!bestEnterprise || !bestEnterprise.name) {
            nameEl.textContent = 'No data';
            statsEl.textContent = 'Add transactions to see performance';
            profitEl.innerHTML = '<span>KES 0</span><small>Net Profit</small>';
            iconEl.innerHTML = '<span class="material-icons">business</span>';
            return;
        }
        
        const profitMargin = bestEnterprise.income > 0 ? 
            ((bestEnterprise.net / bestEnterprise.income) * 100).toFixed(1) : 0;
        
        nameEl.textContent = bestEnterprise.name;
        statsEl.textContent = `KES ${bestEnterprise.income.toLocaleString()} income • KES ${bestEnterprise.expense.toLocaleString()} expenses`;
        profitEl.innerHTML = `<span>KES ${bestEnterprise.net.toLocaleString()}</span><small>Net Profit</small>`;
        iconEl.innerHTML = `<span class="material-icons">${bestEnterprise.icon}</span>`;
        iconEl.style.backgroundColor = `${bestEnterprise.color}20`;
    }
    
    async loadTransactions() {
        const container = document.getElementById('allTransactions');
        if (!container) return;
        
        try {
            const transactions = await window.database.getTransactions();
            
            if (transactions.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <span class="material-icons">receipt</span>
                        <p data-i18n="noTransactions">No transactions yet</p>
                        <button class="btn primary" id="addFirstTrans">Add your first transaction</button>
                    </div>
                `;
                document.getElementById('addFirstTrans')?.addEventListener('click', () => this.showTransactionModal());
                this.translatePage();
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
                    const id = e.currentTarget.getAttribute('data-id');
                    this.editTransaction(parseInt(id));
                });
            });
            
            document.querySelectorAll('.delete-transaction').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    this.deleteTransaction(parseInt(id));
                });
            });
        } catch (error) {
            console.error('Error loading transactions:', error);
            container.innerHTML = `
                <div class="empty-state">
                    <span class="material-icons">error</span>
                    <p>Error loading transactions</p>
                </div>
            `;
        }
    }
    
    async loadEnterprises() {
        const container = document.getElementById('enterprisesList');
        if (!container) return;
        
        try {
            // Get current month transactions for enterprise stats
            const transactions = await window.database.getTransactions();
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            
            const monthTransactions = transactions.filter(t => {
                const transDate = new Date(t.date);
                return transDate.getMonth() === currentMonth && 
                       transDate.getFullYear() === currentYear;
            });
            
            // Calculate enterprise stats
            const enterpriseStats = {};
            this.enterprises.forEach(ent => {
                enterpriseStats[ent.name] = { income: 0, expense: 0, net: 0 };
            });
            
            monthTransactions.forEach(t => {
                if (enterpriseStats[t.enterprise]) {
                    if (t.type === 'income') {
                        enterpriseStats[t.enterprise].income += t.amount;
                    } else {
                        enterpriseStats[t.enterprise].expense += t.amount;
                    }
                }
            });
            
            // Calculate net profit
            Object.keys(enterpriseStats).forEach(name => {
                const stats = enterpriseStats[name];
                stats.net = stats.income - stats.expense;
            });
            
            if (this.enterprises.length === 0) {
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
            
            container.innerHTML = this.enterprises.map(ent => {
                const stats = enterpriseStats[ent.name] || { income: 0, expense: 0, net: 0 };
                const profitMargin = stats.income > 0 ? ((stats.net / stats.income) * 100).toFixed(1) : 0;
                
                return `
                    <div class="enterprise-card enterprise-${ent.type}" data-id="${ent.id}">
                        <div class="enterprise-icon" style="background-color: ${ent.color}20; color: ${ent.color};">
                            <span class="material-icons">${this.getEnterpriseIcon(ent.type)}</span>
                        </div>
                        <h3>${ent.name}</h3>
                        <p>${ent.type.charAt(0).toUpperCase() + ent.type.slice(1)} enterprise</p>
                        <div class="enterprise-stats">
                            <div class="stat">
                                <span class="stat-label">Income</span>
                                <span class="stat-value">KES ${stats.income.toLocaleString()}</span>
                            </div>
                            <div class="stat">
                                <span class="stat-label">Expenses</span>
                                <span class="stat-value">KES ${stats.expense.toLocaleString()}</span>
                            </div>
                        </div>
                        <div class="enterprise-profit">
                            <span class="profit-label">Net Profit</span>
                            <span class="profit-value ${stats.net >= 0 ? 'positive' : 'negative'}">
                                ${stats.net >= 0 ? '+' : ''}KES ${stats.net.toLocaleString()}
                            </span>
                            <span class="profit-margin ${stats.net >= 0 ? 'positive' : 'negative'}">
                                ${profitMargin >= 0 ? '+' : ''}${profitMargin}%
                            </span>
                        </div>
                    </div>
                `;
            }).join('');
            
            // Make enterprise cards clickable
            document.querySelectorAll('.enterprise-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    this.viewEnterprise(parseInt(id));
                });
            });
            
            // Update best enterprise summary
            this.updateEnterpriseInsights();
        } catch (error) {
            console.error('Error loading enterprises:', error);
        }
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
    
    showTransactionModal() {
        document.getElementById('transactionModal').classList.add('active');
        document.getElementById('transDate').valueAsDate = new Date();
        this.updateTransactionCategories();
        
        // Set default currency
        if (document.getElementById('transCurrency')) {
            document.getElementById('transCurrency').value = this.userSettings.currency;
        }
    }
    
    hideTransactionModal() {
        document.getElementById('transactionModal').classList.remove('active');
        document.getElementById('transactionForm').reset();
    }
    
    async saveTransaction(e) {
        e.preventDefault();
        
        const form = e.target;
        const type = document.querySelector('.type-btn.active')?.getAttribute('data-type');
        if (!type) return;
        
        const transaction = {
            date: form.transDate.value,
            type: type,
            enterprise: form.transEnterprise.value,
            category: form.transCategory.value,
            amount: parseFloat(form.transAmount.value) || 0,
            currency: form.transCurrency?.value || 'KES',
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
            
            // Update enterprise stats
            if (this.currentPage === 'enterprises') {
                this.loadEnterprises();
            }
            
        } catch (error) {
            console.error('Error saving transaction:', error);
            this.showToast('Error saving transaction', 'error');
        }
    }
    
    async editTransaction(id) {
        // Implementation for edit transaction
        this.showToast('Edit feature coming soon!', 'edit');
    }
    
    async deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            try {
                await window.database.deleteTransaction(id);
                this.showToast('Transaction deleted', 'delete');
                
                // Update UI
                this.updateDashboard();
                if (this.currentPage === 'transactions') {
                    this.loadTransactions();
                }
            } catch (error) {
                console.error('Error deleting transaction:', error);
                this.showToast('Error deleting transaction', 'error');
            }
        }
    }
    
    showEnterpriseModal() {
        document.getElementById('enterpriseModal').classList.add('active');
        
        // Set up color picker
        document.querySelectorAll('.color-option').forEach(option => {
            option.addEventListener('click', (e) => {
                document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
                e.currentTarget.classList.add('selected');
                document.getElementById('enterpriseColor').value = e.currentTarget.getAttribute('data-color');
            });
        });
        
        // Select first color by default
        const firstColor = document.querySelector('.color-option');
        if (firstColor) {
            firstColor.classList.add('selected');
            document.getElementById('enterpriseColor').value = firstColor.getAttribute('data-color');
        }
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
    
    hideEnterpriseModal() {
        document.getElementById('enterpriseModal').classList.remove('active');
        document.getElementById('enterpriseForm').reset();
    }
    
    viewEnterprise(id) {
        this.showToast(`Viewing enterprise details - Coming soon!`, 'business');
    }
    
    showReport(reportType) {
        // For now, show a toast for reports
        this.showToast(`${reportType} report - Coming soon!`, 'bar_chart');
    }
    
    showBudgetModal() {
        this.showToast('Budget feature coming soon!', 'savings');
    }
    
    showInvoiceModal() {
        this.showToast('Invoice feature coming soon!', 'description');
    }
    
    showAssetModal() {
        this.showToast('Asset register feature coming soon!', 'agriculture');
    }
    
    showLoanModal() {
        this.showToast('Loan tracking feature coming soon!', 'account_balance');
    }
    
    handleQuickAction(action) {
        this.showTransactionModal();
        
        switch(action) {
            case 'sell-produce':
                document.querySelectorAll('.type-btn')[0]?.click();
                if (document.getElementById('transCategory')) {
                    document.getElementById('transCategory').value = 'Crop Sales';
                }
                break;
            case 'buy-feed':
                document.querySelectorAll('.type-btn')[1]?.click();
                if (document.getElementById('transCategory')) {
                    document.getElementById('transCategory').value = 'Animal Feed';
                }
                break;
            case 'record-payment':
                document.querySelectorAll('.type-btn')[0]?.click();
                if (document.getElementById('transCategory')) {
                    document.getElementById('transCategory').value = 'Other Income';
                }
                break;
            case 'pay-wages':
                document.querySelectorAll('.type-btn')[1]?.click();
                if (document.getElementById('transCategory')) {
                    document.getElementById('transCategory').value = 'Labor';
                }
                break;
        }
    }
    
    loadSettings() {
        // Load avatar options
        this.loadAvatarOptions();
        
        // Load other settings
        if (document.getElementById('userNameInput')) {
            document.getElementById('userNameInput').value = this.userSettings.name;
        }
        if (document.getElementById('defaultCurrency')) {
            document.getElementById('defaultCurrency').value = this.userSettings.currency;
        }
        if (document.getElementById('autoSync')) {
            document.getElementById('autoSync').checked = this.userSettings.autoSync;
        }
        if (document.getElementById('notifications')) {
            document.getElementById('notifications').checked = this.userSettings.notifications;
        }
        if (document.getElementById('reduceMotion')) {
            document.getElementById('reduceMotion').checked = this.userSettings.reduceMotion;
        }
        if (document.getElementById('darkModeToggle')) {
            document.getElementById('darkModeToggle').checked = this.userSettings.theme === 'dark';
        }
        
        // Update theme icon
        const themeIcon = document.querySelector('#themeIcon');
        if (themeIcon) {
            themeIcon.textContent = this.userSettings.theme === 'dark' ? 'light_mode' : 'dark_mode';
        }
    }
    
    loadAvatarOptions() {
        const container = document.getElementById('avatarOptions');
        if (!container) return;
        
        container.innerHTML = this.avatars.map(avatar => `
            <div class="avatar-option ${avatar === this.userSettings.avatar ? 'selected' : ''}" 
                 data-avatar="${avatar}">
                ${avatar}
            </div>
        `).join('');
        
        // Add click event listeners
        document.querySelectorAll('.avatar-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const avatar = e.currentTarget.getAttribute('data-avatar');
                this.updateAvatar(avatar);
            });
        });
    }
    
    updateAvatar(avatar) {
        this.userSettings.avatar = avatar;
        this.saveUserSettings();
        
        // Update avatar in UI
        document.getElementById('userAvatar').textContent = avatar;
        
        // Update selection
        document.querySelectorAll('.avatar-option').forEach(option => {
            option.classList.remove('selected');
            if (option.getAttribute('data-avatar') === avatar) {
                option.classList.add('selected');
            }
        });
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
    
    updateAutoSync(enabled) {
        this.userSettings.autoSync = enabled;
        this.saveUserSettings();
    }
    
    updateNotifications(enabled) {
        this.userSettings.notifications = enabled;
        this.saveUserSettings();
    }
    
    updateReduceMotion(enabled) {
        this.userSettings.reduceMotion = enabled;
        this.saveUserSettings();
        
        if (enabled) {
            document.documentElement.style.setProperty('--transition-fast', '0ms');
            document.documentElement.style.setProperty('--transition-normal', '0ms');
            document.documentElement.style.setProperty('--transition-slow', '0ms');
        } else {
            document.documentElement.style.setProperty('--transition-fast', '150ms ease');
            document.documentElement.style.setProperty('--transition-normal', '250ms ease');
            document.documentElement.style.setProperty('--transition-slow', '350ms ease');
        }
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
    
    updateRecentTransactions(transactions) {
        const container = document.getElementById('recentTransactions');
        const recent = transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5);
        
        if (recent.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="material-icons">receipt</span>
                    <p data-i18n="noTransactions">No transactions yet</p>
                    <button class="btn primary" id="addFirstTransaction">Add your first transaction</button>
                </div>
            `;
            document.getElementById('addFirstTransaction').addEventListener('click', () => this.showTransactionModal());
            this.translatePage();
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
    
    loadBudgets() {
        const container = document.getElementById('budgetsList');
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="material-icons">savings</span>
                    <p>No budgets set up yet</p>
                    <p class="empty-state-sub">Set budgets for your enterprises to track spending</p>
                    <button class="btn primary" id="setupBudget">Set up your first budget</button>
                </div>
            `;
            document.getElementById('setupBudget').addEventListener('click', () => this.showBudgetModal());
        }
    }
    
    loadInvoices() {
        const container = document.getElementById('invoicesList');
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="material-icons">description</span>
                    <p>No invoices created yet</p>
                    <p class="empty-state-sub">Create professional invoices for your sales</p>
                    <button class="btn primary" id="createFirstInvoice">Create your first invoice</button>
                </div>
            `;
            document.getElementById('createFirstInvoice').addEventListener('click', () => this.showInvoiceModal());
        }
    }
    
    loadAssets() {
        const container = document.getElementById('assetsList');
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="material-icons">agriculture</span>
                    <p>No assets registered yet</p>
                    <p class="empty-state-sub">Track your farm assets and their depreciation</p>
                    <button class="btn primary" id="addFirstAsset">Register your first asset</button>
                </div>
            `;
            document.getElementById('addFirstAsset').addEventListener('click', () => this.showAssetModal());
        }
    }
    
    loadLoans() {
        const container = document.getElementById('loansList');
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="material-icons">account_balance</span>
                    <p>No loans tracked yet</p>
                    <p class="empty-state-sub">Track your loans and repayment schedules</p>
                    <button class="btn primary" id="addFirstLoan">Add your first loan</button>
                </div>
            `;
            document.getElementById('addFirstLoan').addEventListener('click', () => this.showLoanModal());
        }
    }
    
    loadBackupPage() {
        // Already implemented in HTML
    }
    
    loadHelpPage() {
        // Add contact details
        const helpContainer = document.querySelector('.help-container');
        if (helpContainer && !document.getElementById('contactDetails')) {
            const contactSection = document.createElement('div');
            contactSection.className = 'contact-section';
            contactSection.id = 'contactDetails';
            contactSection.innerHTML = `
                <h3>Contact & Support</h3>
                <div class="contact-info">
                    <div class="contact-item">
                        <span class="material-icons">phone</span>
                        <div>
                            <h4>Phone/WhatsApp</h4>
                            <p>0732364559 (Kevin)</p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <span class="material-icons">email</span>
                        <div>
                            <h4>Email</h4>
                            <p>support@farmflow.app</p>
                        </div>
                    </div>
                    <div class="contact-item">
                        <span class="material-icons">schedule</span>
                        <div>
                            <h4>Support Hours</h4>
                            <p>Monday - Friday: 8 AM - 5 PM EAT</p>
                        </div>
                    </div>
                </div>
            `;
            helpContainer.appendChild(contactSection);
        }
    }
    
    setupLanguage() {
        // Load saved language or use browser default
        const browserLang = navigator.language.split('-')[0];
        const savedLang = this.userSettings.language;
        
        if (savedLang) {
            this.setLanguage(savedLang);
        } else if (browserLang === 'sw') {
            this.setLanguage('sw');
        } else {
            this.setLanguage('en');
        }
    }
    
    setupTheme() {
        // Apply saved theme
        document.documentElement.setAttribute('data-theme', this.userSettings.theme);
        
        // Update icons
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = this.userSettings.theme === 'dark' ? 'light_mode' : 'dark_mode';
        }
        
        // Update toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        if (darkModeToggle) {
            darkModeToggle.checked = this.userSettings.theme === 'dark';
        }
    }
    
    loadUserSettings() {
        const saved = localStorage.getItem('farmflow-settings');
        if (saved) {
            try {
                this.userSettings = JSON.parse(saved);
            } catch (e) {
                console.error('Error loading settings:', e);
            }
        }
        
        // Apply settings
        document.getElementById('userName').textContent = this.userSettings.name;
        document.getElementById('userAvatar').textContent = this.userSettings.avatar;
    }
    
    saveUserSettings() {
        localStorage.setItem('farmflow-settings', JSON.stringify(this.userSettings));
    }
    
    setupServiceWorker() {
        // Already registered in HTML
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
    
    showToast(message, icon = 'info') {
        const toast = document.getElementById('syncToast');
        const iconElement = document.getElementById('syncToastIcon');
        const messageElement = document.getElementById('syncToastMessage');
        
        if (!toast || !iconElement || !messageElement) return;
        
        iconElement.textContent = icon;
        messageElement.textContent = message;
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
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