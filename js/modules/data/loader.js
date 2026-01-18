export class DataLoader {
    constructor(url) {
        this.url = url;
    }
    
    async load() {
        try {
            const response = await fetch(this.url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (!Array.isArray(data)) {
                throw new Error('El JSON debe contener un array de hitos');
            }
            
            return data;
            
        } catch (error) {
            throw new Error(`Error cargando datos: ${error.message}`);
        }
    }
}