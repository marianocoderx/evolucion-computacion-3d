export class DataValidator {
    static validate(data) {
        return data.map((item, index) => this.validateItem(item, index));
    }
    
    static validateItem(item, index) {
        const validated = { ...item };
        
        // Asignar valores por defecto
        validated.id = validated.id || index + 1;
        validated.title = validated.title || `Hito ${validated.id}`;
        validated.year = validated.year || 1900 + index * 10;
        validated.description = validated.description || 'Descripción no disponible.';
        validated.category = validated.category || 'General';
        
        // Imagen placeholder si no existe
        if (!validated.image) {
            validated.image = this.generatePlaceholder(validated.title);
        }
        
        return validated;
    }
    
    static generatePlaceholder(title) {
        const encodedTitle = encodeURIComponent(title.substring(0, 20));
        return `https://via.placeholder.com/400x300/0a0a1a/00ffff?text=${encodedTitle}`;
    }
}