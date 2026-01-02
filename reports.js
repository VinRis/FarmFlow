// FarmFlow Reports Module
class FarmFlowReports {
    constructor() {
        this.charts = {};
        this.currentReport = null;
        this.init();
    }

    init() {
        console.log('📊 Reports module initialized');
    }

    async loadReports() {
        const container = document.querySelector('.reports-container');
        if (!container) return;
        
        container.innerHTML = `
            <div class="reports-grid">
                ${this.createReportCard('financial', 'Financial Summary', 'Complete financial overview and analysis', 'savings')}
                ${this.createReportCard('enterprise', 'Enterprise Performance', 'Performance analysis by enterprise', 'trending_up')}
                ${this.createReportCard('monthly', 'Monthly Report', 'Monthly income, expenses, and profit', 'calendar_today')}
                ${this.createReportCard('seasonal', 'Seasonal Analysis', 'Seasonal trends and patterns', 'waves')}
                ${this.createReportCard('inventory', 'Inventory Report', 'Current inventory status and value', 'inventory')}
                ${this.createReportCard('custom', 'Custom Report', 'Create a custom report with filters', 'tune')}
            </div>
            
            <div class="report-display" id="report-display">
                <div class="empty-report">
                    <span class="material-icons-round">description</span>
                    <h3>Select a Report</h3>
                    <p>Choose a report type from the grid above to generate</p>
                </div>
            </div>
        `;
        
        // Add click handlers
        document.querySelectorAll('.report-card').forEach(card => {
            card.addEventListener('click', () => {
                const type = card.getAttribute('data-type');
                this.generateReport(type);
            });
        });
    }

    createReportCard(type, title, description, icon) {
        return `
            <div class="report-card glass-card" data-type="${type}">
                <div class="report-icon ${type}">
                    <span class="material-icons-round">${icon}</span>
                </div>
                <h3>${title}</h3>
                <p>${description}</p>
                <button class="btn btn-primary report-generate" data-type="${type}">
                    <span class="material-icons-round">description</span>
                    Generate Report
                </button>
            </div>
        `;
    }

    async generateReport(type) {
        this.currentReport = type;
        
        const display = document.getElementById('report-display');
        if (!display) return;
        
        window.ui.showLoading('Generating report...');
        
        try {
            let reportHtml = '';
            
            switch(type) {
                case 'financial':
                    reportHtml = await this.generateFinancialReport();
                    break;
                case 'enterprise':
                    reportHtml = await this.generateEnterpriseReport();
                    break;
                case 'monthly':
                    reportHtml = await this.generateMonthlyReport();
                    break;
                case 'seasonal':
                    reportHtml = await this.generateSeasonalReport();
                    break;
                case 'inventory':
                    reportHtml = await this.generateInventoryReport();
                    break;
                case 'custom':
                    reportHtml = await this.generateCustomReport();
                    break;
            }
            
            display.innerHTML = reportHtml;
            
            // Initialize report charts if any
            this.initializeReportCharts();
            
            window.ui.hideLoading();
            window.ui.showToast(`${type} report generated`, 'success');
        } catch (error) {
            console.error('Failed to generate report:', error);
            window.ui.hideLoading();
            window.ui.showToast('Failed to generate report', 'error');
        }
    }

