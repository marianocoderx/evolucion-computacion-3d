export class TimelineNavigation {
    constructor(milestones) {
        this.milestones = milestones;
    }
    
    getById(id) {
        return this.milestones.find(m => m.id == id);
    }
    
    getCurrentIndex(currentId) {
        return this.milestones.findIndex(m => m.id === currentId);
    }
    
    navigate(currentId, direction) {
        const currentIndex = this.getCurrentIndex(currentId);
        if (currentIndex === -1) return this.milestones[0];
        
        let newIndex;
        
        switch(direction) {
            case 'next':
            case 'down':
                newIndex = (currentIndex + 1) % this.milestones.length;
                break;
            case 'prev':
            case 'up':
                newIndex = (currentIndex - 1 + this.milestones.length) % this.milestones.length;
                break;
            case 'first':
                newIndex = 0;
                break;
            case 'last':
                newIndex = this.milestones.length - 1;
                break;
            default:
                return null;
        }
        
        return this.milestones[newIndex];
    }
    
    getFirst() {
        return this.milestones[0];
    }
    
    getLast() {
        return this.milestones[this.milestones.length - 1];
    }
}