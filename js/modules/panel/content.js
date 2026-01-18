export class PanelContent {
    static generate(milestone) {
        return `
            <div class="panel-header">
                <h2>${this.escapeHTML(milestone.title)}</h2>
                <button class="btn close-btn">×</button>
            </div>
            <div class="panel-content">
                <div class="panel-left">
                    <img src="${this.escapeHTML(milestone.image)}" 
                         alt="${this.escapeHTML(milestone.title)}" 
                         class="panel-image"
                         onerror="this.src='${this.getPlaceholder(milestone.title)}'">
                    <div class="category">${this.escapeHTML(milestone.category)}</div>
                </div>
                <div class="panel-right">
                    <p class="panel-description">${this.escapeHTML(milestone.description)}</p>
                    <p><strong>Año:</strong> <span class="year">${milestone.year}</span></p>
                    ${milestone.video ? this.generateVideoHTML(milestone.video) : ''}
                </div>
            </div>
        `;
    }
    
    static generateVideoHTML(videoId) {
        return `
            <div class="video-section">
                <p><strong>🎥 Video relacionado:</strong></p>
                <a href="https://youtube.com/watch?v=${videoId}" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   class="video-link">
                   ▶️ Ver en YouTube
                </a>
            </div>
        `;
    }
    
    static escapeHTML(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    static getPlaceholder(title) {
        const encodedTitle = encodeURIComponent(title.substring(0, 20));
        return `https://via.placeholder.com/400x300/0a0a1a/00ffff?text=${encodedTitle}`;
    }
}