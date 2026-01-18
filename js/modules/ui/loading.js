export class LoadingManager {
    constructor() {
        this.loadingElement = document.getElementById('loading');
    }
    
    show(message = 'Cargando...') {
        if (this.loadingElement) {
            this.loadingElement.style.display = 'block';
            const textElement = this.loadingElement.querySelector('p');
            if (textElement) {
                textElement.textContent = message;
            }
        }
    }
    
    hide() {
        if (this.loadingElement) {
            this.loadingElement.classList.add('hidden');
            setTimeout(() => {
                this.loadingElement.style.display = 'none';
                this.loadingElement.classList.remove('hidden');
            }, 500);
        }
    }
    
    setMessage(message) {
        if (this.loadingElement) {
            const textElement = this.loadingElement.querySelector('p');
            if (textElement) {
                textElement.textContent = message;
            }
        }
    }
}