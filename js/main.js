// Configuración global
const CONFIG = {
    jsonUrl: './events-computing.json',  // Ruta a tu JSON
    autoShowFirst: true,
    enableParallax: true,
    enableKeyboard: true,
    debugMode: false
};

// Variables globales
let app = null;
let milestonesData = [];

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Iniciando Computer History Galaxy...');
    
    try {
        // Mostrar loading
        showLoading();
        
        // 1. Cargar datos JSON
        milestonesData = await loadJSONData(CONFIG.jsonUrl);
        
        // 2. Inicializar módulos
        await initializeModules();
        
        // 3. Configurar controles
        setupControls();
        
        // 4. Ocultar loading
        hideLoading();
        
        console.log('✅ Aplicación lista con', milestonesData.length, 'hitos');
        
    } catch (error) {
        console.error('❌ Error fatal:', error);
        showError(`Error: ${error.message}`);
    }
});

// ================= FUNCIONES PRINCIPALES =================

// Cargar datos desde JSON
async function loadJSONData(url) {
    try {
        console.log(`📡 Cargando datos desde: ${url}`);
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Validar que sea un array
        if (!Array.isArray(data)) {
            throw new Error('El JSON debe contener un array de hitos');
        }
        
        // Validar estructura mínima
        const validatedData = data.map((item, index) => {
            // Asignar ID si no existe
            if (!item.id) item.id = index + 1;
            
            // Validar campos requeridos
            if (!item.title) item.title = `Hito ${item.id}`;
            if (!item.year) item.year = 1900 + index * 10;
            if (!item.description) item.description = 'Descripción no disponible.';
            if (!item.category) item.category = 'General';
            
            // Si no tiene imagen, usar placeholder
            if (!item.image) {
                item.image = `https://via.placeholder.com/400x300/0a0a1a/00ffff?text=${encodeURIComponent(item.title)}`;
            }
            
            return item;
        });
        
        // Ordenar por año
        validatedData.sort((a, b) => a.year - b.year);
        
        console.log(`✅ ${validatedData.length} hitos cargados y validados`);
        return validatedData;
        
    } catch (error) {
        console.error('Error cargando JSON:', error);
        
        // Datos de respaldo si falla
        return getBackupData();
    }
}

// Inicializar módulos
async function initializeModules() {
    // Importar módulos dinámicamente
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
            // Mostrar en panel
            const panel = new PanelModule.PanelManager();
            panel.show(milestone);
            
            // Actualizar URL para compartir
            updateUrl(milestone.id);
        },
        enableKeyboard: CONFIG.enableKeyboard
    });
    
    // Configurar panel
    const panel = new PanelModule.PanelManager();
    window.panel = panel; // Hacer accesible globalmente
    
    // Si hay hash en la URL, mostrar ese hito
    const hashId = getHashId();
    if (hashId) {
        const milestone = milestonesData.find(m => m.id == hashId);
        if (milestone) {
            setTimeout(() => panel.show(milestone), 1000);
        }
    }
    
    // Mostrar estadísticas en consola
    logStatistics(milestonesData);
}

// Configurar controles UI
function setupControls() {
    // Botón para recargar datos
    const reloadBtn = document.createElement('button');
    reloadBtn.className = 'btn control-btn';
    reloadBtn.innerHTML = '🔄 Recargar';
    reloadBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 100;
    `;
    reloadBtn.onclick = () => location.reload();
    document.body.appendChild(reloadBtn);
    
    // Botón para mostrar todos los hitos
    const listBtn = document.createElement('button');
    listBtn.className = 'btn control-btn';
    listBtn.innerHTML = '📋 Lista';
    listBtn.style.cssText = `
        position: fixed;
        bottom: 60px;
        right: 20px;
        z-index: 100;
    `;
    listBtn.onclick = showMilestonesList;
    document.body.appendChild(listBtn);
    
    // Info debug
    if (CONFIG.debugMode) {
        const debugInfo = document.createElement('div');
        debugInfo.className = 'debug-info';
        debugInfo.innerHTML = `
            <div>Hitos: ${milestonesData.length}</div>
            <div>Años: ${milestonesData[0]?.year} - ${milestonesData[milestonesData.length-1]?.year}</div>
        `;
        debugInfo.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0,0,0,0.7);
            color: #00ff00;
            padding: 10px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 12px;
            z-index: 1000;
        `;
        document.body.appendChild(debugInfo);
    }
}

// ================= FUNCIONES UTILITARIAS =================

// Mostrar lista de hitos
function showMilestonesList() {
    const listHTML = milestonesData.map(milestone => `
        <div class="milestone-item" data-id="${milestone.id}" 
             onclick="window.panel.show(window.milestonesData.find(m => m.id == ${milestone.id}))">
            <span class="year">${milestone.year}</span>
            <span class="title">${milestone.title}</span>
            <span class="category">${milestone.category}</span>
        </div>
    `).join('');
    
    const modal = document.createElement('div');
    modal.className = 'milestones-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>📜 Todos los hitos (${milestonesData.length})</h3>
            <div class="milestones-list">${listHTML}</div>
            <button class="btn" onclick="this.parentElement.parentElement.remove()">Cerrar</button>
        </div>
    `;
    
    // Añadir estilos
    const style = document.createElement('style');
    style.textContent = `
        .milestones-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.9);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
        }
        .modal-content {
            background: rgba(10,10,30,0.95);
            border: 2px solid #00ffff;
            border-radius: 15px;
            padding: 30px;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            color: white;
        }
        .milestones-list {
            margin: 20px 0;
        }
        .milestone-item {
            padding: 12px;
            margin: 8px 0;
            background: rgba(255,255,255,0.05);
            border-radius: 8px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 15px;
            transition: all 0.3s;
        }
        .milestone-item:hover {
            background: rgba(0,255,255,0.1);
            transform: translateX(5px);
        }
        .milestone-item .year {
            background: rgba(0,255,255,0.2);
            padding: 4px 12px;
            border-radius: 20px;
            font-weight: bold;
            min-width: 70px;
            text-align: center;
        }
        .milestone-item .title {
            flex: 1;
        }
        .milestone-item .category {
            background: rgba(255,0,255,0.2);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.9em;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
}

// Actualizar URL con hash
function updateUrl(milestoneId) {
    const newUrl = `${window.location.pathname}#${milestoneId}`;
    window.history.pushState({}, '', newUrl);
}

// Obtener ID del hash
function getHashId() {
    return window.location.hash.substring(1);
}

// Mostrar loading
function showLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.style.display = 'block';
        loading.innerHTML = `
            <div class="spinner"></div>
            <div>Cargando galaxia de hitos...</div>
        `;
        
        // Añadir estilo para spinner
        const style = document.createElement('style');
        style.textContent = `
            .spinner {
                border: 4px solid rgba(0,255,255,0.3);
                border-top: 4px solid #00ffff;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                animation: spin 1s linear infinite;
                margin: 0 auto 15px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Ocultar loading
function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.add('hidden');
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);
    }
}

// Mostrar error
function showError(message) {
    hideLoading();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-overlay';
    errorDiv.innerHTML = `
        <div class="error-content">
            <h3>⚠️ Error</h3>
            <p>${message}</p>
            <p>Usando datos de respaldo...</p>
            <button class="btn" onclick="location.reload()">Reintentar</button>
        </div>
    `;
    
    errorDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.95);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    
    document.body.appendChild(errorDiv);
}

// Log estadísticas
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

// Datos de respaldo
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