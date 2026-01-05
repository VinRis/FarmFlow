// Reports Manager
class FarmFlowReports {
    static async generateFinancialReport(startDate, endDate) {
        try {
            const stats = await farmDB.getFinancialStats(startDate, endDate);
            const transactions = await farmDB.getTransactions({ startDate, endDate });
            
            return {
                period: { startDate, endDate },
                summary: stats,
                transactions: transactions,
                generatedAt: new Date().toISOString()
            };
            
        } catch (error) {
            console.error('Error generating report:', error);
            throw error;
        }
    }
    
    static formatReportAsHTML(report) {
        const period = report.period;
        const summary = report.summary;
        
        return `
            <div class="report">
                <div class="report-header">
                    <h2>Farm Financial Report</h2>
                    <p>Period: ${new Date(period.startDate).toLocaleDateString()} to ${new Date(period.endDate).toLocaleDateString()}</p>
                    <p>Generated: ${new Date(report.generatedAt).toLocaleString()}</p>
                </div>
                
                <div class="report-summary">
                    <h3>Financial Summary</h3>
                    <div class="summary-grid">
                        <div class="summary-item">
                            <h4>Total Income</h4>
                            <p class="amount income">${FarmFlowUI.formatCurrency(summary.totalIncome)}</p>
                        </div>
                        <div class="summary-item">
                            <h4>Total Expenses</h4>
                            <p class="amount expense">${FarmFlowUI.formatCurrency(summary.totalExpenses)}</p>
                        </div>
                        <div class="summary-item">
                            <h4>Net Balance</h4>
                            <p class="amount ${summary.netBalance >= 0 ? 'income' : 'expense'}">
                                ${FarmFlowUI.formatCurrency(summary.netBalance)}
                            </p>
                        </div>
                    </div>
                </div>
                
                <div class="report-transactions">
                    <h3>Transaction Details</h3>
                    <table class="report-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Type</th>
                                <th>Amount</th>
                                <th>Enterprise</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${report.transactions.map(tx => `
                                <tr>
                                    <td>${FarmFlowUI.formatDate(tx.date)}</td>
                                    <td>${tx.description}</td>
                                    <td><span class="badge ${tx.type}">${tx.type}</span></td>
                                    <td class="${tx.type}">${tx.type === 'income' ? '+' : '-'} ${FarmFlowUI.formatCurrency(tx.amount)}</td>
                                    <td>${tx.enterpriseId || 'General'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }
    
    static exportAsCSV(report) {
        let csv = 'Date,Description,Type,Amount,Enterprise,Category,Notes\n';
        
        report.transactions.forEach(tx => {
            csv += `"${FarmFlowUI.formatDate(tx.date)}","${tx.description}","${tx.type}","${tx.amount}","${tx.enterpriseId || ''}","${tx.category || ''}","${tx.notes || ''}"\n`;
        });
        
        return csv;
    }
}
