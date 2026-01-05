// UI Helper Functions
class FarmFlowUI {
    static formatCurrency(amount, currency = 'KES') {
        return `${currency} ${parseFloat(amount).toLocaleString('en-KE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }
    
    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
    
    static createTransactionCard(transaction) {
        const amountClass = transaction.type === 'income' ? 'income' : 'expense';
        const amountPrefix = transaction.type === 'income' ? '+' : '-';
        
        return `
            <div class="transaction-card">
                <div class="transaction-icon">
                    <span class="material-icons">${transaction.type === 'income' ? 'trending_up' : 'trending_down'}</span>
                </div>
                <div class="transaction-details">
                    <h4>${transaction.description}</h4>
                    <p>${this.formatDate(transaction.date)} • ${transaction.category || 'General'}</p>
                </div>
                <div class="transaction-amount ${amountClass}">
                    ${amountPrefix} ${this.formatCurrency(transaction.amount)}
                </div>
            </div>
        `;
    }
    
    static createEnterpriseCard(enterprise) {
        return `
            <div class="enterprise-card">
                <div class="enterprise-icon">
                    <span class="material-icons">store</span>
                </div>
                <div class="enterprise-details">
                    <h3>${enterprise.name}</h3>
                    <p>${enterprise.description || 'No description provided'}</p>
                    <div class="enterprise-meta">
                        <span class="badge ${enterprise.type}">${enterprise.type}</span>
                        <span class="status ${enterprise.isActive ? 'active' : 'inactive'}">
                            ${enterprise.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
            </div>
        `;
    }
    
    static showLoading(container) {
        container.innerHTML = `
            <div class="loading-state">
                <div class="spinner"></div>
                <p>Loading...</p>
            </div>
        `;
    }
    
    static showEmptyState(container, message, icon = 'info', actionText = null, actionCallback = null) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons">${icon}</span>
                <p>${message}</p>
                ${actionText ? `<button class="btn-primary" id="emptyStateAction">${actionText}</button>` : ''}
            </div>
        `;
        
        if (actionText && actionCallback) {
            document.getElementById('emptyStateAction').addEventListener('click', actionCallback);
        }
    }
}
