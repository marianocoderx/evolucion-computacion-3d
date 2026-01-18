import { DOMUtils } from '../../utils/dom.js';

export class ControlsManager {
    constructor() {
        this.buttons = new Map();
    }
    
    createButton(id, text, position, onClick) {
        const button = DOMUtils.createElement('button', 'control-btn', { id }, text);
        button.style.cssText = `position: fixed; ${position}; z-index: 100;`;
        button.addEventListener('click', onClick);
        
        document.body.appendChild(button);
        this.buttons.set(id, button);
        
        return button;
    }
    
    createDebugInfo(stats) {
        const debugInfo = DOMUtils.createElement('div', 'debug-info', {}, `
            <div>Hitos: ${stats.total}</div>
            <div>Años: ${stats.yearRange.min} - ${stats.yearRange.max}</div>
        `);
        
        document.body.appendChild(debugInfo);
        return debugInfo;
    }
    
    removeButton(id) {
        const button = this.buttons.get(id);
        if (button) {
            button.remove();
            this.buttons.delete(id);
        }
    }
    
    clear() {
        this.buttons.forEach(button => button.remove());
        this.buttons.clear();
    }
}