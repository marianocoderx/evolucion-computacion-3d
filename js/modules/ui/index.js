import { ControlsManager } from './controls.js';
import { ModalManager } from './modal.js';
import { LoadingManager } from './loading.js';

export class UIManager {
    constructor() {
        this.controls = new ControlsManager();
        this.modal = new ModalManager();
        this.loading = new LoadingManager();
    }
    
    initializeControls(stats, onShowList, onReload, debugMode = false) {
        this.controls.createButton('reload-btn', '🔄 Recargar', 'bottom: 20px; right: 20px;', onReload);
        this.controls.createButton('list-btn', '📋 Lista', 'bottom: 60px; right: 20px;', onShowList);
        
        if (debugMode) {
            this.controls.createDebugInfo(stats);
        }
    }
    
    showMilestonesList(milestones, onMilestoneSelect) {
        this.modal.createMilestonesModal(milestones, onMilestoneSelect);
    }
    
    showLoading(message) {
        this.loading.show(message);
    }
    
    hideLoading() {
        this.loading.hide();
    }
    
    clear() {
        this.controls.clear();
        this.modal.clear();
    }
}