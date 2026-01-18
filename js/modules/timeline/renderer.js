export class TimelineRenderer {
    // ... código anterior ...
    
    render(milestones) {
        this.clear();
        
        const containerHeight = this.container.clientHeight;
        const minSpacing = 100; // Espacio mínimo entre cards
        
        // Calcular posiciones con espaciado dinámico
        const positions = this.calculatePositions(milestones, containerHeight, minSpacing);
        
        milestones.forEach((milestone, index) => {
            const position = positions[index];
            const element = this.createMilestoneElement(milestone, index, position);
            this.container.appendChild(element);
            this.elements.set(milestone.id, element);
            
            // Añadir clase visible después de un delay para animación
            setTimeout(() => {
                element.classList.add('visible');
            }, index * 50);
        });
    }
    
    calculatePositions(milestones, containerHeight, minSpacing) {
        if (milestones.length === 0) return [];
        
        // Encontrar años mínimo y máximo
        const years = milestones.map(m => m.year);
        const minYear = Math.min(...years);
        const maxYear = Math.max(...years);
        const yearRange = maxYear - minYear || 100;
        
        // Calcular posiciones iniciales basadas en años
        const initialPositions = milestones.map(milestone => 
            ((milestone.year - minYear) / yearRange) * 90
        );
        
        // Ajustar posiciones para evitar solapamiento
        return this.adjustPositions(initialPositions, containerHeight, minSpacing);
    }
    
    adjustPositions(positions, containerHeight, minSpacing) {
        const adjusted = [...positions];
        const spacing = minSpacing / containerHeight * 100; // Convertir a porcentaje
        
        for (let i = 1; i < adjusted.length; i++) {
            if (adjusted[i] - adjusted[i - 1] < spacing) {
                adjusted[i] = adjusted[i - 1] + spacing;
            }
        }
        
        // Asegurar que no se salga del contenedor
        const maxPosition = Math.max(...adjusted);
        if (maxPosition > 90) {
            const scale = 90 / maxPosition;
            adjusted.forEach((pos, i) => {
                adjusted[i] = pos * scale;
            });
        }
        
        return adjusted;
    }
    
    createMilestoneElement(milestone, index, position) {
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
    
    // ... resto del código ...
}