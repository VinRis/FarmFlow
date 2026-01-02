// FarmFlow Main Application
class FarmFlowApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.isOnline = navigator.onLine;
        this.pendingSync = false;
        
        // Check for required dependencies
        this.checkDependencies().then(() => {
            this.init().catch(error => {
                console.error('App initialization failed:', error);
                this.showErrorWithRetry('Failed to initialize application. Please check your browser compatibility.');
            });
        }).catch(error => {
            this.showErrorWithRetry('Required dependencies are missing. Please check your internet connection.');
        });
    }

    async checkDependencies() {
        // Check if Dexie is available
        if (typeof Dexie === 'undefined') {
            throw new Error('Dexie.js is not loaded. Please check internet connection.');
        }
        
        // Check if Chart.js is available
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded, charts will be disabled');
        }
        
        return true;
    }

    async init() {
        try {
            console.log('🚜 Starting FarmFlow initialization...');
            
            // Show splash screen
            await this.showSplashScreen();
            
            // Initialize database first
            console.log('📦 Initializing database...');
            await window.db.initialize();
            
            // Initialize other components
            console.log('🎨 Initializing UI components...');
            window.ui.initialize();
            
            // Initialize sync manager
            console.log('🔄 Initializing sync manager...');
            await window.sync.initialize();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Load initial data
            console.log('📊 Loading initial data...');
            await this.loadInitialData();
            
            // Set up routing
            this.setupRouting();
            
            // Check sync status
            this.checkSyncStatus();
            
            console.log('✅ FarmFlow initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize app:', error);
            this.showErrorWithRetry('Failed to initialize application. Please refresh the page.');
        }
    }

    showErrorWithRetry(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-overlay';
        errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            padding: 20px;
            color: white;
            text-align: center;
        `;
        
        errorDiv.innerHTML = `
            <div class="error-content" style="max-width: 500px;">
                <div style="font-size: 4rem; margin-bottom: 20px;">🚜</div>
                <h2 style="margin-bottom: 20px;">FarmFlow Error</h2>
                <p style="margin-bottom: 30px; font-size: 16px; opacity: 0.9;">${message}</p>
                <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                    <button onclick="location.reload()" style="
                        padding: 12px 24px;
                        background: white;
                        color: #2E7D32;
                        border: none;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: transform 0.2s;
                    " onmouseover="this.style.transform='scale(1.05)'" 
                     onmouseout="this.style.transform='scale(1)'">
                        🔄 Refresh Page
                    </button>
                    <button onclick="this.closest('.error-overlay').remove(); 
                                     document.querySelector('.splash-screen').style.display = 'none';
                                     document.querySelector('.app-container').style.opacity = '1';" 
                     style="
                        padding: 12px 24px;
                        background: transparent;
                        color: white;
                        border: 2px solid white;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.2s;
                    " onmouseover="this.style.background='rgba(255,255,255,0.1)'" 
                     onmouseout="this.style.background='transparent'">
                        Continue Anyway
                    </button>
                </div>
                <div style="margin-top: 30px; padding: 15px; background: rgba(255,255,255,0.1); border-radius: 8px; font-size: 14px;">
                    <p style="margin-bottom: 10px;">💡 <strong>Troubleshooting Tips:</strong></p>
                    <ul style="text-align: left; padding-left: 20px; opacity: 0.9;">
                        <li>Make sure you have internet connection for first load</li>
                        <li>Try using Chrome, Firefox, or Edge browser</li>
                        <li>Clear browser cache and try again</li>
                        <li>Enable JavaScript in your browser</li>
                    </ul>
                </div>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
    }

    // Rest of your existing methods remain the same...
    // Only add this new method and modify constructor/init

    async showSplashScreen() {
        return new Promise(resolve => {
            const splash = document.getElementById('splash-screen');
            const farmTips = [
                "💡 Tip: Record all farm expenses daily for accurate profit calculation",
                "🌱 Did you know? Regular record keeping increases farm profitability by up to 30%",
                "🐔 Poultry Tip: Keep feed fresh and dry to prevent diseases",
                "🥛 Dairy Tip: Milk at consistent times for maximum yield",
                "🌾 Crop Tip: Rotate crops to maintain soil fertility",
                "💰 Finance Tip: Track every shilling to understand your true costs"
            ];
            
            // Show random farm tip
            const randomTip = farmTips[Math.floor(Math.random() * farmTips.length)];
            document.getElementById('farm-tip').textContent = randomTip;
            
            // Hide splash after animation
            setTimeout(() => {
                splash.style.opacity = '0';
                setTimeout(() => {
                    splash.style.display = 'none';
                    document.querySelector('.app-container').style.opacity = '1';
                    resolve();
                }, 500);
            }, 2500);
        });
    }

    async initializeApp() {
        // Set current date
        this.updateDate();
        
        // Apply theme
        this.applyTheme();
        
        // Initialize database
        await window.db.initialize();
        
        // Initialize UI components
        window.ui.initialize();
        
        // Register service worker
        this.registerServiceWorker();
        
        // Set up page routing
        this.setupRouting();
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
        
        // Menu toggle
        document.getElementById('menu-btn').addEventListener('click', () => this.toggleSideNav());
        document.getElementById('close-nav').addEventListener('click', () => this.toggleSideNav());
        
        // Navigation items
        document.querySelectorAll('.nav-item, .nav-btn').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page') || 
                            item.getAttribute('href')?.replace('#', '');
                if (page) this.navigateTo(page);
            });
        });
        
        // Quick action buttons
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                this.handleQuickAction(action);
            });
        });
        
        // Transaction form
        const transactionForm = document.getElementById('transaction-form-element');
        if (transactionForm) {
            transactionForm.addEventListener('submit', (e) => this.handleTransactionSubmit(e));
        }
        
        // Type selector
        document.querySelectorAll('.type-option').forEach(option => {
            option.addEventListener('click', () => {
                const type = option.getAttribute('data-type');
                this.updateTransactionType(type);
            });
        });
        
        // Close form buttons
        document.querySelectorAll('.close-form').forEach(btn => {
            btn.addEventListener('click', () => this.hideTransactionForm());
        });
        
        // New transaction button
        const newTransactionBtn = document.getElementById('new-transaction-btn');
        if (newTransactionBtn) {
            newTransactionBtn.addEventListener('click', () => this.showTransactionForm());
        }
        
        // Add transaction from dashboard
        const addTransactionBtn = document.getElementById('add-transaction-btn');
        if (addTransactionBtn) {
            addTransactionBtn.addEventListener('click', () => {
                this.navigateTo('transactions');
                setTimeout(() => this.showTransactionForm(), 300);
            });
        }
        
        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
        
        // Refresh dashboard
        const refreshBtn = document.getElementById('refresh-dashboard');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refreshDashboard());
        }
        
        // Online/offline detection
        window.addEventListener('online', () => this.handleOnlineStatus());
        window.addEventListener('offline', () => this.handleOfflineStatus());
        
        // Before unload - save data
        window.addEventListener('beforeunload', () => this.saveBeforeUnload());
    }

    updateDate() {
        const now = new Date();
        const options = { 
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        //
        const shortOptions = {
            month: 'short',
            day: 'numeric'
        };
        //
        const dateElement = document.getElementById('current-date');
        if (dateElement){
            if(window.innerWidth<=480){
                dateElement.textContent=now.toLocaleDateString('en-US',shortOptions);
            }else{
                dateElement.textContent=now.toLocaleDateString('en-US',options);
            }
        }
        //
        setTimeout(()=>this.updateDate(),60000);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        const icon = document.querySelector('#theme-toggle .material-icons-round');
        icon.textContent = this.currentTheme === 'dark' ? 'dark_mode' : 'light_mode';
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme();
        window.ui.showToast('Theme updated', 'success');
    }

    toggleSideNav() {
        const sideNav = document.getElementById('side-nav');
        const overlay = document.querySelector('.nav-overlay');
        
        if (sideNav.classList.contains('active')) {
            // Close sidebar
            sideNav.classList.remove('active');
            if (overlay) overlay.remove();
        } else {
            // Open sidebar
            sideNav.classList.add('active');
            this.createOverlay();
        }
    }
    
    createOverlay() {
        // Remove existing overlay
        this.removeOverlay();
        
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(3px);
            z-index: 150;
            opacity: 0;
            animation: fadeIn 0.3s ease forwards;
        `;
        
        overlay.addEventListener('click', () => this.toggleSideNav());
        document.body.appendChild(overlay);
    }
    
    removeOverlay() {
        const overlay = document.querySelector('.nav-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.remove(), 300);
        }
    }

    async setupRouting() {
        // Handle hash changes
        window.addEventListener('hashchange', () => this.handleHashChange());
        
        // Initial route
        await this.handleHashChange();
    }

    async handleHashChange() {
        const hash = window.location.hash.replace('#', '') || 'dashboard';
        await this.navigateTo(hash);
    }

    async navigateTo(page) {
        // Update active nav items
        document.querySelectorAll('.nav-item, .nav-btn').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-page') === page || 
                item.getAttribute('href') === `#${page}`) {
                item.classList.add('active');
            }
        });
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        
        // Show target page
        const targetPage = document.getElementById(`${page}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = page;
            
            // Load page-specific data
            await this.loadPageData(page);
            
            // Update URL hash
            window.location.hash = page;
            
            // Close side nav on mobile
            if (window.innerWidth <= 768) {
                this.toggleSideNav();
            }
            
            console.log(`📄 Navigated to: ${page}`);
        } else {
            console.warn(`Page not found: ${page}`);
            await this.navigateTo('dashboard');
        }
    }

    async loadPageData(page) {
        switch(page) {
            case 'dashboard':
                await this.loadDashboardData();
                break;
            case 'transactions':
                await this.loadTransactions();
                break;
            case 'enterprises':
                await this.loadEnterprises();
                break;
            case 'calculators':
                await window.calculators.loadCalculators();
                break;
            case 'reports':
                await window.reports.loadReports();
                break;
            case 'settings':
                await this.loadSettings();
                break;
        }
    }

    async loadDashboardData() {
        try {
            window.ui.showLoading();
            
            // Load KPI data
            const kpiData = await window.db.getDashboardData();
            this.updateKPIs(kpiData);
            
            // Load recent transactions
            const recentTransactions = await window.db.getRecentTransactions(5);
            window.ui.updateRecentTransactions(recentTransactions);
            
            // Load charts
            await this.loadCharts();
            
            // Update nav stats
            this.updateNavStats(kpiData);
            
            window.ui.hideLoading();
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
            window.ui.showToast('Failed to load dashboard data', 'error');
            window.ui.hideLoading();
        }
    }

    updateKPIs(data) {
        document.getElementById('total-income').textContent = 
            this.formatCurrency(data.totalIncome);
        document.getElementById('total-expenses').textContent = 
            this.formatCurrency(data.totalExpenses);
        document.getElementById('net-profit').textContent = 
            this.formatCurrency(data.netProfit);
        document.getElementById('current-balance').textContent = 
            this.formatCurrency(data.currentBalance);
    }

    async loadCharts() {
        // Income vs Expenses Chart
        const financialData = await window.db.getFinancialData('month');
        window.ui.createIncomeExpenseChart(financialData);
        
        // Enterprise Performance Chart
        const enterpriseData = await window.db.getEnterprisePerformance();
        window.ui.createEnterpriseChart(enterpriseData);
    }

    async loadTransactions() {
        try {
            window.ui.showLoading();
            const transactions = await window.db.getAllTransactions();
            window.ui.updateTransactionsList(transactions);
            window.ui.hideLoading();
        } catch (error) {
            console.error('Failed to load transactions:', error);
            window.ui.showToast('Failed to load transactions', 'error');
            window.ui.hideLoading();
        }
    }

    async loadEnterprises() {
        try {
            const enterprises = await window.db.getEnterprises();
            window.ui.updateEnterprisesGrid(enterprises);
        } catch (error) {
            console.error('Failed to load enterprises:', error);
            window.ui.showToast('Failed to load enterprises', 'error');
        }
    }

    async loadSettings() {
        // Load user settings
        const settings = await window.db.getSettings();
        window.ui.updateSettingsForm(settings);
    }

    updateNavStats(data) {
        document.getElementById('nav-balance').textContent = 
            this.formatCurrency(data.currentBalance);
        
        const profitMargin = data.totalIncome > 0 ? 
            ((data.netProfit / data.totalIncome) * 100).toFixed(1) : '0.0';
        document.getElementById('nav-profit').textContent = `${profitMargin}%`;
    }

    showTransactionForm() {
        const form = document.getElementById('transaction-form');
        form.style.display = 'block';
        
        // Set today's date as default
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
        
        // Reset form
        document.getElementById('transaction-form-element').reset();
        
        // Scroll to form
        form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    hideTransactionForm() {
        const form = document.getElementById('transaction-form');
        form.style.display = 'none';
    }

    updateTransactionType(type) {
        document.querySelectorAll('.type-option').forEach(option => {
            option.classList.toggle('active', option.getAttribute('data-type') === type);
        });
        document.getElementById('transaction-type').value = type;
        
        // Update categories based on type
        this.updateCategories(type);
    }

    updateCategories(type) {
        const categorySelect = document.getElementById('category');
        categorySelect.innerHTML = '<option value="">Select Category</option>';
        
        const categories = type === 'income' ? [
            { value: 'crop_sales', label: 'Crop Sales' },
            { value: 'livestock_sales', label: 'Livestock Sales' },
            { value: 'dairy_sales', label: 'Dairy Sales' },
            { value: 'poultry_sales', label: 'Poultry Sales' },
            { value: 'subsidy', label: 'Government Subsidy' },
            { value: 'other_income', label: 'Other Income' }
        ] : [
            { value: 'feed', label: 'Animal Feed' },
            { value: 'seeds', label: 'Seeds & Seedlings' },
            { value: 'fertilizer', label: 'Fertilizer' },
            { value: 'pesticides', label: 'Pesticides' },
            { value: 'veterinary', label: 'Veterinary Services' },
            { value: 'labor', label: 'Labor Costs' },
            { value: 'equipment', label: 'Equipment & Tools' },
            { value: 'fuel', label: 'Fuel & Transport' },
            { value: 'utilities', label: 'Utilities' },
            { value: 'maintenance', label: 'Maintenance' },
            { value: 'other_expense', label: 'Other Expenses' }
        ];
        
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.value;
            option.textContent = cat.label;
            categorySelect.appendChild(option);
        });
    }

    async handleTransactionSubmit(event) {
        event.preventDefault();
        
        try {
            window.ui.showLoading();
            
            const formData = new FormData(event.target);
            const transaction = {
                id: Date.now().toString(),
                type: formData.get('type'),
                amount: parseFloat(formData.get('amount')),
                enterprise: formData.get('enterprise'),
                category: formData.get('category'),
                description: formData.get('description'),
                date: formData.get('date'),
                payment_method: formData.get('payment_method'),
                notes: formData.get('notes'),
                recurring: formData.get('recurring') === 'on',
                synced: this.isOnline,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            
            // Validate transaction
            if (!this.validateTransaction(transaction)) {
                window.ui.hideLoading();
                return;
            }
            
            // Save transaction
            await window.db.saveTransaction(transaction);
            
            // Hide form
            this.hideTransactionForm();
            
            // Refresh data
            await this.refreshDataAfterTransaction();
            
            // Show success message
            window.ui.showToast('Transaction saved successfully!', 'success');
            
            // Sync if online
            if (this.isOnline) {
                await window.sync.syncTransaction(transaction);
            }
            
            window.ui.hideLoading();
        } catch (error) {
            console.error('Failed to save transaction:', error);
            window.ui.showToast('Failed to save transaction', 'error');
            window.ui.hideLoading();
        }
    }

    validateTransaction(transaction) {
        if (!transaction.amount || transaction.amount <= 0) {
            window.ui.showToast('Please enter a valid amount', 'error');
            return false;
        }
        
        if (!transaction.description || transaction.description.trim() === '') {
            window.ui.showToast('Please enter a description', 'error');
            return false;
        }
        
        if (!transaction.enterprise) {
            window.ui.showToast('Please select an enterprise', 'error');
            return false;
        }
        
        if (!transaction.category) {
            window.ui.showToast('Please select a category', 'error');
            return false;
        }
        
        return true;
    }

    async refreshDataAfterTransaction() {
        // Refresh current page data
        await this.loadPageData(this.currentPage);
        
        // Update dashboard if on different page
        if (this.currentPage !== 'dashboard') {
            const dashboardData = await window.db.getDashboardData();
            this.updateKPIs(dashboardData);
            this.updateNavStats(dashboardData);
        }
        
        // Update transaction badge
        const pendingCount = await window.db.getPendingSyncCount();
        document.getElementById('transaction-badge').textContent = 
            pendingCount > 0 ? pendingCount : '';
    }

    async refreshDashboard() {
        const refreshBtn = document.getElementById('refresh-dashboard');
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '<span class="material-icons-round">refresh</span>';
        
        await this.loadDashboardData();
        
        setTimeout(() => {
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = '<span class="material-icons-round">refresh</span>';
            window.ui.showToast('Dashboard refreshed', 'success');
        }, 1000);
    }

// Update handleQuickAction method:
    handleQuickAction(action) {
        console.log(`🔘 Quick action: ${action}`);
        
        switch(action) {
            case 'poultry':
            case 'dairy':
            case 'crops':
            case 'livestock':
                this.navigateTo('calculators').then(() => {
                    setTimeout(() => {
                        if (window.calculators) {
                            window.calculators.showCalculator(action);
                        } else {
                            console.error('Calculators module not loaded');
                            window.ui.showToast('Calculators not available', 'error');
                        }
                    }, 300);
                });
                break;
                
            case 'add-expense':
                this.navigateTo('transactions');
                setTimeout(() => {
                    this.showTransactionForm();
                    this.updateTransactionType('expense');
                }, 300);
                break;
                
            case 'add-income':
                this.navigateTo('transactions');
                setTimeout(() => {
                    this.showTransactionForm();
                    this.updateTransactionType('income');
                }, 300);
                break;
                
            default:
                console.warn(`Unknown action: ${action}`);
        }
    }

    handleOnlineStatus() {
        this.isOnline = true;
        this.updateSyncStatus('online');
        
        // Sync pending transactions
        window.sync.syncPendingTransactions();
        
        window.ui.showToast('You are back online. Syncing data...', 'info');
    }

    handleOfflineStatus() {
        this.isOnline = false;
        this.updateSyncStatus('offline');
        
        window.ui.showToast('You are offline. Data will sync when connection is restored.', 'warning');
    }

    updateSyncStatus(status) {
        const syncStatus = document.getElementById('sync-status');
        const icon = syncStatus.querySelector('.sync-icon');
        const text = syncStatus.querySelector('.sync-text');
        
        switch(status) {
            case 'online':
                icon.textContent = 'cloud_done';
                text.textContent = 'Synced';
                syncStatus.style.background = 'rgba(76, 175, 80, 0.1)';
                syncStatus.style.color = 'var(--success)';
                break;
            case 'offline':
                icon.textContent = 'cloud_off';
                text.textContent = 'Offline';
                syncStatus.style.background = 'rgba(158, 158, 158, 0.1)';
                syncStatus.style.color = 'var(--gray-500)';
                break;
            case 'syncing':
                icon.textContent = 'sync';
                text.textContent = 'Syncing...';
                syncStatus.style.background = 'rgba(33, 150, 243, 0.1)';
                syncStatus.style.color = 'var(--info)';
                break;
        }
    }

    checkSyncStatus() {
        if (this.isOnline) {
            this.updateSyncStatus('online');
        } else {
            this.updateSyncStatus('offline');
        }
    }

    async handleLogout() {
        const confirmLogout = confirm('Are you sure you want to logout? All unsynced data will be saved locally.');
        if (confirmLogout) {
            window.ui.showLoading();
            
            // Save any pending data
            await this.saveBeforeUnload();
            
            // Clear sensitive data from memory
            // Note: We don't clear IndexedDB as it's needed for next login
            
            // Redirect to login (in a real app)
            setTimeout(() => {
                window.ui.showToast('Logged out successfully', 'success');
                window.ui.hideLoading();
                
                // For demo purposes, just refresh
                location.reload();
            }, 1000);
        }
    }

    async saveBeforeUnload() {
        try {
            // Save any pending operations
            await window.db.commitPendingOperations();
            
            // Update last sync timestamp
            localStorage.setItem('last_sync', new Date().toISOString());
        } catch (error) {
            console.error('Error saving before unload:', error);
        }
    }

    async loadInitialData() {
        // Load user profile
        const profile = await window.db.getUserProfile();
        if (profile) {
            document.getElementById('user-name').textContent = profile.name || 'Farmer';
            document.getElementById('farm-name').textContent = profile.farmName || 'My Farm';
        }
        
        // Load initial dashboard
        await this.loadDashboardData();
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/FarmFlow/service-worker.js')
                .then(registration => {
                    console.log('✅ Service Worker registered:', registration);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        console.log('🔄 Service Worker update found');
                        
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                window.ui.showToast('New version available! Refresh to update.', 'info');
                            }
                        });
                    });
                })
                .catch(error => {
                    console.error('❌ Service Worker registration failed:', error);
                });
        }
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }

    showError(message) {
        window.ui.showToast(message, 'error');
        
        // Create error modal
        const errorModal = document.createElement('div');
        errorModal.className = 'error-modal';
        errorModal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-lg);
            padding: var(--spacing-xl);
            z-index: 1000;
            text-align: center;
            max-width: 400px;
            width: 90%;
        `;
        
        errorModal.innerHTML = `
            <span class="material-icons-round" style="font-size: 3rem; color: var(--error); margin-bottom: var(--spacing-md);">
                error
            </span>
            <h3 style="margin-bottom: var(--spacing-md); color: var(--error);">Error</h3>
            <p style="margin-bottom: var(--spacing-lg);">${message}</p>
            <button class="btn btn-primary" onclick="this.closest('.error-modal').remove(); location.reload();">
                Refresh Application
            </button>
        `;
        
        document.body.appendChild(errorModal);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.farmFlow = new FarmFlowApp();
});

