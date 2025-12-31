// app.js - Complete Debugged Version
class FarmFlowApp {
    constructor() {
        console.log('FarmFlowApp constructor called');
        this.currentPage = 'dashboard';
        this.currentLanguage = 'en';
        this.isOnline = navigator.onLine;
        
        // Initialize translations
        this.translations = this.initializeTranslations();
        
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
    
    initializeTranslations() {
        return {
            en: {
                // Common
                appName: 'FarmFlow',
                farmer: 'Farmer',
                main: 'Main',
                tools: 'Tools',
                language: 'Language',
                english: 'English',
                kiswahili: 'Kiswahili',
                online: 'Online',
                offlineMessage: 'You\'re offline. Changes will sync when you reconnect.',
                add: 'Add',
                cancel: 'Cancel',
                save: 'Save',
                viewAll: 'View all',
                filter: 'Filter',
                clear: 'Clear',
                viewReport: 'View Report',
                calculate: 'Calculate',
                exportAll: 'Export All',
                download: 'Download',
                print: 'Print',
                type: 'Type',
                income: 'Income',
                expense: 'Expense',
                amount: 'Amount',
                enterprise: 'Enterprise',
                category: 'Category',
                date: 'Date',
                description: 'Description',
                selectEnterprise: 'Select Enterprise',
                selectCategory: 'Select Category',
                saveTransaction: 'Save Transaction',
                addTransaction: 'Add Transaction',
                edit: 'Edit',
                delete: 'Delete',
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
                gettingStarted: 'Getting Started',
                faq: 'Frequently Asked Questions',
                contactSupport: 'Contact & Support',
                phoneWhatsApp: 'Phone/WhatsApp',
                email: 'Email',
                supportHours: 'Support Hours',
                supportHoursDetail: 'Monday - Friday: 8 AM - 5 PM EAT',
                
                // Dashboard
                dashboard: 'Dashboard',
                monthlyIncome: 'Monthly Income',
                monthlyExpenses: 'Monthly Expenses',
                netIncome: 'Net Income',
                thisMonth: 'This month',
                enterprisePerformance: 'Enterprise Performance',
                noInsights: 'No performance data yet',
                addTransactionsForInsights: 'Add transactions to see enterprise insights',
                quickActions: 'Quick Actions',
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
                topPerformer: 'Top Performer This Month',
                netProfit: 'Net Profit',
                addEnterprise: 'Add Enterprise',
                enterpriseName: 'Enterprise Name',
                colorTheme: 'Color Theme',
                descriptionOptional: 'Description (Optional)',
                saveEnterprise: 'Save Enterprise',
                
                // Reports
                reports: 'Reports',
                profitLoss: 'Profit & Loss',
                profitLossDesc: 'Monthly and annual income vs expenses',
                cashFlow: 'Cash Flow',
                cashFlowDesc: 'Track cash inflows and outflows',
                seasonalComparison: 'Seasonal Comparison',
                seasonalDesc: 'Compare harvest vs non-harvest months',
                roiCalculator: 'ROI Calculator',
                roiDesc: 'Return on investment by enterprise',
                
                // Budgets
                budgets: 'Budgets',
                addBudget: 'Add Budget',
                noBudgets: 'No budgets set up yet',
                budgetsDesc: 'Set budgets for your enterprises to track spending',
                setupFirstBudget: 'Set up your first budget',
                
                // Invoices
                invoices: 'Invoices',
                createInvoice: 'Create Invoice',
                noInvoices: 'No invoices created yet',
                invoicesDesc: 'Create professional invoices for your sales',
                createFirstInvoice: 'Create your first invoice',
                
                // Assets
                assets: 'Asset Register',
                addAsset: 'Add Asset',
                noAssets: 'No assets registered yet',
                assetsDesc: 'Track your farm assets and their depreciation',
                addFirstAsset: 'Register your first asset',
                
                // Loans
                loans: 'Loans',
                addLoan: 'Add Loan',
                noLoans: 'No loans tracked yet',
                loansDesc: 'Track your loans and repayment schedules',
                addFirstLoan: 'Add your first loan',
                
                // Backup
                backup: 'Backup & Restore',
                backupData: 'Backup Data',
                backupDesc: 'Create a backup of all your farm data',
                createBackup: 'Create Backup',
                restoreData: 'Restore Data',
                restoreDesc: 'Restore from a previous backup',
                chooseFile: 'Choose File',
                restore: 'Restore',
                encryptBackup: 'Encrypt Backup',
                encryptDesc: 'Add password protection to your backups',
                enableEncryption: 'Enable encryption',
                enterPassword: 'Enter password',
                
                // Help
                help: 'Help & Tutorial',
                addEnterprises: 'Add Your Enterprises',
                enterprisesStepDesc: 'Start by adding your farm enterprises (dairy, crops, poultry, etc.)',
                recordTransactions: 'Record Transactions',
                transactionsStepDesc: 'Add income and expenses for each enterprise',
                viewReports: 'View Reports',
                reportsStepDesc: 'Check your financial performance and make better decisions',
                faq1: 'How do I work offline?',
                faq1Answer: 'FarmFlow works completely offline. All your data is stored on your device. When you come back online, it will sync automatically.',
                faq2: 'Can I use multiple currencies?',
                faq2Answer: 'Yes, you can record transactions in different currencies. The app will convert them to your default currency for reporting.',
                faq3: 'How do I backup my data?',
                faq3Answer: 'Go to Backup & Restore section to create an encrypted backup file. You can restore it anytime on any device.'
            },
            sw: {
                // Swahili translations (partial for example)
                dashboard: 'Dashibodi',
                transactions: 'Miamala',
                enterprises: 'Biashara',
                reports: 'Ripoti',
                budgets: 'Bajeti',
                invoices: 'Anuarisi',
                assets: 'Sajili ya Mali',
                loans: 'Mikopo',
                backup: 'Salio na Rejesho',
                settings: 'Mipangilio',
                help: 'Usaidizi na Mafunzo',
                english: 'Kiingereza',
                kiswahili: 'Kiswahili',
                farmer: 'Mkulima'
            }
        };
    }
    
    async init() {
        console.log('Initializing FarmFlow App...');
        
        // Load user settings first
        this.loadUserSettings();
        
        // Setup theme and language
        this.setupTheme();
        this.setupLanguage();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Check online status
        this.checkOnlineStatus();
        
        // Setup database
        await this.setupDatabase();
        
        // Load initial data
        await this.loadInitialData();
        
        // Update dashboard
        this.updateDashboard();
        
        // Setup service worker
        this.setupServiceWorker();
        
        // Setup drawer overlay
        this.setupDrawerOverlay();
        
        console.log('FarmFlow App initialized successfully');
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Navigation
        document.getElementById('menuBtn')?.addEventListener('click', () => {
            console.log('Menu button clicked');
            this.toggleDrawer(true);
        });
        
        document.getElementById('closeDrawer')?.addEventListener('click', () => {
            console.log('Close drawer clicked');
            this.toggleDrawer(false);
        });
        
        // Navigation items
        const navItems = document.querySelectorAll('.nav-item');
        console.log('Found navigation items:', navItems.length);
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const page = item.getAttribute('data-page');
                console.log('Navigation clicked:', page);
                
                this.navigateTo(page);
                this.toggleDrawer(false);
            });
        });
        
        // Search functionality
        document.getElementById('searchBtn')?.addEventListener('click', () => {
            console.log('Search button clicked');
            this.showSearch();
        });
        
        document.getElementById('closeSearch')?.addEventListener('click', () => {
            console.log('Close search clicked');
            this.hideSearch();
        });
        
        // Theme toggle
        document.getElementById('themeToggle')?.addEventListener('click', () => {
            console.log('Theme toggle clicked');
            this.toggleTheme();
        });
        
        // Language selection
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const lang = btn.getAttribute('data-lang');
                console.log('Language selected:', lang);
                
                this.setLanguage(lang);
            });
        });
        
        // Quick actions
        document.querySelectorAll('.quick-action').forEach(action => {
            action.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const actionType = action.getAttribute('data-action');
                console.log('Quick action:', actionType);
                
                this.handleQuickAction(actionType);
            });
        });
        
        // View all buttons
        document.getElementById('viewAllTransactions')?.addEventListener('click', () => {
            console.log('View all transactions clicked');
            this.navigateTo('transactions');
        });
        
        document.getElementById('viewAllRecentTransactions')?.addEventListener('click', () => {
            console.log('View all recent transactions clicked');
            this.navigateTo('transactions');
        });
        
        // FAB
        document.getElementById('fab')?.addEventListener('click', () => {
            console.log('FAB clicked');
            this.showTransactionModal();
        });
        
        // Transaction page buttons
        document.getElementById('addTransaction')?.addEventListener('click', () => {
            console.log('Add transaction clicked');
            this.showTransactionModal();
        });
        
        // Transaction form
        const transactionForm = document.getElementById('transactionForm');
        if (transactionForm) {
            transactionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Transaction form submitted');
                this.saveTransaction(e);
            });
        }
        
        document.getElementById('closeTransactionModal')?.addEventListener('click', () => {
            console.log('Close transaction modal clicked');
            this.hideTransactionModal();
        });
        
        document.getElementById('cancelTransaction')?.addEventListener('click', () => {
            console.log('Cancel transaction clicked');
            this.hideTransactionModal();
        });
        
        // Transaction type toggle
        document.querySelectorAll('.type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                console.log('Transaction type toggled');
                document.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateTransactionCategories();
            });
        });
        
        // Enterprise page
        document.getElementById('addEnterpriseBtn')?.addEventListener('click', () => {
            console.log('Add enterprise clicked');
            this.showEnterpriseModal();
        });
        
        // Enterprise form
        const enterpriseForm = document.getElementById('enterpriseForm');
        if (enterpriseForm) {
            enterpriseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                console.log('Enterprise form submitted');
                this.saveEnterprise(e);
            });
        }
        
        document.getElementById('closeEnterpriseModal')?.addEventListener('click', () => {
            console.log('Close enterprise modal clicked');
            this.hideEnterpriseModal();
        });
        
        document.getElementById('cancelEnterprise')?.addEventListener('click', () => {
            console.log('Cancel enterprise clicked');
            this.hideEnterpriseModal();
        });
        
        // Reports
        document.querySelectorAll('[data-report]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const reportType = e.currentTarget.getAttribute('data-report');
                console.log('Report clicked:', reportType);
                
                this.showReport(reportType);
            });
        });
        
        // Other add buttons
        document.getElementById('addBudgetBtn')?.addEventListener('click', () => {
            console.log('Add budget clicked');
            this.showBudgetModal();
        });
        
        document.getElementById('addInvoiceBtn')?.addEventListener('click', () => {
            console.log('Add invoice clicked');
            this.showInvoiceModal();
        });
        
        document.getElementById('addAssetBtn')?.addEventListener('click', () => {
            console.log('Add asset clicked');
            this.showAssetModal();
        });
        
        document.getElementById('addLoanBtn')?.addEventListener('click', () => {
            console.log('Add loan clicked');
            this.showLoanModal();
        });
        
        // Settings
        document.getElementById('userNameInput')?.addEventListener('change', (e) => {
            this.updateUserName(e.target.value);
        });
        
        document.getElementById('defaultCurrency')?.addEventListener('change', (e) => {
            this.updateCurrency(e.target.value);
        });
        
        // Online/offline events
        window.addEventListener('online', () => {
            console.log('Online event fired');
            this.handleOnline();
        });
        
        window.addEventListener('offline', () => {
            console.log('Offline event fired');
            this.handleOffline();
        });
        
        // Global click handler for drawer overlay
        document.addEventListener('click', (e) => {
            const drawer = document.getElementById('drawer');
            const overlay = document.getElementById('drawerOverlay');
            
            if (drawer?.classList.contains('open') && 
                !drawer.contains(e.target) && 
                e.target.id !== 'menuBtn') {
                this.toggleDrawer(false);
            }
        });
        
        console.log('Event listeners setup complete');
    }
    
    toggleDrawer(show) {
        const drawer = document.getElementById('drawer');
        const overlay = document.getElementById('drawerOverlay');
        
        if (show) {
            drawer?.classList.add('open');
            overlay?.classList.add('active');
        } else {
            drawer?.classList.remove('open');
            overlay?.classList.remove('active');
        }
    }
    
    setupDrawerOverlay() {
        // Check if overlay already exists
        if (!document.getElementById('drawerOverlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'drawer-overlay';
            overlay.id = 'drawerOverlay';
            document.body.appendChild(overlay);
            
            overlay.addEventListener('click', () => {
                this.toggleDrawer(false);
            });
        }
    }
    
    navigateTo(page) {
        console.log('Navigating to page:', page);
        
        if (!page) {
            console.error('No page specified for navigation');
            return;
        }
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            const itemPage = item.getAttribute('data-page');
            if (itemPage === page) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
            p.style.display = 'none';
        });
        
        // Show selected page
        const pageId = `${page}Page`;
        const pageElement = document.getElementById(pageId);
        
        if (pageElement) {
            pageElement.classList.add('active');
            pageElement.style.display = 'block';
            this.currentPage = page;
            
            // Load page-specific data
            this.loadPageData(page);
        } else {
            console.error(`Page element not found: ${pageId}`);
            
            // Fallback to dashboard
            const dashboardPage = document.getElementById('dashboardPage');
            if (dashboardPage) {
                dashboardPage.classList.add('active');
                dashboardPage.style.display = 'block';
                this.currentPage = 'dashboard';
            }
        }
    }
    
    loadPageData(page) {
        console.log('Loading page data for:', page);
        
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
    
    async setupDatabase() {
        console.log('Setting up database...');
        
        // Wait for database to be initialized by database.js
        return new Promise((resolve) => {
            const checkDatabase = () => {
                if (window.database) {
                    console.log('Database found:', window.database);
                    resolve();
                } else {
                    console.log('Waiting for database...');
                    setTimeout(checkDatabase, 100);
                }
            };
            checkDatabase();
        });
    }
    
    async loadInitialData() {
        console.log('Loading initial data...');
        
        if (window.database) {
            try {
                this.enterprises = await window.database.getEnterprises();
                console.log('Loaded enterprises:', this.enterprises.length);
                
                // If no enterprises, create default ones
                if (this.enterprises.length === 0) {
                    console.log('Creating default enterprises...');
                    const defaultEnterprises = [
                        { name: 'Dairy', type: 'dairy', color: '#2196F3', icon: 'agriculture', createdAt: new Date().toISOString() },
                        { name: 'Poultry', type: 'poultry', color: '#FF9800', icon: 'egg', createdAt: new Date().toISOString() },
                        { name: 'Crops', type: 'crops', color: '#4CAF50', icon: 'grass', createdAt: new Date().toISOString() },
                        { name: 'Livestock', type: 'livestock', color: '#795548', icon: 'pets', createdAt: new Date().toISOString() }
                    ];
                    
                    for (const enterprise of defaultEnterprises) {
                        await window.database.addEnterprise(enterprise);
                    }
                    
                    this.enterprises = await window.database.getEnterprises();
                    console.log('Created default enterprises:', this.enterprises.length);
                }
                
                // Update enterprise dropdowns
                this.updateEnterpriseDropdowns();
                
            } catch (error) {
                console.error('Error loading initial data:', error);
            }
        } else {
            console.error('Database not available');
        }
    }
    
    updateEnterpriseDropdowns() {
        console.log('Updating enterprise dropdowns...');
        
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
        console.log('Updating transaction categories...');
        
        const type = document.querySelector('.type-btn.active')?.getAttribute('data-type');
        if (!type) return;
        
        const categorySelect = document.getElementById('transCategory');
        if (!categorySelect) return;
        
        // Clear existing options except first
        while (categorySelect.options.length > 1) {
            categorySelect.remove(1);
        }
        
        // Add categories based on type
        if (this.categories[type]) {
            this.categories[type].forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                categorySelect.appendChild(option);
            });
        }
    }
    
    // Dashboard Methods
    async updateDashboard() {
        console.log('Updating dashboard...');
        
        if (!window.database) {
            console.error('Database not available for dashboard update');
            return;
        }
        
        try {
            const transactions = await window.database.getTransactions();
            
            // Update KPIs
            this.updateKPIs(transactions);
            
            // Update enterprise insights
            this.updateEnterpriseInsights();
            
            // Update chart
            this.updateIncomeChart(transactions);
            
            // Update recent transactions
            this.updateRecentTransactions(transactions);
            
        } catch (error) {
            console.error('Error updating dashboard:', error);
        }
    }
    
    updateKPIs(transactions) {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        
        // Filter transactions for current month
        const currentMonthTransactions = transactions.filter(t => {
            const transDate = new Date(t.date);
            return transDate.getMonth() === currentMonth && 
                   transDate.getFullYear() === currentYear;
        });
        
        // Calculate totals
        const monthlyIncome = currentMonthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + (t.amount || 0), 0);
        
        const monthlyExpense = currentMonthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + (t.amount || 0), 0);
        
        const netIncome = monthlyIncome - monthlyExpense;
        
        // Update UI
        const monthlyIncomeEl = document.getElementById('monthlyIncome');
        const monthlyExpenseEl = document.getElementById('monthlyExpense');
        const netIncomeEl = document.getElementById('netIncome');
        
        if (monthlyIncomeEl) monthlyIncomeEl.textContent = `KES ${monthlyIncome.toLocaleString()}`;
        if (monthlyExpenseEl) monthlyExpenseEl.textContent = `KES ${monthlyExpense.toLocaleString()}`;
        if (netIncomeEl) netIncomeEl.textContent = `KES ${netIncome.toLocaleString()}`;
    }
    
    async updateEnterpriseInsights() {
        if (!window.database || this.enterprises.length === 0) return;
        
        try {
            const transactions = await window.database.getTransactions();
            
            // Calculate enterprise performance for current month
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            
            const enterprisePerformance = {};
            
            // Initialize with zero values
            this.enterprises.forEach(ent => {
                enterprisePerformance[ent.name] = {
                    income: 0,
                    expense: 0,
                    net: 0,
                    color: ent.color || '#2196F3',
                    icon: ent.icon || 'business'
                };
            });
            
            // Calculate totals for current month
            transactions.forEach(t => {
                const transDate = new Date(t.date);
                if (transDate.getMonth() === currentMonth && 
                    transDate.getFullYear() === currentYear &&
                    enterprisePerformance[t.enterprise]) {
                    
                    if (t.type === 'income') {
                        enterprisePerformance[t.enterprise].income += t.amount || 0;
                    } else {
                        enterprisePerformance[t.enterprise].expense += t.amount || 0;
                    }
                }
            });
            
            // Calculate net and find best performer
            Object.keys(enterprisePerformance).forEach(name => {
                const perf = enterprisePerformance[name];
                perf.net = perf.income - perf.expense;
            });
            
            // Update insights grid
            this.updateInsightsGrid(enterprisePerformance);
            
        } catch (error) {
            console.error('Error updating enterprise insights:', error);
        }
    }
    
    updateInsightsGrid(enterprisePerformance) {
        const container = document.getElementById('enterpriseInsights');
        if (!container) return;
        
        const enterprises = Object.keys(enterprisePerformance);
        
        if (enterprises.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="material-icons">insights</span>
                    <p>No performance data yet</p>
                    <p class="empty-state-sub">Add transactions to see enterprise insights</p>
                </div>
            `;
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
    
    updateIncomeChart(transactions) {
        const ctx = document.getElementById('incomeChart');
        if (!ctx) return;
        
        try {
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
                    .reduce((sum, t) => sum + (t.amount || 0), 0);
                return monthIncome;
            });
            
            // Destroy existing chart if it exists
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
        } catch (error) {
            console.error('Error updating income chart:', error);
        }
    }
    
    updateRecentTransactions(transactions) {
        const container = document.getElementById('recentTransactions');
        if (!container) return;
        
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
            
            // Re-attach event listener
            document.getElementById('addFirstTransaction')?.addEventListener('click', () => {
                this.showTransactionModal();
            });
            
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
                    ${trans.type === 'income' ? '+' : '-'} KES ${(trans.amount || 0).toLocaleString()}
                </div>
            </div>
        `).join('');
    }
    
    // Transactions Page
    async loadTransactions() {
        console.log('Loading transactions...');
        
        const container = document.getElementById('allTransactions');
        if (!container) return;
        
        try {
            const transactions = await window.database.getTransactions();
            
            if (transactions.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <span class="material-icons">receipt</span>
                        <p>No transactions yet</p>
                        <button class="btn primary" id="addFirstTrans">Add your first transaction</button>
                    </div>
                `;
                
                document.getElementById('addFirstTrans')?.addEventListener('click', () => {
                    this.showTransactionModal();
                });
                
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
                            ${trans.type === 'income' ? '+' : '-'} KES ${(trans.amount || 0).toLocaleString()}
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
    
    // Enterprises Page
    async loadEnterprises() {
        console.log('Loading enterprises...');
        
        const container = document.getElementById('enterprisesList');
        if (!container) return;
        
        try {
            // Get current month transactions for enterprise stats
            const transactions = await window.database.getTransactions();
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();
            
            // Calculate enterprise stats
            const enterpriseStats = {};
            this.enterprises.forEach(ent => {
                enterpriseStats[ent.name] = { income: 0, expense: 0, net: 0 };
            });
            
            transactions.forEach(t => {
                const transDate = new Date(t.date);
                if (transDate.getMonth() === currentMonth && 
                    transDate.getFullYear() === currentYear &&
                    enterpriseStats[t.enterprise]) {
                    
                    if (t.type === 'income') {
                        enterpriseStats[t.enterprise].income += t.amount || 0;
                    } else {
                        enterpriseStats[t.enterprise].expense += t.amount || 0;
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
                
                document.getElementById('addFirstEnterprise')?.addEventListener('click', () => {
                    this.showEnterpriseModal();
                });
                
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
            
        } catch (error) {
            console.error('Error loading enterprises:', error);
            container.innerHTML = `
                <div class="empty-state">
                    <span class="material-icons">error</span>
                    <p>Error loading enterprises</p>
                </div>
            `;
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
    
    // Modal Methods
    showTransactionModal() {
        console.log('Showing transaction modal');
        
        const modal = document.getElementById('transactionModal');
        if (modal) {
            modal.classList.add('active');
            
            // Set default values
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('transDate').value = today;
            
            // Update categories
            this.updateTransactionCategories();
            
            // Set default currency
            const currencySelect = document.getElementById('transCurrency');
            if (currencySelect) {
                currencySelect.value = this.userSettings.currency;
            }
        }
    }
    
    hideTransactionModal() {
        const modal = document.getElementById('transactionModal');
        if (modal) {
            modal.classList.remove('active');
        }
        
        // Reset form
        const form = document.getElementById('transactionForm');
        if (form) {
            form.reset();
        }
    }
    
    async saveTransaction(e) {
        e.preventDefault();
        console.log('Saving transaction...');
        
        const form = e.target;
        const type = document.querySelector('.type-btn.active')?.getAttribute('data-type');
        
        if (!type) {
            this.showToast('Please select transaction type', 'error');
            return;
        }
        
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
        
        // Validate required fields
        if (!transaction.enterprise || !transaction.category || transaction.amount <= 0) {
            this.showToast('Please fill all required fields correctly', 'error');
            return;
        }
        
        try {
            await window.database.addTransaction(transaction);
            this.hideTransactionModal();
            this.showToast('Transaction saved successfully!', 'check_circle');
            
            // Update UI based on current page
            if (this.currentPage === 'dashboard') {
                this.updateDashboard();
            } else if (this.currentPage === 'transactions') {
                this.loadTransactions();
            } else if (this.currentPage === 'enterprises') {
                this.loadEnterprises();
            }
            
        } catch (error) {
            console.error('Error saving transaction:', error);
            this.showToast('Error saving transaction', 'error');
        }
    }
    
    editTransaction(id) {
        console.log('Edit transaction:', id);
        this.showToast('Edit feature coming soon!', 'edit');
    }
    
    async deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            try {
                await window.database.deleteTransaction(id);
                this.showToast('Transaction deleted', 'delete');
                
                // Update UI based on current page
                if (this.currentPage === 'dashboard') {
                    this.updateDashboard();
                } else if (this.currentPage === 'transactions') {
                    this.loadTransactions();
                } else if (this.currentPage === 'enterprises') {
                    this.loadEnterprises();
                }
                
            } catch (error) {
                console.error('Error deleting transaction:', error);
                this.showToast('Error deleting transaction', 'error');
            }
        }
    }
    
    showEnterpriseModal() {
        console.log('Showing enterprise modal');
        
        const modal = document.getElementById('enterpriseModal');
        if (modal) {
            modal.classList.add('active');
            
            // Set up color picker
            const colorOptions = document.querySelectorAll('.color-option');
            colorOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    colorOptions.forEach(o => o.classList.remove('selected'));
                    e.currentTarget.classList.add('selected');
                    document.getElementById('enterpriseColor').value = e.currentTarget.getAttribute('data-color');
                });
            });
            
            // Select first color by default
            if (colorOptions.length > 0) {
                colorOptions[0].classList.add('selected');
                document.getElementById('enterpriseColor').value = colorOptions[0].getAttribute('data-color');
            }
        }
    }
    
    hideEnterpriseModal() {
        const modal = document.getElementById('enterpriseModal');
        if (modal) {
            modal.classList.remove('active');
        }
        
        // Reset form
        const form = document.getElementById('enterpriseForm');
        if (form) {
            form.reset();
        }
    }
    
    async saveEnterprise(e) {
        e.preventDefault();
        console.log('Saving enterprise...');
        
        const form = e.target;
        const enterprise = {
            name: form.enterpriseName.value,
            type: form.enterpriseType.value,
            color: form.enterpriseColor.value,
            description: form.enterpriseDescription.value,
            createdAt: new Date().toISOString()
        };
        
        // Validate required fields
        if (!enterprise.name || !enterprise.type) {
            this.showToast('Please fill all required fields', 'error');
            return;
        }
        
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
        this.showToast(`Enterprise details view - Coming soon!`, 'business');
    }
    
    // Other Pages
    loadBudgets() {
        console.log('Loading budgets page...');
        // Implementation for budgets
    }
    
    loadInvoices() {
        console.log('Loading invoices page...');
        // Implementation for invoices
    }
    
    loadAssets() {
        console.log('Loading assets page...');
        // Implementation for assets
    }
    
    loadLoans() {
        console.log('Loading loans page...');
        // Implementation for loans
    }
    
    loadBackupPage() {
        console.log('Loading backup page...');
        // Implementation for backup
    }
    
    loadSettings() {
        console.log('Loading settings...');
        
        // Load user settings into form
        document.getElementById('userNameInput').value = this.userSettings.name;
        document.getElementById('defaultCurrency').value = this.userSettings.currency;
        
        // Load avatar options
        this.loadAvatarOptions();
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
    
    loadHelpPage() {
        console.log('Loading help page...');
        // Help page is mostly static, no additional loading needed
    }
    
    // UI Helpers
    showSearch() {
        const searchOverlay = document.getElementById('searchOverlay');
        if (searchOverlay) {
            searchOverlay.classList.add('active');
            document.getElementById('globalSearch').focus();
        }
    }
    
    hideSearch() {
        const searchOverlay = document.getElementById('searchOverlay');
        if (searchOverlay) {
            searchOverlay.classList.remove('active');
        }
    }
    
    handleQuickAction(action) {
        console.log('Quick action:', action);
        this.showTransactionModal();
        
        // Pre-fill based on action
        switch(action) {
            case 'sell-produce':
                document.querySelectorAll('.type-btn')[0]?.click();
                document.getElementById('transCategory').value = 'Crop Sales';
                break;
            case 'buy-feed':
                document.querySelectorAll('.type-btn')[1]?.click();
                document.getElementById('transCategory').value = 'Animal Feed';
                break;
            case 'record-payment':
                document.querySelectorAll('.type-btn')[0]?.click();
                document.getElementById('transCategory').value = 'Other Income';
                break;
            case 'pay-wages':
                document.querySelectorAll('.type-btn')[1]?.click();
                document.getElementById('transCategory').value = 'Labor';
                break;
        }
    }
    
    showReport(reportType) {
        console.log('Showing report:', reportType);
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
    
    // Theme and Language
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        this.userSettings.theme = newTheme;
        this.saveUserSettings();
        
        // Update icon
        const icon = document.querySelector('#themeToggle .material-icons');
        if (icon) {
            icon.textContent = newTheme === 'dark' ? 'light_mode' : 'dark_mode';
        }
        
        console.log('Theme changed to:', newTheme);
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
        
        console.log('Language changed to:', lang);
    }
    
    translatePage() {
        const translations = this.translations[this.currentLanguage] || this.translations.en;
        
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
    
    setupLanguage() {
        // Load saved language or use browser default
        const savedLang = this.userSettings.language;
        const browserLang = navigator.language.split('-')[0];
        
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
        
        // Update icon
        const icon = document.querySelector('#themeToggle .material-icons');
        if (icon) {
            icon.textContent = this.userSettings.theme === 'dark' ? 'light_mode' : 'dark_mode';
        }
    }
    
    // Sync and Online Status
    checkOnlineStatus() {
        this.isOnline = navigator.onLine;
        const statusElement = document.getElementById('syncStatus');
        const syncIcon = document.getElementById('syncIcon');
        const syncText = document.getElementById('syncText');
        const offlineIndicator = document.getElementById('offlineIndicator');
        
        if (this.isOnline) {
            if (statusElement) statusElement.className = 'sync-status';
            if (syncIcon) syncIcon.textContent = 'cloud_done';
            if (syncText) syncText.textContent = 'Online';
            if (offlineIndicator) offlineIndicator.classList.remove('show');
        } else {
            if (statusElement) statusElement.className = 'sync-status offline';
            if (syncIcon) syncIcon.textContent = 'cloud_off';
            if (syncText) syncText.textContent = 'Offline';
            if (offlineIndicator) offlineIndicator.classList.add('show');
        }
    }
    
    handleOnline() {
        console.log('App is now online');
        this.isOnline = true;
        this.checkOnlineStatus();
        this.showToast('Back online. Syncing data...', 'wifi');
        
        // Trigger sync if auto-sync is enabled
        if (this.userSettings.autoSync && window.syncManager) {
            window.syncManager.sync();
        }
    }
    
    handleOffline() {
        console.log('App is now offline');
        this.isOnline = false;
        this.checkOnlineStatus();
        this.showToast('You are offline. Changes will sync when back online.', 'wifi_off');
    }
    
    // Settings Management
    updateUserName(name) {
        this.userSettings.name = name;
        this.saveUserSettings();
        document.getElementById('userName').textContent = name;
    }
    
    updateCurrency(currency) {
        this.userSettings.currency = currency;
        this.saveUserSettings();
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
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');
        
        if (userName) userName.textContent = this.userSettings.name;
        if (userAvatar) userAvatar.textContent = this.userSettings.avatar;
    }
    
    saveUserSettings() {
        localStorage.setItem('farmflow-settings', JSON.stringify(this.userSettings));
    }
    
    // Toast Notifications
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
    
    setupServiceWorker() {
        // Service worker is registered in HTML
        console.log('Service Worker setup');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded - Initializing FarmFlow App');
    
    // Initialize the app
    window.app = new FarmFlowApp();
    
    // Additional setup that requires app instance
    console.log('FarmFlow App initialized successfully');
});