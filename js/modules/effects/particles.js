export class ParticlesEffect {
    createClickEffect(x, y, color = '#00ffff') {
        const container = document.body;
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'click-particle';
            particle.style.cssText = `
                left: ${x}px;
                top: ${y}px;
                background: ${color};
            `;
            
            // Animación
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 50 + 20;
            
            let opacity = 1;
            const duration = 800;
            const startTime = Date.now();
            
            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                if (progress >= 1) {
                    particle.remove();
                    return;
                }
                
                opacity = 1 - progress;
                const currentX = x + Math.cos(angle) * speed * progress;
                const currentY = y + Math.sin(angle) * speed * progress;
                
                particle.style.opacity = opacity;
                particle.style.transform = `translate(${currentX - x}px, ${currentY - y}px)`;
                particle.style.width = `${4 * (1 - progress)}px`;
                particle.style.height = particle.style.width;
                
                requestAnimationFrame(animate);
            };
            
            container.appendChild(particle);
            requestAnimationFrame(animate);
        }
    }
}