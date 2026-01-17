export class PanelManager {
    constructor() {
        this.panel = document.getElementById('info-panel');
        this.overlay = document.getElementById('overlay');
        this.elements = {
            title: document.getElementById('info-title'),
            description: document.getElementById('info-description'),
            year: document.getElementById('info-year'),
            category: document.getElementById('info-category'),
            image: document.getElementById('info-image'),
            video: document.getElementById('info-video')
        };
        
        this.currentMilestone = null;
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Botón cerrar
        document.getElementById('close-panel').addEventListener('click', () => this.hide());
        
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
        // Texto
        this.elements.title.textContent = milestone.title;
        this.elements.description.textContent = milestone.description;
        this.elements.year.textContent = milestone.year;
        this.elements.category.textContent = milestone.category;
        
        // Estilo categoría
        this.elements.category.style.backgroundColor = this.getCategoryBackground(milestone.category);
        this.elements.category.style.borderColor = this.getCategoryColor(milestone.category);
        
        // Imagen
        if (milestone.image) {
            this.elements.image.src = milestone.image;
            this.elements.image.alt = milestone.title;
            this.elements.image.style.display = 'block';
            
            // Manejar error
            this.elements.image.onerror = () => {
                this.elements.image.src = `https://via.placeholder.com/400x300/0a0a1a/00ffff?text=${encodeURIComponent(milestone.title)}`;
            };
        }
        
        // Video
        if (milestone.video) {
            this.elements.video.innerHTML = this.createVideoEmbed(milestone.video);
            this.elements.video.style.display = 'block';
        } else {
            this.elements.video.innerHTML = '';
            this.elements.video.style.display = 'none';
        }
    }
    
    createVideoEmbed(videoId) {
        return `
            <div class="video-section">
                <p><strong>🎥 Video relacionado:</strong></p>
                <a href="https://youtube.com/watch?v=${videoId}" 
                   target="_blank" 
                   class="video-link">
                   <span>▶️ Ver en YouTube</span>
                   <small>(se abre en nueva pestaña)</small>
                </a>
            </div>
        `;
    }
    
    getCategoryColor(category) {
        const colors = {
            'Hardware': '#00ffff',
            'Software': '#00ff88',
            'IA': '#ff00ff',
            'Redes': '#ffaa00',
            'Web': '#0088ff',
            'Teoría': '#ff8800'
        };
        return colors[category] || '#8888ff';
    }
    
    getCategoryBackground(category) {
        const color = this.getCategoryColor(category);
        const rgb = this.hexToRgb(color);
        return `rgba(${rgb}, 0.15)`;
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result 
            ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
            : '136, 136, 255';
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