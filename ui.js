// ui.js - Simplified
class UIHelper {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('UI Helper initialized');
    }
}

// Initialize UI helper
document.addEventListener('DOMContentLoaded', () => {
    window.uiHelper = new UIHelper();
});