import { PanelContent } from './content.js';
import { PanelEvents } from './events.js';

export class PanelManager {
    constructor() {
        this.panel = document.getElementById('info-panel');
        this.overlay = document.getElementById('overlay');
        this.events = new PanelEvents(this.panel, this.overlay);
        
        this.events.setup();
    }
    
    show(milestone) {
        if (!milestone) return;
        
        this.panel.innerHTML = PanelContent.generate(milestone);
        this.panel.classList.add('active');
        this.overlay.classList.add('active');
        
        this.animateIn();
    }
    
    animateIn() {
        this.panel.style.animation = 'none';
        setTimeout(() => {
            this.panel.style.animation = 'panelSlideIn 0.4s ease-out';
        }, 10);
    }
    
    hide() {
        this.events.hide();
    }
    
    isVisible() {
        return this.panel.classList.contains('active');
    }
    
    destroy() {
        this.events.cleanup();
        this.panel.innerHTML = '';
    }
}