export function initEffects(enableParallax = true) {
    createStars();
    
    if (enableParallax) {
        setupParallax();
    }
    
    createParticles();
}

// Crear estrellas de fondo
function createStars() {
    const container = document.body;
    const starCount = 150;
    
    for (let i = 0; i < starCount; i++) {
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
        star.style.animationDuration = `${Math.random() * 2 + 1}s`;
        
        container.appendChild(star);
    }
}

// Efecto parallax
function setupParallax() {
    const stars = document.querySelectorAll('.star');
    
    document.addEventListener('mousemove', (e) => {
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

// Partículas flotantes
function createParticles() {
    const container = document.body;
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Tamaño y color
        const size = Math.random() * 4 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        const colors = ['#00ffff', '#ff00ff', '#ffff00', '#00ff00'];
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Posición inicial
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Animación flotante
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.animation = `
            float ${duration}s ease-in-out ${delay}s infinite alternate
        `;
        
        container.appendChild(particle);
    }
    
    // Añadir estilos CSS para partículas
    const style = document.createElement('style');
    style.textContent = `
        .particle {
            position: fixed;
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            opacity: 0.3;
            filter: blur(1px);
        }
        
        @keyframes float {
            0%, 100% {
                transform: translate(0, 0) rotate(0deg);
            }
            25% {
                transform: translate(20px, -30px) rotate(90deg);
            }
            50% {
                transform: translate(-15px, 20px) rotate(180deg);
            }
            75% {
                transform: translate(10px, -10px) rotate(270deg);
            }
        }
        
        @keyframes panelSlideIn {
            from {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
        }
        
        @keyframes panelSlideOut {
            from {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            to {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.8);
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Efecto de partículas al hacer clic
export function createClickParticles(x, y, color = '#00ffff') {
    const container = document.body;
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'click-particle';
        
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
            z-index: 10000;
        `;
        
        // Animación
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 50 + 20;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
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
            const currentX = x + vx * progress;
            const currentY = y + vy * progress;
            
            particle.style.opacity = opacity;
            particle.style.transform = `translate(${currentX}px, ${currentY}px)`;
            particle.style.width = `${4 * (1 - progress)}px`;
            particle.style.height = `${4 * (1 - progress)}px`;
            
            requestAnimationFrame(animate);
        }
        
        container.appendChild(particle);
        requestAnimationFrame(animate);
    }
}

// Añadir efecto de partículas a los hitos
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', (e) => {
        if (e.target.closest('.milestone')) {
            createClickParticles(e.clientX, e.clientY, '#00ffff');
        }
    });
});