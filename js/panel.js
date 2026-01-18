export class PanelManager {
    constructor() {
        this.panel = document.getElementById('info-panel');
        this.overlay = document.getElementById('overlay');
        this.currentMilestone = null;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Botón cerrar (se crea dinámicamente)
        this.panel.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-btn')) {
                this.hide();
            }
        });
        
        // Cerrar con overlay
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.hide();
        });
        
        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.panel.classList.contains('active')) {
                this.hide();
            }
        });
        
        // Prevenir cierre al hacer clic en el panel
        this.panel.addEventListener('click', (e) => e.stopPropagation());
    }
    
    show(milestone) {
        this.currentMilestone = milestone;
        this.updateContent(milestone);
        
        // Mostrar elementos
        this.panel.classList.add('active');
        this.overlay.classList.add('active');
        
        // Animar
        this.animateIn();
        
        console.log('📖 Mostrando:', milestone.title);
    }
    
    hide() {
        this.panel.classList.remove('active');
        this.overlay.classList.remove('active');
        this.animateOut();
    }
    
    updateContent(milestone) {
        this.panel.innerHTML = this.generatePanelHTML(milestone);
    }
    
    generatePanelHTML(milestone) {
        return `
            <div class="panel-header">
                <h2>${milestone.title}</h2>
                <button class="btn close-btn">×</button>
            </div>
            <div class="panel-content">
                <div class="panel-left">
                    <img src="${milestone.image}" 
                         alt="${milestone.title}" 
                         class="panel-image"
                         onerror="this.src='https://via.placeholder.com/400x300/0a0a1a/00ffff?text=${encodeURIComponent(milestone.title.substring(0, 20))}'">
                    <div class="category">${milestone.category}</div>
                </div>
                <div class="panel-right">
                    <p class="panel-description">${milestone.description}</p>
                    <p><strong>Año:</strong> <span class="year">${milestone.year}</span></p>
                    ${milestone.video ? this.generateVideoHTML(milestone.video) : ''}
                </div>
            </div>
        `;
    }
    
    generateVideoHTML(videoId) {
        return `
            <div class="video-section">
                <p><strong>🎥 Video relacionado:</strong></p>
                <a href="https://youtube.com/watch?v=${videoId}" 
                   target="_blank" 
                   class="video-link">
                   ▶️ Ver en YouTube
                </a>
            </div>
        `;
    }
    
    animateIn() {
        this.panel.style.animation = 'none';
        setTimeout(() => {
            this.panel.style.animation = 'panelSlideIn 0.4s ease-out';
        }, 10);
    }
    
    animateOut() {
        this.panel.style.animation = 'panelSlideOut 0.3s ease-in';
    }
}