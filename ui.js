// ui.js - Minimal working version
class UIHelper {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('UI Helper initialized');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.uiHelper = new UIHelper();
});
