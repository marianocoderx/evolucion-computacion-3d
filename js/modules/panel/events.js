export class PanelEvents {
    constructor(panel, overlay) {
        this.panel = panel;
        this.overlay = overlay;
        this.unsubscribeFns = [];
    }
    
    setup() {
        // Cerrar con botón
        this.panel.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-btn')) {
                this.hide();
            }
        });
        
        // Cerrar con overlay
        const overlayClick = () => this.hide();
        this.overlay.addEventListener('click', overlayClick);
        this.unsubscribeFns.push(() => this.overlay.removeEventListener('click', overlayClick));
        
        // Cerrar con Escape
        const escapeHandler = (e) => {
            if (e.key === 'Escape' && this.panel.classList.contains('active')) {
                this.hide();
            }
        };
        document.addEventListener('keydown', escapeHandler);
        this.unsubscribeFns.push(() => document.removeEventListener('keydown', escapeHandler));
        
        // Prevenir cierre al hacer clic en el panel
        const stopPropagation = (e) => e.stopPropagation();
        this.panel.addEventListener('click', stopPropagation);
        this.unsubscribeFns.push(() => this.panel.removeEventListener('click', stopPropagation));
    }
    
    hide() {
        this.panel.classList.remove('active');
        this.overlay.classList.remove('active');
        this.animateOut();
    }
    
    animateOut() {
        this.panel.style.animation = 'panelSlideOut 0.3s ease-in';
    }
    
    cleanup() {
        this.unsubscribeFns.forEach(fn => fn());
        this.unsubscribeFns = [];
    }
}