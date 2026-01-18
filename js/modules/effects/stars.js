export class StarsEffect {
    constructor(count = 150) {
        this.count = count;
        this.stars = [];
    }
    
    create() {
        const container = document.body;
        
        for (let i = 0; i < this.count; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Propiedades aleatorias
            const size = Math.random() * 3 + 1;
            const opacity = Math.random() * 0.7 + 0.3;
            
            star.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${opacity};
                animation-delay: ${Math.random() * 3}s;
            `;
            
            container.appendChild(star);
            this.stars.push(star);
        }
    }
    
    setupParallax() {
        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            
            this.stars.forEach((star, index) => {
                const speed = (index % 3 + 1) * 0.3;
                const x = (mouseX * speed * 100) - 50;
                const y = (mouseY * speed * 100) - 50;
                
                star.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }
    
    destroy() {
        this.stars.forEach(star => star.remove());
        this.stars = [];
    }
}