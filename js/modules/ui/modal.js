import { DOMUtils } from '../../utils/dom.js';

export class ModalManager {
    constructor() {
        this.modals = new Map();
    }
    
    createMilestonesModal(milestones, onMilestoneSelect, onClose) {
        const modal = DOMUtils.createElement('div', 'milestones-modal');
        
        modal.innerHTML = `
            <div class="modal-content">
                <h3>📜 Todos los hitos (${milestones.length})</h3>
                <div class="milestones-list">
                    ${milestones.map(milestone => `
                        <div class="milestone-item" data-id="${milestone.id}">
                            <span class="year">${milestone.year}</span>
                            <span class="title">${milestone.title}</span>
                            <span class="category">${milestone.category}</span>
                        </div>
                    `).join('')}
                </div>
                <button class="close-modal-btn">Cerrar</button>
            </div>
        `;
        
        // Eventos
        modal.querySelectorAll('.milestone-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                const milestone = milestones.find(m => m.id === id);
                if (milestone && onMilestoneSelect) {
                    onMilestoneSelect(milestone);
                    this.closeModal('milestones');
                }
            });
        });
        
        modal.querySelector('.close-modal-btn').addEventListener('click', () => {
            this.closeModal('milestones');
            if (onClose) onClose();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal('milestones');
                if (onClose) onClose();
            }
        });
        
        document.body.appendChild(modal);
        this.modals.set('milestones', modal);
        
        return modal;
    }
    
    closeModal(name) {
        const modal = this.modals.get(name);
        if (modal) {
            modal.remove();
            this.modals.delete(name);
        }
    }
    
    clear() {
        this.modals.forEach(modal => modal.remove());
        this.modals.clear();
    }
}