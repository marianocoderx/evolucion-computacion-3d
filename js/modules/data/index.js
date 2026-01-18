import { DataLoader } from './loader.js';
import { DataValidator } from './validator.js';
import { BackupData } from './backup.js';
import { Logger } from '../../utils/logger.js';

export class DataManager {
    constructor(url) {
        this.loader = new DataLoader(url);
        this.milestones = [];
    }
    
    async load() {
        try {
            Logger.info('Cargando datos...');
            
            const rawData = await this.loader.load();
            this.milestones = DataValidator.validate(rawData);
            this.sortByYear();
            
            Logger.success(`${this.milestones.length} hitos cargados`);
            return this.milestones;
            
        } catch (error) {
            Logger.error('Error cargando datos, usando respaldo', error);
            this.milestones = BackupData.get();
            return this.milestones;
        }
    }
    
    sortByYear() {
        this.milestones.sort((a, b) => a.year - b.year);
    }
    
    getById(id) {
        return this.milestones.find(m => m.id == id);
    }
    
    getByCategory(category) {
        return this.milestones.filter(m => m.category === category);
    }
    
    getStats() {
        const categories = [...new Set(this.milestones.map(m => m.category))];
        const years = this.milestones.map(m => m.year);
        
        return {
            total: this.milestones.length,
            categories,
            yearRange: {
                min: Math.min(...years),
                max: Math.max(...years)
            },
            withVideo: this.milestones.filter(m => m.video).length
        };
    }
}