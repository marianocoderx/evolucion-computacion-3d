import { StarsEffect } from './stars.js';
import { ParticlesEffect } from './particles.js';

export class EffectsManager {
    constructor(config) {
        this.stars = new StarsEffect(config.STAR_COUNT);
        this.particles = new ParticlesEffect();
        this.enableParallax = config.ENABLE_PARALLAX;
    }
    
    initialize() {
        this.stars.create();
        
        if (this.enableParallax) {
            this.stars.setupParallax();
        }
        
        this.setupClickEffects();
    }
    
    setupClickEffects() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.milestone')) {
                this.particles.createClickEffect(e.clientX, e.clientY);
            }
        });
    }
    
    destroy() {
        this.stars.destroy();
    }
}