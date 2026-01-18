import { DOMUtils } from '../../utils/dom.js';

export class TimelineRenderer {
    constructor(container) {
        this.container = container;
        this.elements = new Map();
    }
    
    render(milestones) {
        this.clear();
        
        const earliestYear = Math.min(...milestones.map(m => m.year));
        const latestYear = Math.max(...milestones.map(m => m.year));
        const yearRange = latestYear - earliestYear || 100;
        
        milestones.forEach((milestone, index) => {
            const element = this.createMilestoneElement(milestone, index, earliestYear, yearRange);
            this.container.appendChild(element);
            this.elements.set(milestone.id, element);
        });
    }
    
    createMilestoneElement(milestone, index, earliestYear, yearRange) {
        const position = ((milestone.year - earliestYear) / yearRange) * 90;
        const sideClass = index % 2 === 0 ? 'left' : 'right';
        
        const element = DOMUtils.createElement('div', `milestone ${sideClass}`, {
            'data-id': milestone.id,
            'data-year': milestone.year,
            'data-category': milestone.category
        });
        
        element.style.top = `${position}%`;
        element.innerHTML = this.createMilestoneHTML(milestone);
        
        return element;
    }
    
    createMilestoneHTML(milestone) {
        const truncatedTitle = this.truncateText(milestone.title, 45);
        const truncatedDesc = this.truncateText(milestone.description, 70);
        
        return `
            <div class="dot"></div>
            <div class="year">${milestone.year}</div>
            <h3>${truncatedTitle}</h3>
            <p>${truncatedDesc}</p>
            <div class="category">${milestone.category}</div>
        `;
    }
    
    truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
    }
    
    highlightMilestone(id) {
        // Remover highlight anterior
        this.container.querySelectorAll('.milestone.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Aplicar highlight
        const element = this.elements.get(id);
        if (element) {
            element.classList.add('selected');
            element.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'nearest' 
            });
        }
    }
    
    getElement(id) {
        return this.elements.get(id);
    }
    
    clear() {
        this.container.innerHTML = '<div class="timeline-line"></div>';
        this.elements.clear();
    }
}