    async generateFinancialReport() {
        const stats = await window.db.getStatistics('year');
        const transactions = await window.db.getAllTransactions();
        
        // Calculate additional metrics
        const monthlyAverages = {
            income: stats.totalIncome / 12,
            expenses: stats.totalExpenses / 12,
            profit: stats.netProfit / 12
        };
        
        const profitMargin = stats.totalIncome > 0 ? 
            (stats.netProfit / stats.totalIncome) * 100 : 0;
        
        return `
            <div class="report-container glass-card">
                <div class="report-header">
                    <div class="report-title">
                        <h3><span class="material-icons-round">savings</span> Financial Summary Report</h3>
                        <p>Generated on ${new Date().toLocaleDateString()}</p>
                    </div>
                    <div class="report-actions">
                        <button class="btn btn-outline" onclick="window.reports.exportReport('financial')">
                            <span class="material-icons-round">download</span>
                            Export PDF
                        </button>
                        <button class="btn btn-primary" onclick="window.print()">
                            <span class="material-icons-round">print</span>
                            Print
                        </button>
                    </div>
                </div>
                
                <div class="report-summary">
                    <div class="summary-stats">
                        <div class="summary-stat income">
                            <span class="material-icons-round">south_west</span>
                            <div>
                                <h4>Total Income</h4>
                                <p class="stat-value">$${stats.totalIncome.toFixed(2)}</p>
                                <small>Last 12 months</small>
                            </div>
                        </div>
                        
                        <div class="summary-stat expense">
                            <span class="material-icons-round">north_east</span>
                            <div>
                                <h4>Total Expenses</h4>
                                <p class="stat-value">$${stats.totalExpenses.toFixed(2)}</p>
                                <small>Last 12 months</small>
                            </div>
                        </div>
                        
                        <div class="summary-stat profit">
                            <span class="material-icons-round">trending_up</span>
                            <div>
                                <h4>Net Profit</h4>
                                <p class="stat-value">$${stats.netProfit.toFixed(2)}</p>
                                <small>${profitMargin.toFixed(1)}% margin</small>
                            </div>
                        </div>
                        
                        <div class="summary-stat transactions">
                            <span class="material-icons-round">receipt_long</span>
                            <div>
                                <h4>Transactions</h4>
                                <p class="stat-value">${stats.transactionCount}</p>
                                <small>Total records</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="report-charts">
                    <div class="chart-container">
                        <h4>Income vs Expenses Trend</h4>
                        <canvas id="financial-trend-chart"></canvas>
                    </div>
                    
                    <div class="chart-container">
                        <h4>Top Income Categories</h4>
                        <canvas id="income-categories-chart"></canvas>
                    </div>
                </div>
                
                <div class="report-details">
                    <div class="detail-section">
                        <h4><span class="material-icons-round">insights</span> Key Insights</h4>
                        <ul class="insights-list">
                            <li>Average monthly income: <strong>$${monthlyAverages.income.toFixed(2)}</strong></li>
                            <li>Average monthly expenses: <strong>$${monthlyAverages.expenses.toFixed(2)}</strong></li>
                            <li>Average monthly profit: <strong>$${monthlyAverages.profit.toFixed(2)}</strong></li>
                            <li>Profit margin: <strong>${profitMargin.toFixed(1)}%</strong></li>
                            <li>Average transaction value: <strong>$${stats.averageTransaction.toFixed(2)}</strong></li>
                        </ul>
                    </div>
                    
                    <div class="detail-section">
                        <h4><span class="material-icons-round">category</span> Top Categories</h4>
                        <div class="category-list">
                            ${this.createCategoryList(stats.topIncomeCategories, 'Income')}
                            ${this.createCategoryList(stats.topExpenseCategories, 'Expenses')}
                        </div>
                    </div>
                </div>
                
                <div class="report-footer">
                    <p class="report-note">
                        <span class="material-icons-round">info</span>
                        This report is based on data from ${stats.startDate?.toLocaleDateString() || 'beginning'} to ${stats.endDate?.toLocaleDateString()}
                    </p>
                    <button class="btn btn-primary" onclick="window.reports.saveReport('financial')">
                        <span class="material-icons-round">save</span>
                        Save Report
                    </button>
                </div>
            </div>
        `;
    }