// Debug helper
window.debugFarmFlow = {
    showState: () => {
        console.log('🏗️ FarmFlow Debug State:');
        console.log('Current Page:', window.farmFlow?.currentPage);
        console.log('Database:', window.db?.db ? 'Loaded' : 'Not loaded');
        console.log('UI:', window.ui ? 'Loaded' : 'Not loaded');
        console.log('Calculators:', window.calculators ? 'Loaded' : 'Not loaded');
        console.log('Sync:', window.sync ? 'Loaded' : 'Not loaded');
        
        // Check if elements exist
        const elements = ['side-nav', 'current-date', 'transactions-container', 'calculator-display'];
        elements.forEach(id => {
            const el = document.getElementById(id);
            console.log(`Element #${id}:`, el ? 'Found' : 'Not found');
        });
    },
    
    fixSidebar: () => {
        const sideNav = document.getElementById('side-nav');
        if (sideNav) {
            sideNav.style.left = '0';
            console.log('✅ Sidebar fixed');
        }
    },
    
    testCalculators: () => {
        if (window.calculators) {
            window.calculators.showCalculator('poultry');
            console.log('✅ Testing poultry calculator');
        }
    }
};

// Add keyboard shortcuts for debugging
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        window.debugFarmFlow.showState();
    }
});
