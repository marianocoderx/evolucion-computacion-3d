export function initEffects(enableParallax = true) {
    createStars();
    
    if (enableParallax) {
        setupParallax();
    }
    
    setupClickEffects();
}

function createStars() {
    const container = document.body;
    
    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Tamaño aleatorio
        const size = Math.random() * 3 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Posición aleatoria
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Opacidad y animación
        star.style.opacity = Math.random() * 0.7 + 0.3;
        star.style.animationDelay = `${Math.random() * 3}s`;
        
        container.appendChild(star);
    }
}

function setupParallax() {
    const stars = document.querySelectorAll('.star');
    
    window.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        stars.forEach((star, index) => {
            const speed = (index % 3 + 1) * 0.3;
            const x = (mouseX * speed * 100) - 50;
            const y = (mouseY * speed * 100) - 50;
            
            star.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

function setupClickEffects() {
    document.addEventListener('click', (e) => {
        if (e.target.closest('.milestone')) {
            createClickParticles(e.clientX, e.clientY);
        }
    });
}

function createClickParticles(x, y) {
    const container = document.body;
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'click-particle';
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Animación de partículas
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 50 + 20;
        
        let opacity = 1;
        const duration = 800;
        const startTime = Date.now();
        
        function animate() {
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
            particle.style.height = `${4 * (1 - progress)}px`;
            
            requestAnimationFrame(animate);
        }
        
        container.appendChild(particle);
        requestAnimationFrame(animate);
    }
}