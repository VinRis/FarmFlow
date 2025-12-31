// app.js - Complete update with all enhancements
class FarmFlowApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.currentLanguage = 'en';
        this.isOnline = navigator.onLine;
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
                thisMonth: 'This Month',
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
                thisMonth: 'Mwezi Huu',
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
    }
    
    setupEventListeners() {
        // Navigation
        document.getElementById('menuBtn').addEventListener('click', () => this.toggleDrawer(true));
        document.getElementById('closeDrawer').addEventListener('click', () => this.toggleDrawer(false));
        
        // Drawer overlay for closing on outside click
        document.getElementById('mainContent').addEventListener('click', () => {
            if (window.innerWidth < 768) {
                this.toggleDrawer(false);
            }
        });
        
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
        
        // Modern theme toggle
        document.getElementById('darkModeToggle').addEventListener('change', (e) => {
            this.toggleTheme(e.target.checked);
        });
        
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
        
        // Insights period change
        document.getElementById('insightsPeriod').addEventListener('change', () => this.updateEnterpriseInsights());
        document.getElementById('chartPeriod').addEventListener('change', () => this.updateDashboard());
        
        // Add buttons for different pages
        document.getElementById('addBudgetBtn')?.addEventListener('click', () => this.showBudgetModal());
        document.getElementById('addInvoiceBtn')?.addEventListener('click', () => this.showInvoiceModal());
        document.getElementById('addAssetBtn')?.addEventListener('click', () => this.showAssetModal());
        document.getElementById('addLoanBtn')?.addEventListener('click', () => this.showLoanModal());
        
        // Settings
        document.getElementById('userNameInput').addEventListener('change', (e) => this.updateUserName(e.target.value));
        document.getElementById('defaultCurrency').addEventListener('change', (e) => this.updateCurrency(e.target.value));
        document.getElementById('autoSync').addEventListener('change', (e) => this.updateAutoSync(e.target.checked));
        document.getElementById('notifications').addEventListener('change', (e) => this.updateNotifications(e.target.checked));
        document.getElementById('reduceMotion').addEventListener('change', (e) => this.updateReduceMotion(e.target.checked));
        
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
        }
    }
    
    async updateDashboard() {
        if (!window.database) return;
        
        // Calculate KPIs
        const transactions = await window.database.getTransactions();
        await this.updateKPIs(transactions);
        
        // Update enterprise insights
        await this.updateEnterpriseInsights();
        
        // Update chart
        this.updateIncomeChart(transactions);
        
        // Update recent transactions
        this.updateRecentTransactions(transactions);
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
        
        const transactions = await window.database.getTransactions();
        const period = document.getElementById('insightsPeriod').value;
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
        
        if (!bestEnterprise) {
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
    
    async loadEnterprises() {
        const container = document.getElementById('enterprisesList');
        if (!container) return;
        
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
        
        // Translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            if (translations[key]) {
                element.setAttribute('placeholder', translations[key]);
            }
        });
        
        // Update sync status text
        const syncText = document.getElementById('syncText');
        if (syncText && translations.online) {
            syncText.textContent = this.isOnline ? translations.online : 'Offline';
        }
    }
    
    loadSettings() {
        // Load avatar options
        this.loadAvatarOptions();
        
        // Load other settings
        document.getElementById('userNameInput').value = this.userSettings.name;
        document.getElementById('defaultCurrency').value = this.userSettings.currency;
        document.getElementById('autoSync').checked = this.userSettings.autoSync;
        document.getElementById('notifications').checked = this.userSettings.notifications;
        document.getElementById('reduceMotion').checked = this.userSettings.reduceMotion;
        document.getElementById('darkModeToggle').checked = this.userSettings.theme === 'dark';
        
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
    
    // Enhanced ROI Calculator
    showROICalculator() {
        document.getElementById('roiModal').classList.add('active');
        this.calculateROI(); // Initial calculation
    }
    
    calculateROI() {
        const investment = parseFloat(document.getElementById('roiInvestment').value) || 0;
        const revenue = parseFloat(document.getElementById('roiRevenue').value) || 0;
        const costs = parseFloat(document.getElementById('roiCosts').value) || 0;
        const years = parseFloat(document.getElementById('roiYears').value) || 1;
        
        // Calculate metrics
        const annualNetProfit = revenue - costs;
        const totalNetProfit = annualNetProfit * years;
        const roiPercentage = investment > 0 ? (totalNetProfit / investment * 100).toFixed(1) : 0;
        const paybackPeriod = annualNetProfit > 0 ? (investment / annualNetProfit).toFixed(2) : '∞';
        const totalReturn = investment + totalNetProfit;
        const annualizedReturn = investment > 0 ? 
            (Math.pow(1 + totalNetProfit/investment, 1/years) - 1) * 100 : 0;
        
        // Update UI
        document.getElementById('roiNetProfit').textContent = `KES ${annualNetProfit.toLocaleString()}`;
        document.getElementById('roiPercentage').textContent = `${roiPercentage}%`;
        document.getElementById('roiPayback').textContent = `${paybackPeriod} years`;
        document.getElementById('roiTotalReturn').textContent = `KES ${totalReturn.toLocaleString()}`;
        document.getElementById('roiAnnualized').textContent = `${annualizedReturn.toFixed(1)}%`;
        
        // Update ROI percentage color
        const roiEl = document.getElementById('roiPercentage');
        roiEl.className = `roi-percentage ${parseFloat(roiPercentage) >= 0 ? 'positive' : 'negative'}`;
        
        // Update chart
        this.updateROIChart(investment, totalNetProfit, costs * years);
    }
    
    updateROIChart(investment, totalProfit, totalCosts) {
        const ctx = document.getElementById('roiChart');
        if (!ctx) return;
        
        const ctx2d = ctx.getContext('2d');
        const totalReturn = investment + totalProfit;
        
        if (this.roiChart) {
            this.roiChart.destroy();
        }
        
        this.roiChart = new Chart(ctx2d, {
            type: 'doughnut',
            data: {
                labels: ['Investment', 'Profit', 'Costs'],
                datasets: [{
                    data: [investment, totalProfit, totalCosts],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.8)',
                        'rgba(75, 192, 192, 0.8)',
                        'rgba(255, 99, 132, 0.8)'
                    ],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(255, 99, 132, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: KES ${value.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
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
    
    // Other methods remain similar but updated for new features...
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FarmFlowApp();
});