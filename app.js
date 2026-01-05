// FarmFlow Main Application
class FarmFlowApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.theme = 'light';
        this.isOnline = navigator.onLine;
        
        this.initializeApp();
    }
    
    async initializeApp() {
        // Initialize event listeners
        this.setupEventListeners();
        
        // Load user settings
        await this.loadUserSettings();
        
        // Load initial data
        await this.loadDashboardData();
        
        // Setup online/offline detection
        this.setupConnectivity();
        
        console.log('FarmFlow initialized');
    }
    
    setupEventListeners() {
        // Menu toggle
        document.getElementById('menuToggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('open');
        });
        
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.navigateTo(page);
                
                // Close sidebar on mobile
                if (window.innerWidth < 768) {
                    document.getElementById('sidebar').classList.remove('open');
                }
            });
        });
        
        // Transaction modal
        const addTransactionBtn = document.getElementById('addTransactionBtn');
        if (addTransactionBtn) {
            addTransactionBtn.addEventListener('click', () => this.showTransactionModal());
        }
        
        const closeModalBtns = document.querySelectorAll('.close-modal');
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', () => this.hideTransactionModal());
        });
        
        // Transaction form submission
        const transactionForm = document.getElementById('transactionForm');
        if (transactionForm) {
            transactionForm.addEventListener('submit', (e) => this.handleTransactionSubmit(e));
        }
        
        // Period selector
        const periodSelect = document.getElementById('periodSelect');
        if (periodSelect) {
            periodSelect.addEventListener('change', () => this.loadDashboardData());
        }
        
        // Listen for data changes
        window.addEventListener('data-changed', (e) => {
            this.handleDataChange(e.detail);
        });
        
        // Add first transaction button
        const addFirstBtn = document.getElementById('addFirstTransaction');
        if (addFirstBtn) {
            addFirstBtn.addEventListener('click', () => this.showTransactionModal());
        }
        
        // View all transactions
        const viewAllBtn = document.getElementById('viewAllTransactions');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => this.navigateTo('transactions'));
        }
    }
    
    async navigateTo(page) {
        // Update navigation active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === page) {
                item.classList.add('active');
            }
        });
        
        // Hide all pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        
        // Show target page
        const targetPage = document.getElementById(`${page}Page`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = page;
            
            // Load page-specific data
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
                case 'reports':
                    await this.loadReports();
                    break;
            }
        }
    }
    
    async loadDashboardData() {
        try {
            // Calculate date range based on period
            const period = document.getElementById('periodSelect')?.value || 'month';
            const { startDate, endDate } = this.getDateRange(period);
            
            // Get financial stats
            const stats = await farmDB.getFinancialStats(startDate, endDate);
            
            // Update UI
            this.updateDashboardStats(stats);
            
            // Load charts
            await this.loadCharts(stats);
            
            // Load recent transactions
            await this.loadRecentTransactions();
            
        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    }
    
    updateDashboardStats(stats) {
        // Format currency
        const formatCurrency = (amount) => {
            return `KES ${amount.toLocaleString('en-KE', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })}`;
        };
        
        // Update stat cards
        document.getElementById('totalIncome').textContent = formatCurrency(stats.totalIncome);
        document.getElementById('totalExpenses').textContent = formatCurrency(stats.totalExpenses);
        document.getElementById('netBalance').textContent = formatCurrency(stats.netBalance);
        
        // Calculate percentage changes (simplified - would need previous period data)
        const incomeChange = document.querySelector('.income .stat-change');
        const expenseChange = document.querySelector('.expenses .stat-change');
        
        if (incomeChange) incomeChange.textContent = '+12% from last period';
        if (expenseChange) expenseChange.textContent = '-5% from last period';
    }
    
    async loadCharts(stats) {
        // Income vs Expense Chart
        const incomeExpenseCtx = document.getElementById('incomeExpenseChart')?.getContext('2d');
        if (incomeExpenseCtx && window.incomeExpenseChart) {
            window.incomeExpenseChart.destroy();
        }
        
        if (incomeExpenseCtx) {
            window.incomeExpenseChart = new Chart(incomeExpenseCtx, {
                type: 'bar',
                data: {
                    labels: ['Income', 'Expenses'],
                    datasets: [{
                        label: 'Amount (KES)',
                        data: [stats.totalIncome, stats.totalExpenses],
                        backgroundColor: [
                            'rgba(56, 161, 105, 0.7)',
                            'rgba(221, 107, 32, 0.7)'
                        ],
                        borderColor: [
                            'rgb(56, 161, 105)',
                            'rgb(221, 107, 32)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return 'KES ' + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Enterprise Performance Chart
        const enterpriseCtx = document.getElementById('enterpriseChart')?.getContext('2d');
        if (enterpriseCtx && window.enterpriseChart) {
            window.enterpriseChart.destroy();
        }
        
        if (enterpriseCtx && Object.keys(stats.byEnterprise).length > 0) {
            const enterprises = await farmDB.getEnterprises();
            const enterpriseMap = {};
            enterprises.forEach(e => enterpriseMap[e.id] = e.name);
            
            const labels = [];
            const incomeData = [];
            const expenseData = [];
            
            Object.entries(stats.byEnterprise).forEach(([id, data]) => {
                labels.push(enterpriseMap[id] || `Enterprise ${id}`);
                incomeData.push(data.income);
                expenseData.push(data.expenses);
            });
            
            window.enterpriseChart = new Chart(enterpriseCtx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Income',
                            data: incomeData,
                            backgroundColor: 'rgba(56, 161, 105, 0.7)',
                            borderColor: 'rgb(56, 161, 105)',
                            borderWidth: 1
                        },
                        {
                            label: 'Expenses',
                            data: expenseData,
                            backgroundColor: 'rgba(221, 107, 32, 0.7)',
                            borderColor: 'rgb(221, 107, 32)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            stacked: false,
                        },
                        y: {
                            stacked: false,
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return 'KES ' + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    
    async loadRecentTransactions() {
        const transactions = await farmDB.getRecentTransactions(5);
        const container = document.getElementById('recentTransactions');
        
        if (!container) return;
        
        if (transactions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="material-icons">receipt</span>
                    <p>No transactions yet</p>
                    <button class="btn-primary" id="addFirstTransaction">Add First Transaction</button>
                </div>
            `;
            return;
        }
        
        let html = '';
        transactions.forEach(tx => {
            const date = new Date(tx.date).toLocaleDateString();
            const amountClass = tx.type === 'income' ? 'income' : 'expense';
            const amountPrefix = tx.type === 'income' ? '+' : '-';
            
            html += `
                <div class="transaction-item">
                    <div class="transaction-info">
                        <h4>${tx.description}</h4>
                        <p>${date} • ${tx.category || 'Uncategorized'}</p>
                    </div>
                    <div class="transaction-amount ${amountClass}">
                        ${amountPrefix} KES ${parseFloat(tx.amount).toLocaleString()}
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    async loadTransactions() {
        try {
            // Get filter values
            const search = document.getElementById('searchTransactions')?.value || '';
            const enterpriseId = document.getElementById('filterEnterprise')?.value || '';
            const type = document.getElementById('filterType')?.value || '';
            const dateFrom = document.getElementById('filterDateFrom')?.value;
            const dateTo = document.getElementById('filterDateTo')?.value;
            
            const filters = {
                search,
                enterpriseId: enterpriseId ? parseInt(enterpriseId) : null,
                type: type || null,
                startDate: dateFrom,
                endDate: dateTo
            };
            
            const transactions = await farmDB.getTransactions(filters);
            this.renderTransactionsTable(transactions);
            
            // Load enterprise filter options
            await this.loadEnterpriseFilter();
            
        } catch (error) {
            console.error('Error loading transactions:', error);
        }
    }
    
    renderTransactionsTable(transactions) {
        const tbody = document.getElementById('transactionsTable');
        if (!tbody) return;
        
        if (transactions.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <span class="material-icons">receipt</span>
                        <p>No transactions found</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        let html = '';
        const enterprises = {}; // We should cache this
        
        transactions.forEach(tx => {
            const date = new Date(tx.date).toLocaleDateString();
            const amountClass = tx.type === 'income' ? 'income' : 'expense';
            const amountPrefix = tx.type === 'income' ? '+' : '-';
            
            html += `
                <tr>
                    <td>${date}</td>
                    <td>${tx.description}</td>
                    <td>${tx.enterpriseId || 'General'}</td>
                    <td><span class="badge ${tx.type}">${tx.type}</span></td>
                    <td class="${amountClass}">${amountPrefix} KES ${parseFloat(tx.amount).toLocaleString()}</td>
                    <td>
                        <button class="icon-btn" onclick="app.editTransaction(${tx.id})">
                            <span class="material-icons">edit</span>
                        </button>
                        <button class="icon-btn" onclick="app.deleteTransaction(${tx.id})">
                            <span class="material-icons">delete</span>
                        </button>
                    </td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
    }
    
    async loadEnterpriseFilter() {
        const select = document.getElementById('filterEnterprise');
        if (!select) return;
        
        const enterprises = await farmDB.getEnterprises();
        
        let html = '<option value="">All Enterprises</option>';
        enterprises.forEach(ent => {
            html += `<option value="${ent.id}">${ent.name}</option>`;
        });
        
        select.innerHTML = html;
    }
    
    async showTransactionModal() {
        const modal = document.getElementById('transactionModal');
        const form = document.getElementById('transactionForm');
        
        // Reset form
        if (form) form.reset();
        
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        const dateInput = document.getElementById('transDate');
        if (dateInput) dateInput.value = today;
        
        // Load enterprise options
        await this.loadTransactionEnterpriseOptions();
        
        // Load categories based on default type
        await this.loadTransactionCategories('income');
        
        // Show modal
        modal.classList.add('active');
        
        // Add listener for type change
        const typeSelect = document.getElementById('transType');
        if (typeSelect) {
            typeSelect.addEventListener('change', (e) => {
                this.loadTransactionCategories(e.target.value);
            });
        }
    }
    
    hideTransactionModal() {
        const modal = document.getElementById('transactionModal');
        modal.classList.remove('active');
    }
    
    async loadTransactionEnterpriseOptions() {
        const select = document.getElementById('transEnterprise');
        if (!select) return;
        
        const enterprises = await farmDB.getEnterprises();
        
        let html = '';
        enterprises.forEach(ent => {
            html += `<option value="${ent.id}">${ent.name}</option>`;
        });
        
        select.innerHTML = html;
    }
    
    async loadTransactionCategories(type) {
        const select = document.getElementById('transCategory');
        if (!select) return;
        
        const categories = await farmDB.getCategories(type);
        
        let html = '';
        categories.forEach(cat => {
            html += `<option value="${cat.id}">${cat.name}</option>`;
        });
        
        // Add default option if no categories
        if (categories.length === 0) {
            html = `<option value="">General ${type}</option>`;
        }
        
        select.innerHTML = html;
    }
    
    async handleTransactionSubmit(e) {
        e.preventDefault();
        
        try {
            const formData = {
                date: document.getElementById('transDate').value,
                description: document.getElementById('transDescription').value,
                type: document.getElementById('transType').value,
                amount: document.getElementById('transAmount').value,
                enterpriseId: parseInt(document.getElementById('transEnterprise').value),
                category: document.getElementById('transCategory').value,
                notes: document.getElementById('transNotes').value
            };
            
            await farmDB.addTransaction(formData);
            
            // Show success message
            this.showNotification('Transaction added successfully!', 'success');
            
            // Hide modal
            this.hideTransactionModal();
            
            // Reload data if on relevant page
            if (this.currentPage === 'dashboard' || this.currentPage === 'transactions') {
                await this.loadDashboardData();
                if (this.currentPage === 'transactions') {
                    await this.loadTransactions();
                }
            }
            
        } catch (error) {
            console.error('Error saving transaction:', error);
            this.showNotification('Failed to save transaction', 'error');
        }
    }
    
    async editTransaction(id) {
        // Implementation for editing transaction
        console.log('Edit transaction:', id);
    }
    
    async deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            try {
                await farmDB.deleteTransaction(id);
                this.showNotification('Transaction deleted', 'success');
                
                // Reload data
                if (this.currentPage === 'dashboard' || this.currentPage === 'transactions') {
                    await this.loadDashboardData();
                    if (this.currentPage === 'transactions') {
                        await this.loadTransactions();
                    }
                }
                
            } catch (error) {
                console.error('Error deleting transaction:', error);
                this.showNotification('Failed to delete transaction', 'error');
            }
        }
    }
    
    async loadEnterprises() {
        const container = document.getElementById('enterprisesGrid');
        if (!container) return;
        
        const enterprises = await farmDB.getEnterprises();
        
        if (enterprises.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="material-icons">business</span>
                    <p>No enterprises yet</p>
                    <button class="btn-primary" id="addEnterpriseBtn">Add First Enterprise</button>
                </div>
            `;
            return;
        }
        
        let html = '';
        enterprises.forEach(ent => {
            // Get enterprise stats
            // This would need additional database queries
            
            html += `
                <div class="enterprise-card">
                    <div class="enterprise-header">
                        <span class="material-icons">store</span>
                        <h3>${ent.name}</h3>
                    </div>
                    <div class="enterprise-body">
                        <p>${ent.description || 'No description'}</p>
                        <div class="enterprise-stats">
                            <div class="stat">
                                <span class="label">Type:</span>
                                <span class="value">${ent.type}</span>
                            </div>
                            <div class="stat">
                                <span class="label">Active:</span>
                                <span class="value">${ent.isActive ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                    </div>
                    <div class="enterprise-actions">
                        <button class="btn-secondary">View Details</button>
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    async loadReports() {
        // Reports will be implemented in reports.js
        console.log('Loading reports...');
    }
    
    getDateRange(period) {
        const endDate = new Date();
        let startDate = new Date();
        
        switch(period) {
            case 'week':
                startDate.setDate(endDate.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(endDate.getMonth() - 1);
                break;
            case 'quarter':
                startDate.setMonth(endDate.getMonth() - 3);
                break;
            case 'year':
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
        }
        
        return {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        };
    }
    
    async loadUserSettings() {
        try {
            const user = await farmDB.getUserSettings();
            
            // Update UI
            const userName = document.getElementById('userName');
            const farmName = document.getElementById('farmName');
            
            if (userName && user.name) userName.textContent = user.name;
            if (farmName && user.farmName) farmName.textContent = user.farmName;
            
        } catch (error) {
            console.error('Error loading user settings:', error);
        }
    }
    
    toggleTheme() {
        const body = document.body;
        const themeIcon = document.querySelector('#themeToggle .material-icons');
        
        if (this.theme === 'light') {
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
            themeIcon.textContent = 'dark_mode';
            this.theme = 'dark';
        } else {
            body.classList.add('light-theme');
            body.classList.remove('dark-theme');
            themeIcon.textContent = 'light_mode';
            this.theme = 'light';
        }
        
        // Save preference
        farmDB.updateUserSettings({ theme: this.theme });
    }
    
    setupConnectivity() {
        const updateOnlineStatus = () => {
            this.isOnline = navigator.onLine;
            const syncIcon = document.querySelector('#syncStatus .material-icons');
            
            if (this.isOnline) {
                syncIcon.textContent = 'cloud';
                syncIcon.style.color = '';
                this.showNotification('You are back online', 'success');
            } else {
                syncIcon.textContent = 'cloud_off';
                syncIcon.style.color = 'var(--danger-color)';
                this.showNotification('You are offline. Changes will sync when back online.', 'warning');
            }
        };
        
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        
        updateOnlineStatus();
    }
    
    handleDataChange(detail) {
        // Update relevant page based on what changed
        switch(detail.table) {
            case 'transactions':
                if (this.currentPage === 'dashboard') {
                    this.loadDashboardData();
                } else if (this.currentPage === 'transactions') {
                    this.loadTransactions();
                }
                break;
            case 'enterprises':
                if (this.currentPage === 'enterprises') {
                    this.loadEnterprises();
                }
                break;
        }
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span class="material-icons">${type === 'success' ? 'check_circle' : 'info'}</span>
            <span>${message}</span>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FarmFlowApp();
});
