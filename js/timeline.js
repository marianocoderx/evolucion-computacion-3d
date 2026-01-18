export class TimelineApp {
    constructor(milestones, config) {
        this.milestones = milestones;
        this.config = config;
        this.currentMilestone = null;
        this.timelineElement = document.querySelector('.timeline');
        
        this.init();
    }
    
    init() {
        if (!this.timelineElement) {
            console.error('No se encontró el elemento .timeline');
            return;
        }
        
        this.createMilestones();
        this.setupEventListeners();
        this.setupKeyboardNavigation();
        
        console.log('📈 Timeline creado con', this.milestones.length, 'hitos');
    }
    
    createMilestones() {
        // Limpiar hitos existentes
        const existing = this.timelineElement.querySelectorAll('.milestone');
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
        const position = ((milestone.year - earliestYear) / yearRange) * 90;
        const sideClass = index % 2 === 0 ? 'left' : 'right';
        
        const div = document.createElement('div');
        div.className = `milestone ${sideClass}`;
        div.dataset.id = milestone.id;
        div.dataset.year = milestone.year;
        div.dataset.category = milestone.category;
        
        div.style.top = `${position}%`;
        div.innerHTML = this.getMilestoneHTML(milestone);
        
        div.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectMilestone(milestone, div);
        });
        
        return div;
    }
    
    getMilestoneHTML(milestone) {
        const truncatedTitle = milestone.title.length > 45 
            ? milestone.title.substring(0, 42) + '...' 
            : milestone.title;
        
        const truncatedDesc = milestone.description.length > 70 
            ? milestone.description.substring(0, 67) + '...' 
            : milestone.description;
        
        return `
            <div class="dot"></div>
            <div class="year">${milestone.year}</div>
            <h3>${truncatedTitle}</h3>
            <p>${truncatedDesc}</p>
            <div class="category">${milestone.category}</div>
        `;
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
    
    setupEventListeners() {
        // Efectos hover
        this.timelineElement.addEventListener('mouseover', (e) => {
            const milestone = e.target.closest('.milestone');
            if (milestone) milestone.classList.add('hover');
        });
        
        this.timelineElement.addEventListener('mouseout', (e) => {
            const milestone = e.target.closest('.milestone');
            if (milestone) milestone.classList.remove('hover');
        });
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
}