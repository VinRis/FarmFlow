// ui.js
class UIHelper {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupPhotoCapture();
        this.setupFilters();
        this.setupExport();
    }
    
    setupPhotoCapture() {
        const takePhotoBtn = document.getElementById('takePhoto');
        const uploadPhotoBtn = document.getElementById('uploadPhoto');
        const photoPreview = document.getElementById('photoPreview');
        
        if (takePhotoBtn) {
            takePhotoBtn.addEventListener('click', () => this.capturePhoto());
        }
        
        if (uploadPhotoBtn) {
            uploadPhotoBtn.addEventListener('click', () => this.uploadPhoto());
        }
    }
    
    async capturePhoto() {
        // Check if camera is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            this.showToast('Camera not available on this device', 'camera_alt');
            return;
        }
        
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            
            // Create video element for preview
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();
            
            // Create canvas for capturing
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            // Wait for video to be ready
            video.addEventListener('canplay', () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                
                // Draw video frame to canvas
                context.drawImage(video, 0, 0);
                
                // Convert to data URL
                const photoData = canvas.toDataURL('image/jpeg');
                this.savePhoto(photoData);
                
                // Stop camera
                stream.getTracks().forEach(track => track.stop());
            });
            
        } catch (error) {
            console.error('Camera error:', error);
            this.showToast('Failed to access camera', 'error');
        }
    }
    
    uploadPhoto() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.savePhoto(event.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
        
        input.click();
    }
    
    savePhoto(dataUrl) {
        const photoPreview = document.getElementById('photoPreview');
        photoPreview.innerHTML = `
            <div class="photo-item">
                <img src="${dataUrl}" alt="Receipt photo">
                <button class="remove-photo" onclick="uiHelper.removePhoto()">
                    <span class="material-icons">close</span>
                </button>
            </div>
        `;
        
        // Store photo in transaction data
        this.currentPhoto = dataUrl;
    }
    
    removePhoto() {
        const photoPreview = document.getElementById('photoPreview');
        photoPreview.innerHTML = '';
        this.currentPhoto = null;
    }
    
    setupFilters() {
        const filterBtn = document.getElementById('filterTransactions');
        const filtersContainer = document.getElementById('transactionFilters');
        const clearBtn = document.getElementById('clearFilters');
        
        if (filterBtn && filtersContainer) {
            filterBtn.addEventListener('click', () => {
                filtersContainer.style.display = 
                    filtersContainer.style.display === 'none' ? 'block' : 'none';
            });
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearFilters());
        }
        
        // Add event listeners to filter inputs
        const filterInputs = document.querySelectorAll('.filter-select, .filter-input, .filter-search');
        filterInputs.forEach(input => {
            input.addEventListener('change', () => this.applyFilters());
        });
    }
    
    async applyFilters() {
        const enterprise = document.getElementById('filterEnterprise').value;
        const type = document.getElementById('filterType').value;
        const dateFrom = document.getElementById('filterDateFrom').value;
        const dateTo = document.getElementById('filterDateTo').value;
        const search = document.getElementById('filterSearch').value;
        
        const filters = {};
        if (enterprise) filters.enterprise = enterprise;
        if (type) filters.type = type;
        if (dateFrom && dateTo) {
            filters.startDate = dateFrom;
            filters.endDate = dateTo;
        }
        
        let transactions = await database.getTransactions(filters);
        
        // Apply search filter
        if (search) {
            transactions = transactions.filter(t => 
                t.category.toLowerCase().includes(search.toLowerCase()) ||
                t.enterprise.toLowerCase().includes(search.toLowerCase()) ||
                (t.note && t.note.toLowerCase().includes(search.toLowerCase()))
            );
        }
        
        this.displayFilteredTransactions(transactions);
    }
    
    displayFilteredTransactions(transactions) {
        const container = document.getElementById('allTransactions');
        
        if (transactions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="material-icons">search</span>
                    <p>No transactions match your filters</p>
                    <button class="btn secondary" onclick="uiHelper.clearFilters()">Clear filters</button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = transactions.map(trans => `
            <div class="transaction-item" data-id="${trans.id}">
                <div class="transaction-info">
                    <div class="transaction-category">${trans.category}</div>
                    <div class="transaction-meta">
                        <span>${trans.enterprise}</span>
                        <span>${new Date(trans.date).toLocaleDateString()}</span>
                        ${trans.note ? `<span>${trans.note}</span>` : ''}
                    </div>
                </div>
                <div class="transaction-actions">
                    <div class="transaction-amount ${trans.type}">
                        ${trans.type === 'income' ? '+' : '-'} KES ${trans.amount.toLocaleString()}
                    </div>
                    <button class="icon-btn small" onclick="app.editTransaction(${trans.id})">
                        <span class="material-icons">edit</span>
                    </button>
                    <button class="icon-btn small" onclick="app.deleteTransaction(${trans.id})">
                        <span class="material-icons">delete</span>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    clearFilters() {
        document.getElementById('filterEnterprise').value = '';
        document.getElementById('filterType').value = '';
        document.getElementById('filterDateFrom').value = '';
        document.getElementById('filterDateTo').value = '';
        document.getElementById('filterSearch').value = '';
        
        // Reload all transactions
        if (app && app.loadTransactions) {
            app.loadTransactions();
        }
    }
    
    setupExport() {
        const exportBtn = document.getElementById('exportReport');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportData());
        }
    }
    
    async exportData() {
        try {
            const data = await database.exportData();
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            // Create download link
            const a = document.createElement('a');
            a.href = url;
            a.download = `farmflow-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            // Clean up
            setTimeout(() => URL.revokeObjectURL(url), 100);
            
            this.showToast('Backup exported successfully', 'download');
            
        } catch (error) {
            console.error('Export error:', error);
            this.showToast('Failed to export data', 'error');
        }
    }
    
    async importData(file) {
        try {
            const reader = new FileReader();
            
            reader.onload = async (event) => {
                await database.importData(event.target.result);
                this.showToast('Data imported successfully', 'check_circle');
                
                // Refresh app
                if (app) {
                    app.updateDashboard();
                }
            };
            
            reader.readAsText(file);
            
        } catch (error) {
            console.error('Import error:', error);
            this.showToast('Failed to import data', 'error');
        }
    }
    
    generateReport(type, data) {
        switch(type) {
            case 'pl':
                return this.generateProfitLossReport(data);
            case 'cashflow':
                return this.generateCashFlowReport(data);
            case 'seasonal':
                return this.generateSeasonalReport(data);
            case 'roi':
                return this.generateROIReport(data);
        }
    }
    
    generateProfitLossReport(data) {
        // Generate P&L report
        const report = {
            title: 'Profit & Loss Report',
            period: 'January 2024',
            income: 0,
            expenses: 0,
            net: 0,
            byEnterprise: {},
            byCategory: {}
        };
        
        // Format as HTML or PDF
        return this.formatReport(report);
    }
    
    formatReport(report) {
        // Format report for display or export
        return `
            <div class="report">
                <h2>${report.title}</h2>
                <p>Period: ${report.period}</p>
                <table>
                    <tr>
                        <th>Category</th>
                        <th>Amount</th>
                    </tr>
                    <tr>
                        <td>Total Income</td>
                        <td>KES ${report.income.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td>Total Expenses</td>
                        <td>KES ${report.expenses.toLocaleString()}</td>
                    </tr>
                    <tr>
                        <td><strong>Net Income</strong></td>
                        <td><strong>KES ${report.net.toLocaleString()}</strong></td>
                    </tr>
                </table>
            </div>
        `;
    }
    
    showToast(message, icon = 'info') {
        if (app && app.showToast) {
            app.showToast(message, icon);
        } else {
            // Fallback toast implementation
            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.innerHTML = `
                <div class="toast-content">
                    <span class="material-icons">${icon}</span>
                    <span>${message}</span>
                </div>
            `;
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.classList.add('show');
            }, 10);
            
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(toast);
                }, 300);
            }, 3000);
        }
    }
}

// Initialize UI helper
const uiHelper = new UIHelper();