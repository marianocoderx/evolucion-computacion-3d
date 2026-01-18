import { CONFIG } from './config.js';
import { DataManager } from './modules/data/index.js';
import { UIManager } from './modules/ui/index.js';
import { TimelineManager } from './modules/timeline/index.js';
import { PanelManager } from './modules/panel/index.js';
import { EffectsManager } from './modules/effects/index.js';
import { UrlUtils } from './utils/url.js';
import { Logger } from './utils/logger.js';

class ComputerHistoryApp {
    constructor() {
        this.config = CONFIG;
        this.modules = {};
        this.isInitialized = false;
    }
    
    async initialize() {
        try {
            Logger.info('🚀 Iniciando aplicación...');
            
            // 1. Cargar datos
            const dataManager = new DataManager(this.config.JSON_URL);
            const milestones = await dataManager.load();
            
            // 2. Inicializar módulos
            await this.initializeModules(milestones);
            
            // 3. Configurar UI
            this.setupUI(dataManager.getStats());
            
            // 4. Configurar eventos globales
            this.setupGlobalEvents();
            
            // 5. Aplicación lista
            this.isInitialized = true;
            Logger.success('✅ Aplicación inicializada');
            
        } catch (error) {
            Logger.error('Error inicializando aplicación', error);
        }
    }
    
    async initializeModules(milestones) {
        // Efectos visuales
        this.modules.effects = new EffectsManager(this.config);
        this.modules.effects.initialize();
        
        // Timeline
        this.modules.timeline = new TimelineManager('.timeline', milestones, {
            onMilestoneClick: (milestone) => this.onMilestoneSelect(milestone),
            enableKeyboard: this.config.ENABLE_KEYBOARD
        });
        
        // Panel
        this.modules.panel = new PanelManager();
        
        // UI Manager
        this.modules.ui = new UIManager();
        
        // Mostrar hito desde URL
        this.showMilestoneFromUrl(milestones);
    }
    
    setupUI(stats) {
        this.modules.ui.showLoading('Cargando galaxia...');
        
        setTimeout(() => {
            this.modules.ui.hideLoading();
            
            this.modules.ui.initializeControls(
                stats,
                () => this.modules.ui.showMilestonesList(
                    window.milestonesData,
                    (milestone) => this.modules.panel.show(milestone)
                ),
                () => location.reload(),
                this.config.DEBUG_MODE
            );
        }, 1000);
    }
    
    setupGlobalEvents() {
        // Hacer accesible globalmente para debugging
        window.app = this;
        window.milestonesData = this.modules.timeline.milestones;
    }
    
    onMilestoneSelect(milestone) {
        this.modules.panel.show(milestone);
        UrlUtils.updateUrl(milestone.id);
    }
    
    showMilestoneFromUrl(milestones) {
        const hashId = UrlUtils.getHashId();
        if (hashId) {
            const milestone = milestones.find(m => m.id == hashId);
            if (milestone) {
                setTimeout(() => this.modules.panel.show(milestone), 1500);
            }
        } else if (this.config.AUTO_SHOW_FIRST && milestones.length > 0) {
            setTimeout(() => this.modules.panel.show(milestones[0]), 1000);
        }
    }
    
    destroy() {
        Object.values(this.modules).forEach(module => {
            if (module.destroy) module.destroy();
        });
        
        this.modules = {};
        this.isInitialized = false;
    }
}

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
    const app = new ComputerHistoryApp();
    app.initialize();
});