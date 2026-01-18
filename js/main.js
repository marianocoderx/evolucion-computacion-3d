// Configuración global
const CONFIG = {
    jsonUrl: './events-computing.json',
    autoShowFirst: true,
    enableParallax: true,
    enableKeyboard: true,
    debugMode: false
};

// Variables globales
let app = null;
let milestonesData = [];
let panel = null;

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando Computer History Galaxy...');
    
    try {
        showLoading();
        milestonesData = await loadJSONData(CONFIG.jsonUrl);
        await initializeModules();
        setupControls();
        hideLoading();
        
        console.log('✅ Aplicación lista con', milestonesData.length, 'hitos');
        
    } catch (error) {
        console.error('❌ Error fatal:', error);
        showError(`Error: ${error.message}`);
    }
});

// ================= FUNCIONES PRINCIPALES =================

async function loadJSONData(url) {
    try {
        console.log(`📡 Cargando datos desde: ${url}`);
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
            throw new Error('El JSON debe contener un array de hitos');
        }
        
        const validatedData = validateData(data);
        validatedData.sort((a, b) => a.year - b.year);
        
        console.log(`✅ ${validatedData.length} hitos cargados y validados`);
        return validatedData;
        
    } catch (error) {
        console.error('Error cargando JSON:', error);
        return getBackupData();
    }
}

function validateData(data) {
    return data.map((item, index) => {
        const validated = { ...item };
        
        if (!validated.id) validated.id = index + 1;
        if (!validated.title) validated.title = `Hito ${validated.id}`;
        if (!validated.year) validated.year = 1900 + index * 10;
        if (!validated.description) validated.description = 'Descripción no disponible.';
        if (!validated.category) validated.category = 'General';
        
        if (!validated.image) {
            validated.image = getPlaceholderImage(validated.title);
        }
        
        return validated;
    });
}

async function initializeModules() {
    // Importar módulos
    const modules = await Promise.all([
        import('./timeline.js'),
        import('./panel.js'),
        import('./effects.js')
    ]);
    
    const [TimelineModule, PanelModule, EffectsModule] = modules;
    
    // Inicializar efectos
    EffectsModule.initEffects(CONFIG.enableParallax);
    
    // Inicializar timeline
    app = new TimelineModule.TimelineApp(milestonesData, {
        onMilestoneClick: (milestone) => {
            panel.show(milestone);
            updateUrl(milestone.id);
        },
        enableKeyboard: CONFIG.enableKeyboard
    });
    
    // Inicializar panel
    panel = new PanelModule.PanelManager();
    window.panel = panel;
    
    // Mostrar hito desde URL hash
    const hashId = getHashId();
    if (hashId) {
        const milestone = milestonesData.find(m => m.id == hashId);
        if (milestone) {
            setTimeout(() => panel.show(milestone), 1000);
        }
    }
    
    // Mostrar estadísticas
    logStatistics(milestonesData);
}

function setupControls() {
    createControlButton('🔄 Recargar', 'reload-btn', 'bottom: 20px; right: 20px;', () => location.reload());
    createControlButton('📋 Lista', 'list-btn', 'bottom: 60px; right: 20px;', showMilestonesList);
    
    if (CONFIG.debugMode) {
        createDebugInfo();
    }
}

// ================= FUNCIONES DE UI =================

function createControlButton(text, id, style, onClick) {
    const button = document.createElement('button');
    button.id = id;
    button.className = 'control-btn';
    button.textContent = text;
    button.style.cssText = style;
    button.addEventListener('click', onClick);
    document.body.appendChild(button);
}

function createDebugInfo() {
    const debugInfo = document.createElement('div');
    debugInfo.className = 'debug-info';
    debugInfo.innerHTML = `
        <div>Hitos: ${milestonesData.length}</div>
        <div>Años: ${milestonesData[0]?.year} - ${milestonesData[milestonesData.length-1]?.year}</div>
    `;
    document.body.appendChild(debugInfo);
}

function showMilestonesList() {
    const modal = document.createElement('div');
    modal.className = 'milestones-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <h3>📜 Todos los hitos (${milestonesData.length})</h3>
            <div class="milestones-list">
                ${milestonesData.map(milestone => `
                    <div class="milestone-item" data-id="${milestone.id}">
                        <span class="year">${milestone.year}</span>
                        <span class="title">${milestone.title}</span>
                        <span class="category">${milestone.category}</span>
                    </div>
                `).join('')}
            </div>
            <button class="close-modal-btn">Cerrar</button>
        </div>
    `;
    
    // Eventos para los elementos de la lista
    modal.querySelectorAll('.milestone-item').forEach(item => {
        item.addEventListener('click', () => {
            const id = parseInt(item.dataset.id);
            const milestone = milestonesData.find(m => m.id === id);
            if (milestone && panel) {
                panel.show(milestone);
                modal.remove();
            }
        });
    });
    
    // Evento para cerrar el modal
    modal.querySelector('.close-modal-btn').addEventListener('click', () => {
        modal.remove();
    });
    
    // Cerrar al hacer clic fuera
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    document.body.appendChild(modal);
}

// ================= FUNCIONES UTILITARIAS =================

function showLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'block';
    }
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.add('hidden');
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);
    }
}

function showError(message) {
    hideLoading();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-overlay';
    
    errorDiv.innerHTML = `
        <div class="error-content">
            <h3>⚠️ Error</h3>
            <p>${message}</p>
            <button class="retry-btn">Reintentar</button>
        </div>
    `;
    
    errorDiv.querySelector('.retry-btn').addEventListener('click', () => location.reload());
    document.body.appendChild(errorDiv);
}

function updateUrl(milestoneId) {
    const newUrl = `${window.location.pathname}#${milestoneId}`;
    window.history.pushState({}, '', newUrl);
}

function getHashId() {
    return window.location.hash.substring(1);
}

function getPlaceholderImage(title) {
    const encodedTitle = encodeURIComponent(title);
    return `https://via.placeholder.com/400x300/0a0a1a/00ffff?text=${encodedTitle}`;
}

function logStatistics(data) {
    const categories = [...new Set(data.map(m => m.category))];
    const years = data.map(m => m.year);
    
    console.group('📊 Estadísticas de hitos');
    console.log('Total:', data.length);
    console.log('Categorías:', categories);
    console.log('Rango de años:', Math.min(...years), '-', Math.max(...years));
    console.log('Con video:', data.filter(m => m.video).length);
    console.groupEnd();
}

function getBackupData() {
    console.warn('⚠️ Usando datos de respaldo');
    return [
        {
            id: 1,
            title: "ENIAC – Primera computadora electrónica programable",
            year: 1945,
            description: "La primera computadora digital electrónica de propósito general.",
            image: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Eniac.jpg",
            video: "dQw4w9WgXcQ",
            category: "Hardware"
        }
    ];
}

// Hacer datos accesibles globalmente
window.milestonesData = milestonesData;
window.app = app;