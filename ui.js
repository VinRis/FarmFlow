// FarmFlow UI Management
class FarmFlowUI {
    constructor() {
        this.charts = {};
        this.toastTimeout = 5000;
        this.animationsEnabled = true;
    }

    initialize() {
        this.setupEventListeners();
        this.setupChartDefaults();
        this.updateUIForTheme();
        console.log('🎨 UI Manager initialized');
    }

    setupEventListeners() {
        // Filter controls
        const transactionFilter = document.getElementById('transaction-filter');
        const enterpriseFilter = document.getElementById('enterprise-filter');
        
        if (transactionFilter) {
            transactionFilter.addEventListener('change', async (e) => {
                await window.farmFlow?.loadTransactions();
            });
        }
        
        if (enterpriseFilter) {
            enterpriseFilter.addEventListener('change', async (e) => {
                await window.farmFlow?.loadTransactions();
            });
        }
        
        // Form close handlers
        document.querySelectorAll('.close-form').forEach(btn => {
            btn.addEventListener('click', () => {
                const form = document.getElementById('transaction-form');
                if (form) form.style.display = 'none';
            });
        });
    }

    setupChartDefaults() {
        // Chart.js defaults
        Chart.defaults.font.family = 'Poppins, sans-serif';
        Chart.defaults.color = getComputedStyle(document.documentElement)
            .getPropertyValue('--gray-600');
        Chart.defaults.plugins.tooltip.backgroundColor = 
            getComputedStyle(document.documentElement)
            .getPropertyValue('--glass-bg');
        Chart.defaults.plugins.tooltip.titleColor = 
            getComputedStyle(document.documentElement)
            .getPropertyValue('--gray-900');
        Chart.defaults.plugins.tooltip.bodyColor = 
            getComputedStyle(document.documentElement)
            .getPropertyValue('--gray-700');
        Chart.defaults.plugins.tooltip.borderColor = 
            getComputedStyle(document.documentElement)
            .getPropertyValue('--glass-border');
        Chart.defaults.plugins.tooltip.borderWidth = 1;
        Chart.defaults.plugins.tooltip.cornerRadius = 8;
        Chart.defaults.plugins.tooltip.padding = 12;
        Chart.defaults.plugins.tooltip.usePointStyle = true;
    }

    updateUIForTheme() {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        const isDark = theme === 'dark';
        
        // Update chart colors if charts exist
        Object.values(this.charts).forEach(chart => {
            if (chart) {
                chart.options.scales.x.grid.color = isDark ? 
                    'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
                chart.options.scales.y.grid.color = isDark ? 
                    'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
                chart.update();
            }
        });
    }

    // Chart Methods
    createIncomeExpenseChart(data) {
        const ctx = document.getElementById('income-expense-chart');
        if (!ctx) return;
        
        // Destroy existing chart
        if (this.charts.incomeExpense) {
            this.charts.incomeExpense.destroy();
        }
        
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        const isDark = theme === 'dark';
        
        this.charts.incomeExpense = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.dates,
                datasets: [
                    {
                        label: 'Income',
                        data: data.incomeData,
                        backgroundColor: 'rgba(76, 175, 80, 0.7)',
                        borderColor: 'rgba(76, 175, 80, 1)',
                        borderWidth: 1,
                        borderRadius: 6,
                        borderSkipped: false,
                    },
                    {
                        label: 'Expenses',
                        data: data.expenseData,
                        backgroundColor: 'rgba(244, 67, 54, 0.7)',
                        borderColor: 'rgba(244, 67, 54, 1)',
                        borderWidth: 1,
                        borderRadius: 6,
                        borderSkipped: false,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: isDark ? '#ADADAD' : '#616161',
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: isDark ? '#8D8D8D' : '#757575',
                            maxRotation: 45
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: isDark ? '#8D8D8D' : '#757575',
                            callback: function(value) {
                                return '$' + value;
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                animations: {
                    tension: {
                        duration: 1000,
                        easing: 'linear'
                    }
                }
            }
        });
    }