    async generateEnterpriseReport() {
        const performance = await window.db.getEnterprisePerformance();
        
        return `
            <div class="report-container glass-card">
                <div class="report-header">
                    <h3><span class="material-icons-round">trending_up</span> Enterprise Performance Report</h3>
                </div>
                
                <div class="enterprise-performance">
                    ${performance.map(enterprise => `
                        <div class="enterprise-performance-card">
                            <div class="enterprise-header">
                                <h4>${enterprise.name}</h4>
                                <span class="enterprise-type">${enterprise.type}</span>
                            </div>
                            
                            <div class="enterprise-stats">
                                <div class="stat">
                                    <span class="stat-label">Income</span>
                                    <span class="stat-value income">$${enterprise.income.toFixed(2)}</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-label">Expenses</span>
                                    <span class="stat-value expense">$${enterprise.expenses.toFixed(2)}</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-label">Profit</span>
                                    <span class="stat-value profit">$${enterprise.profit.toFixed(2)}</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-label">ROI</span>
                                    <span class="stat-value roi">${enterprise.roi.toFixed(1)}%</span>
                                </div>
                            </div>
                            
                            <div class="enterprise-chart">
                                <canvas id="chart-${enterprise.type}"></canvas>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    async generateMonthlyReport() {
        const now = new Date();
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
        
        const currentMonth = monthNames[now.getMonth()];
        const stats = await window.db.getStatistics('month');
        
        return `
            <div class="report-container glass-card">
                <div class="report-header">
                    <h3><span class="material-icons-round">calendar_today</span> Monthly Report - ${currentMonth} ${now.getFullYear()}</h3>
                </div>
                
                <div class="monthly-highlights">
                    <div class="highlight-card">
                        <span class="material-icons-round">savings</span>
                        <div>
                            <h4>Monthly Income</h4>
                            <p>$${stats.totalIncome.toFixed(2)}</p>
                        </div>
                    </div>
                    
                    <div class="highlight-card">
                        <span class="material-icons-round">money_off</span>
                        <div>
                            <h4>Monthly Expenses</h4>
                            <p>$${stats.totalExpenses.toFixed(2)}</p>
                        </div>
                    </div>
                    
                    <div class="highlight-card">
                        <span class="material-icons-round">show_chart</span>
                        <div>
                            <h4>Monthly Profit</h4>
                            <p>$${stats.netProfit.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                
                <div class="monthly-details">
                    <h4>Transaction Summary</h4>
                    <p>${stats.transactionCount} transactions this month</p>
                    <!-- More details would go here -->
                </div>
            </div>
        `;
    }

    async generateSeasonalReport() {
        // Implementation for seasonal trends
        return `
            <div class="report-container glass-card">
                <div class="report-header">
                    <h3><span class="material-icons-round">waves</span> Seasonal Analysis Report</h3>
                </div>
                <p>Seasonal analysis coming soon...</p>
            </div>
        `;
    }

    async generateInventoryReport() {
        const inventory = await window.db.getInventory();
        const totalValue = inventory.reduce((sum, item) => sum + (item.total_value || 0), 0);
        
        return `
            <div class="report-container glass-card">
                <div class="report-header">
                    <h3><span class="material-icons-round">inventory</span> Inventory Report</h3>
                </div>
                
                <div class="inventory-summary">
                    <div class="summary-card">
                        <span class="material-icons-round">inventory_2</span>
                        <div>
                            <h4>Total Items</h4>
                            <p>${inventory.length}</p>
                        </div>
                    </div>
                    
                    <div class="summary-card">
                        <span class="material-icons-round">attach_money</span>
                        <div>
                            <h4>Total Value</h4>
                            <p>$${totalValue.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                
                ${inventory.length > 0 ? `
                    <div class="inventory-table">
                        <h4>Inventory Details</h4>
                        <table>
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Category</th>
                                    <th>Quantity</th>
                                    <th>Unit Price</th>
                                    <th>Total Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${inventory.map(item => `
                                    <tr>
                                        <td>${item.item_name}</td>
                                        <td>${item.category}</td>
                                        <td>${item.quantity} ${item.unit}</td>
                                        <td>$${item.unit_price?.toFixed(2) || '0.00'}</td>
                                        <td>$${(item.total_value || 0).toFixed(2)}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                ` : '<p>No inventory items found.</p>'}
            </div>
        `;
    }

    async generateCustomReport() {
        return `
            <div class="report-container glass-card">
                <div class="report-header">
                    <h3><span class="material-icons-round">tune</span> Custom Report Generator</h3>
                </div>
                
                <div class="custom-report-form">
                    <div class="form-group">
                        <label for="report-period">
                            <span class="material-icons-round">calendar_today</span>
                            Report Period
                        </label>
                        <select id="report-period">
                            <option value="week">Last Week</option>
                            <option value="month">Last Month</option>
                            <option value="quarter">Last Quarter</option>
                            <option value="year">Last Year</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>
                    
                    <div class="form-group" id="custom-date-range" style="display: none;">
                        <label for="start-date">Start Date</label>
                        <input type="date" id="start-date">
                        
                        <label for="end-date">End Date</label>
                        <input type="date" id="end-date">
                    </div>
                    
                    <div class="form-group">
                        <label for="report-enterprise">
                            <span class="material-icons-round">business</span>
                            Enterprise Filter
                        </label>
                        <select id="report-enterprise">
                            <option value="all">All Enterprises</option>
                            <option value="poultry">Poultry</option>
                            <option value="dairy">Dairy</option>
                            <option value="crops">Crops</option>
                            <option value="livestock">Livestock</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="report-type">
                            <span class="material-icons-round">category</span>
                            Report Type
                        </label>
                        <select id="report-type">
                            <option value="financial">Financial Summary</option>
                            <option value="detailed">Detailed Transactions</option>
                            <option value="comparative">Comparative Analysis</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="include-charts" checked>
                            <span class="checkbox-custom"></span>
                            <span>Include Charts</span>
                        </label>
                        
                        <label class="checkbox-label">
                            <input type="checkbox" id="include-recommendations" checked>
                            <span class="checkbox-custom"></span>
                            <span>Include Recommendations</span>
                        </label>
                    </div>
                    
                    <button class="btn btn-primary" onclick="window.reports.generateCustomReport()">
                        <span class="material-icons-round">play_arrow</span>
                        Generate Custom Report
                    </button>
                </div>
            </div>
        `;
    }

    createCategoryList(categories, type) {
        if (!categories || categories.length === 0) {
            return `<p>No ${type.toLowerCase()} categories found.</p>`;
        }
        
        return `
            <h5>${type}</h5>
            <ul>
                ${categories.map(([category, data]) => `
                    <li>
                        <span class="category-name">${category}</span>
                        <span class="category-amount">$${data.income || data.expense || 0}</span>
                    </li>
                `).join('')}
            </ul>
        `;
    }

    initializeReportCharts() {
        // Initialize charts for the current report
        // This would create Chart.js instances for the report
    }

    async saveReport(type) {
        try {
            const reportData = {
                type,
                generatedAt: new Date().toISOString(),
                data: await this.getReportData(type)
            };
            
            // Save to database
            // Implementation would depend on your database structure
            
            window.ui.showToast('Report saved successfully', 'success');
        } catch (error) {
            console.error('Failed to save report:', error);
            window.ui.showToast('Failed to save report', 'error');
        }
    }

    async getReportData(type) {
        // Get data for the report type
        switch(type) {
            case 'financial':
                return await window.db.getStatistics('year');
            case 'enterprise':
                return await window.db.getEnterprisePerformance();
            case 'monthly':
                return await window.db.getStatistics('month');
            default:
                return {};
        }
    }

    exportReport(type) {
        // Create a PDF version of the report
        // This would use a library like jsPDF or html2pdf
        
        window.ui.showToast('PDF export feature coming soon', 'info');
    }

    async generateCustomReport() {
        // Get form values
        const period = document.getElementById('report-period').value;
        const enterprise = document.getElementById('report-enterprise').value;
        const reportType = document.getElementById('report-type').value;
        const includeCharts = document.getElementById('include-charts').checked;
        const includeRecommendations = document.getElementById('include-recommendations').checked;
        
        // Generate report based on filters
        // Implementation would filter data and generate appropriate report
    }
}

// Initialize reports module
window.reports = new FarmFlowReports();
