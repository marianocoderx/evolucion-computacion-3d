import { TimelineRenderer } from './renderer.js';
import { TimelineNavigation } from './navigation.js';
import { DOMUtils } from '../../utils/dom.js';

export class TimelineManager {
    constructor(containerSelector, milestones, config) {
        this.container = document.querySelector(containerSelector);
        this.milestones = milestones;
        this.config = config;
        this.currentMilestone = null;
        
        this.renderer = new TimelineRenderer(this.container);
        this.navigation = new TimelineNavigation(milestones);
        
        this.initialize();
    }
    
    initialize() {
        this.renderer.render(this.milestones);
        this.setupEventListeners();
        this.setupKeyboardNavigation();
    }
    
    setupEventListeners() {
        // Click en hitos
        this.container.addEventListener('click', (e) => {
            const milestoneEl = e.target.closest('.milestone');
            if (milestoneEl) {
                const id = parseInt(milestoneEl.dataset.id);
                this.selectMilestone(id);
            }
        });
        
        // Hover effects
        this.container.addEventListener('mouseover', (e) => {
            const milestone = e.target.closest('.milestone');
            if (milestone) milestone.classList.add('hover');
        });
        
        this.container.addEventListener('mouseout', (e) => {
            const milestone = e.target.closest('.milestone');
            if (milestone) milestone.classList.remove('hover');
        });
    }
    
    setupKeyboardNavigation() {
        if (!this.config.enableKeyboard) return;
        
        document.addEventListener('keydown', (e) => {
            if (!this.currentMilestone) return;
            
            let direction;
            switch(e.key) {
                case 'ArrowDown': direction = 'down'; break;
                case 'ArrowUp': direction = 'up'; break;
                case 'Home': direction = 'first'; break;
                case 'End': direction = 'last'; break;
                default: return;
            }
            
            e.preventDefault();
            this.navigate(direction);
        });
    }
    
    selectMilestone(id) {
        const milestone = this.navigation.getById(id);
        if (!milestone) return;
        
        this.currentMilestone = milestone;
        this.renderer.highlightMilestone(id);
        
        if (this.config.onMilestoneClick) {
            this.config.onMilestoneClick(milestone);
        }
        
        return milestone;
    }
    
    navigate(direction) {
        if (!this.currentMilestone) return;
        
        const milestone = this.navigation.navigate(this.currentMilestone.id, direction);
        if (milestone) {
            this.selectMilestone(milestone.id);
        }
        
        return milestone;
    }
    
    destroy() {
        this.renderer.clear();
        this.container.innerHTML = '';
    }
}