    createEnterpriseChart(data) {
        const ctx = document.getElementById('enterprise-chart');
        if (!ctx) return;
        
        // Destroy existing chart
        if (this.charts.enterprise) {
            this.charts.enterprise.destroy();
        }
        
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        const isDark = theme === 'dark';
        
        const enterpriseColors = {
            poultry: 'rgba(255, 152, 0, 0.7)',
            dairy: 'rgba(41, 182, 246, 0.7)',
            crops: 'rgba(102, 187, 106, 0.7)',
            livestock: 'rgba(142, 36, 170, 0.7)',
            general: 'rgba(158, 158, 158, 0.7)'
        };
        
        const enterpriseBorderColors = {
            poultry: 'rgba(255, 152, 0, 1)',
            dairy: 'rgba(41, 182, 246, 1)',
            crops: 'rgba(102, 187, 106, 1)',
            livestock: 'rgba(142, 36, 170, 1)',
            general: 'rgba(158, 158, 158, 1)'
        };
        
        const labels = data.map(e => e.name);
        const profits = data.map(e => e.profit);
        const colors = data.map(e => enterpriseColors[e.type] || enterpriseColors.general);
        const borderColors = data.map(e => enterpriseBorderColors[e.type] || enterpriseBorderColors.general);
        
        this.charts.enterprise = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: profits,
                    backgroundColor: colors,
                    borderColor: borderColors,
                    borderWidth: 2,
                    borderRadius: 6,
                    hoverOffset: 15
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: isDark ? '#ADADAD' : '#616161',
                            padding: 20,
                            usePointStyle: true,
                            pointStyle: 'circle',
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: $${value.toFixed(2)} (${percentage}%)`;
                            }
                        }
                    }
                },
                animations: {
                    animateRotate: true,
                    animateScale: true
                }
            }
        });
    }

    // Transaction List Methods
    updateTransactionsList(transactions) {
        const container = document.getElementById('transactions-container');
        if (!container) return;
        
        if (transactions.length === 0) {
            container.innerHTML = `
                <div class="empty-state glass-card">
                    <span class="material-icons-round">receipt_long</span>
                    <h3>No Transactions Found</h3>
                    <p>Start by adding your first transaction</p>
                    <button class="btn btn-primary" onclick="window.farmFlow.showTransactionForm()">
                        Add Transaction
                    </button>
                </div>
            `;
            return;
        }
        
        const html = transactions.map(transaction => this.createTransactionCard(transaction)).join('');
        container.innerHTML = html;
        
        // Add click handlers
        container.querySelectorAll('.transaction-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.transaction-actions')) {
                    this.showTransactionDetails(transaction);
                }
            });
        });
    }

    createTransactionCard(transaction) {
        const date = new Date(transaction.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        const isIncome = transaction.type === 'income';
        const amountClass = isIncome ? 'amount income' : 'amount expense';
        const amountPrefix = isIncome ? '+' : '-';
        const icon = isIncome ? 'south_west' : 'north_east';
        
        const enterpriseIcons = {
            poultry: 'pets',
            dairy: 'water_drop',
            crops: 'spa',
            livestock: 'agriculture',
            general: 'business'
        };
        
        return `
            <div class="transaction-card glass-card" data-id="${transaction.id}">
                <div class="transaction-header">
                    <div class="transaction-type ${transaction.type}">
                        <span class="material-icons-round">${icon}</span>
                        <span>${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</span>
                    </div>
                    <div class="transaction-date">
                        <span class="material-icons-round">calendar_today</span>
                        <span>${formattedDate}</span>
                    </div>
                </div>
                
                <div class="transaction-content">
                    <div class="transaction-main">
                        <div class="transaction-enterprise">
                            <span class="material-icons-round">${enterpriseIcons[transaction.enterprise] || 'business'}</span>
                            <span>${this.formatEnterprise(transaction.enterprise)}</span>
                        </div>
                        <h4 class="transaction-description">${transaction.description}</h4>
                        <div class="transaction-category">
                            <span class="material-icons-round">label</span>
                            <span>${this.formatCategory(transaction.category)}</span>
                        </div>
                    </div>
                    
                    <div class="transaction-amount">
                        <span class="${amountClass}">
                            ${amountPrefix}$${Math.abs(transaction.amount).toFixed(2)}
                        </span>
                    </div>
                </div>
                
                <div class="transaction-footer">
                    <div class="transaction-payment">
                        <span class="material-icons-round">payment</span>
                        <span>${this.formatPaymentMethod(transaction.payment_method)}</span>
                    </div>
                    <div class="transaction-actions">
                        <button class="btn-icon" onclick="this.closest('.transaction-card').classList.toggle('expanded')">
                            <span class="material-icons-round">expand_more</span>
                        </button>
                        <button class="btn-icon" onclick="window.ui.editTransaction('${transaction.id}')">
                            <span class="material-icons-round">edit</span>
                        </button>
                        <button class="btn-icon" onclick="window.ui.deleteTransaction('${transaction.id}')">
                            <span class="material-icons-round">delete</span>
                        </button>
                    </div>
                </div>
                
                <div class="transaction-details">
                    ${transaction.notes ? `
                        <div class="transaction-notes">
                            <span class="material-icons-round">notes</span>
                            <p>${transaction.notes}</p>
                        </div>
                    ` : ''}
                    
                    <div class="transaction-meta">
                        <span>Created: ${new Date(transaction.created_at).toLocaleDateString()}</span>
                        <span>${transaction.synced ? '✓ Synced' : '⚠ Pending Sync'}</span>
                    </div>
                </div>
            </div>
        `;
    }

    updateRecentTransactions(transactions) {
        const container = document.getElementById('recent-transactions');
        if (!container) return;
        
        if (transactions.length === 0) {
            return;
        }
        
        const html = transactions.slice(0, 5).map(transaction => `
            <div class="recent-transaction">
                <div class="recent-transaction-icon ${transaction.type}">
                    <span class="material-icons-round">
                        ${transaction.type === 'income' ? 'south_west' : 'north_east'}
                    </span>
                </div>
                <div class="recent-transaction-info">
                    <h4>${transaction.description}</h4>
                    <p>${this.formatEnterprise(transaction.enterprise)} • ${this.formatCategory(transaction.category)}</p>
                </div>
                <div class="recent-transaction-amount ${transaction.type}">
                    ${transaction.type === 'income' ? '+' : '-'}$${Math.abs(transaction.amount).toFixed(2)}
                </div>
            </div>
        `).join('');
        
        container.innerHTML = html;
    }

    // Enterprise Grid Methods
    updateEnterprisesGrid(enterprises) {
        const container = document.querySelector('.enterprises-grid');
        if (!container) return;
        
        if (enterprises.length === 0) {
            container.innerHTML = `
                <div class="empty-state glass-card">
                    <span class="material-icons-round">business</span>
                    <h3>No Enterprises Yet</h3>
                    <p>Start by adding your first farm enterprise</p>
                    <button class="btn btn-primary" id="add-first-enterprise">
                        Add Enterprise
                    </button>
                </div>
            `;
            
            document.getElementById('add-first-enterprise')?.addEventListener('click', () => {
                // Show enterprise form
            });
            return;
        }
        
        const html = enterprises.map(enterprise => this.createEnterpriseCard(enterprise)).join('');
        container.innerHTML = html;
    }

    createEnterpriseCard(enterprise) {
        const enterpriseTypes = {
            poultry: { icon: 'pets', color: '#FF9800' },
            dairy: { icon: 'water_drop', color: '#29B6F6' },
            crops: { icon: 'spa', color: '#66BB6A' },
            livestock: { icon: 'agriculture', color: '#8E24AA' }
        };
        
        const typeInfo = enterpriseTypes[enterprise.type] || { icon: 'business', color: '#9E9E9E' };
        
        return `
            <div class="enterprise-card glass-card ${enterprise.type}">
                <div class="enterprise-icon">
                    <span class="material-icons-round">${typeInfo.icon}</span>
                </div>
                <h3>${enterprise.name}</h3>
                <p class="enterprise-description">${enterprise.description}</p>
                
                <div class="enterprise-stats">
                    <div class="stat-item">
                        <div class="stat-value">$1,250</div>
                        <div class="stat-label">Income</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">$850</div>
                        <div class="stat-label">Expenses</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">47%</div>
                        <div class="stat-label">ROI</div>
                    </div>
                </div>
                
                <div class="enterprise-actions">
                    <button class="btn btn-outline" onclick="window.ui.viewEnterpriseDetails('${enterprise.id}')">
                        <span class="material-icons-round">visibility</span>
                        View
                    </button>
                    <button class="btn btn-primary" onclick="window.ui.editEnterprise('${enterprise.id}')">
                        <span class="material-icons-round">edit</span>
                        Edit
                    </button>
                </div>
            </div>
        `;
    }

    // Toast Notification Methods
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        
        const toastId = 'toast-' + Date.now();
        const icons = {
            success: 'check_circle',
            error: 'error',
            warning: 'warning',
            info: 'info'
        };
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.id = toastId;
        
        toast.innerHTML = `
            <span class="material-icons-round toast-icon">${icons[type]}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close" onclick="this.closest('.toast').remove()">
                <span class="material-icons-round">close</span>
            </button>
        `;
        
        container.appendChild(toast);
        
        // Auto remove after timeout
        setTimeout(() => {
            const toastElement = document.getElementById(toastId);
            if (toastElement) {
                toastElement.style.opacity = '0';
                toastElement.style.transform = 'translateX(100%)';
                setTimeout(() => toastElement.remove(), 300);
            }
        }, this.toastTimeout);
    }

    // Loading Overlay Methods
    showLoading(message = 'Processing...') {
        const overlay = document.getElementById('loading-overlay');
        const text = overlay.querySelector('.loading-text');
        
        if (text) {
            text.textContent = message;
        }
        
        overlay.classList.add('active');
    }

    hideLoading() {
        const overlay = document.getElementById('loading-overlay');
        overlay.classList.remove('active');
    }

    // Form Methods
    updateSettingsForm(settings) {
        const container = document.querySelector('.settings-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="settings-section glass-card">
                <h3>General Settings</h3>
                <div class="settings-group">
                    <label>
                        <span class="material-icons-round">language</span>
                        Language
                    </label>
                    <select id="language-select">
                        <option value="en" ${settings.language === 'en' ? 'selected' : ''}>English</option>
                        <option value="sw" ${settings.language === 'sw' ? 'selected' : ''}>Swahili</option>
                    </select>
                </div>
                
                <div class="settings-group">
                    <label>
                        <span class="material-icons-round">attach_money</span>
                        Currency
                    </label>
                    <select id="currency-select">
                        <option value="USD" ${settings.currency === 'USD' ? 'selected' : ''}>USD ($)</option>
                        <option value="KES" ${settings.currency === 'KES' ? 'selected' : ''}>Kenyan Shilling (KES)</option>
                        <option value="TZS" ${settings.currency === 'TZS' ? 'selected' : ''}>Tanzanian Shilling (TZS)</option>
                        <option value="UGX" ${settings.currency === 'UGX' ? 'selected' : ''}>Ugandan Shilling (UGX)</option>
                    </select>
                </div>
            </div>
            
            <div class="settings-section glass-card">
                <h3>Sync Settings</h3>
                <div class="settings-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="auto-sync" ${settings.auto_sync === 'true' ? 'checked' : ''}>
                        <span class="checkbox-custom"></span>
                        <span>Enable Auto Sync</span>
                    </label>
                </div>
                
                <div class="settings-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="notifications" ${settings.notifications === 'true' ? 'checked' : ''}>
                        <span class="checkbox-custom"></span>
                        <span>Enable Notifications</span>
                    </label>
                </div>
                
                <button class="btn btn-primary" onclick="window.ui.saveSettings()">
                    <span class="material-icons-round">save</span>
                    Save Settings
                </button>
                
                <button class="btn btn-outline" onclick="window.sync.forceSync()">
                    <span class="material-icons-round">sync</span>
                    Force Sync Now
                </button>
            </div>
            
            <div class="settings-section glass-card">
                <h3>Backup & Restore</h3>
                <div class="settings-group">
                    <button class="btn btn-primary" onclick="window.db.exportData()">
                        <span class="material-icons-round">download</span>
                        Export Data
                    </button>
                    <button class="btn btn-outline" onclick="document.getElementById('import-file').click()">
                        <span class="material-icons-round">upload</span>
                        Import Data
                    </button>
                    <input type="file" id="import-file" accept=".json" style="display: none;" 
                           onchange="window.ui.handleImport(this.files[0])">
                </div>
                
                <div class="settings-group">
                    <button class="btn btn-error" onclick="window.ui.clearAllData()">
                        <span class="material-icons-round">delete_forever</span>
                        Clear All Data
                    </button>
                </div>
            </div>
        `;
        
        // Add event listeners
        document.getElementById('auto-sync')?.addEventListener('change', (e) => {
            window.sync.toggleAutoSync(e.target.checked);
        });
    }

    async saveSettings() {
        const language = document.getElementById('language-select').value;
        const currency = document.getElementById('currency-select').value;
        const autoSync = document.getElementById('auto-sync').checked;
        const notifications = document.getElementById('notifications').checked;
        
        try {
            await window.db.saveSetting('language', language);
            await window.db.saveSetting('currency', currency);
            await window.db.saveSetting('auto_sync', autoSync.toString());
            await window.db.saveSetting('notifications', notifications.toString());
            
            this.showToast('Settings saved successfully', 'success');
        } catch (error) {
            console.error('Failed to save settings:', error);
            this.showToast('Failed to save settings', 'error');
        }
    }

    async handleImport(file) {
        if (!file) return;
        
        const confirmImport = confirm(
            'Importing data will replace all existing data. Are you sure?'
        );
        
        if (!confirmImport) return;
        
        try {
            this.showLoading('Importing data...');
            await window.db.importData(file);
            this.showToast('Data imported successfully', 'success');
            
            // Refresh the app
            setTimeout(() => location.reload(), 1000);
        } catch (error) {
            console.error('Import failed:', error);
            this.showToast('Import failed: ' + error.message, 'error');
        } finally {
            this.hideLoading();
        }
    }

    async clearAllData() {
        const confirmClear = confirm(
            'This will delete ALL data including transactions, enterprises, and settings. This action cannot be undone. Are you sure?'
        );
        
        if (!confirmClear) return;
        
        try {
            this.showLoading('Clearing data...');
            await window.db.clearAllData();
            this.showToast('All data cleared', 'success');
            
            // Refresh the app
            setTimeout(() => location.reload(), 1000);
        } catch (error) {
            console.error('Failed to clear data:', error);
            this.showToast('Failed to clear data', 'error');
        } finally {
            this.hideLoading();
        }
    }

    // Helper Methods
    formatEnterprise(enterprise) {
        const enterpriseNames = {
            poultry: 'Poultry',
            dairy: 'Dairy',
            crops: 'Crops',
            livestock: 'Livestock',
            general: 'General Farm'
        };
        return enterpriseNames[enterprise] || enterprise;
    }

    formatCategory(category) {
        // Convert snake_case to Title Case
        return category.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    formatPaymentMethod(method) {
        const methods = {
            cash: 'Cash',
            mobile_money: 'Mobile Money',
            bank_transfer: 'Bank Transfer',
            credit: 'Credit'
        };
        return methods[method] || method;
    }

    // Modal Methods
    showModal(title, content, buttons = []) {
        const modalId = 'modal-' + Date.now();
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = modalId;
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content glass-card';
        modalContent.style.cssText = `
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            animation: slideUp 0.3s ease;
        `;
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="btn-icon close-modal" onclick="document.getElementById('${modalId}').remove()">
                    <span class="material-icons-round">close</span>
                </button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            ${buttons.length > 0 ? `
                <div class="modal-footer">
                    ${buttons.map(btn => `
                        <button class="btn ${btn.type || 'btn-outline'}" 
                                onclick="${btn.onclick}">
                            ${btn.label}
                        </button>
                    `).join('')}
                </div>
            ` : ''}
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Close on escape key
        const closeHandler = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeHandler);
            }
        };
        document.addEventListener('keydown', closeHandler);
        
        return modalId;
    }

    // Animation Methods
    animateElement(element, animation, duration = 300) {
        if (!this.animationsEnabled) return;
        
        element.style.animation = `${animation} ${duration}ms ease`;
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }

    toggleAnimations(enabled) {
        this.animationsEnabled = enabled;
        if (!enabled) {
            document.body.classList.add('no-animations');
        } else {
            document.body.classList.remove('no-animations');
        }
    }
}

// Initialize UI manager
window.ui = new FarmFlowUI();
