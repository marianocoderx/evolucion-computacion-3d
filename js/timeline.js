export class TimelineApp {
    constructor(milestones, config = {}) {
        this.milestones = milestones;
        this.config = config;
        this.currentMilestone = null;
        this.timelineElement = document.querySelector('.timeline');
        
        this.init();
    }
    
    init() {
        if (!this.timelineElement) {
            console.error('No se encontró .timeline');
            return;
        }
        
        this.createMilestones();
        this.setupKeyboardNavigation();
        this.setupResizeListener();
        
        console.log('📈 Timeline creado con', this.milestones.length, 'hitos');
    }
    
    createMilestones() {
        // Limpiar hitos existentes
        const existing = this.timelineElement.querySelectorAll('.milestone:not(.template)');
        existing.forEach(el => el.remove());
        
        const earliestYear = Math.min(...this.milestones.map(m => m.year));
        const latestYear = Math.max(...this.milestones.map(m => m.year));
        const yearRange = latestYear - earliestYear || 100;
        
        this.milestones.forEach((milestone, index) => {
            const milestoneEl = this.createMilestoneElement(milestone, index, earliestYear, yearRange);
            this.timelineElement.appendChild(milestoneEl);
        });
    }
    
    createMilestoneElement(milestone, index, earliestYear, yearRange) {
        const div = document.createElement('div');
        div.className = `milestone ${index % 2 === 0 ? 'left' : 'right'}`;
        div.dataset.id = milestone.id;
        div.dataset.year = milestone.year;
        div.dataset.category = milestone.category;
        
        // Calcular posición vertical
        const position = yearRange > 0 
            ? ((milestone.year - earliestYear) / yearRange) * 90 
            : (index / this.milestones.length) * 90;
        
        div.style.top = `${position}%`;
        
        // Contenido
        div.innerHTML = `
            <div class="dot" style="background: ${this.getCategoryColor(milestone.category)}"></div>
            <div class="year">${milestone.year}</div>
            <h3>${this.truncate(milestone.title, 45)}</h3>
            <p>${this.truncate(milestone.description, 70)}</p>
            <div class="category">${milestone.category}</div>
        `;
        
        // Eventos
        div.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectMilestone(milestone, div);
        });
        
        div.addEventListener('mouseenter', () => {
            div.classList.add('hover');
        });
        
        div.addEventListener('mouseleave', () => {
            div.classList.remove('hover');
        });
        
        return div;
    }
    
    selectMilestone(milestone, element) {
        // Remover selección anterior
        document.querySelectorAll('.milestone.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Marcar como seleccionado
        element.classList.add('selected');
        this.currentMilestone = milestone;
        
        // Llamar callback si existe
        if (this.config.onMilestoneClick) {
            this.config.onMilestoneClick(milestone);
        }
        
        // Scroll suave
        setTimeout(() => {
            element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'nearest' 
            });
        }, 300);
    }
    
    setupKeyboardNavigation() {
        if (!this.config.enableKeyboard) return;
        
        document.addEventListener('keydown', (e) => {
            if (!this.currentMilestone) return;
            
            const currentIndex = this.milestones.findIndex(m => m.id === this.currentMilestone.id);
            let newIndex;
            
            switch(e.key) {
                case 'ArrowDown':
                    newIndex = (currentIndex + 1) % this.milestones.length;
                    break;
                case 'ArrowUp':
                    newIndex = (currentIndex - 1 + this.milestones.length) % this.milestones.length;
                    break;
                case 'Home':
                    newIndex = 0;
                    break;
                case 'End':
                    newIndex = this.milestones.length - 1;
                    break;
                default:
                    return;
            }
            
            e.preventDefault();
            const milestone = this.milestones[newIndex];
            const element = document.querySelector(`.milestone[data-id="${milestone.id}"]`);
            if (element) {
                this.selectMilestone(milestone, element);
            }
        });
    }
    
    setupResizeListener() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.createMilestones();
            }, 250);
        });
    }
    
    getCategoryColor(category) {
        const colors = {
            'Hardware': '#00ffff',
            'Software': '#00ff88',
            'IA': '#ff00ff',
            'Redes': '#ffaa00',
            'Web': '#0088ff',
            'Teoría': '#ff8800',
            'General': '#8888ff'
        };
        return colors[category] || '#ffffff';
    }
    
    truncate(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
    
    // Métodos públicos
    getMilestoneById(id) {
        return this.milestones.find(m => m.id == id);
    }
    
    getAllCategories() {
        return [...new Set(this.milestones.map(m => m.category))];
    }
    
    filterByCategory(category) {
        return this.milestones.filter(m => m.category === category);
    }
}