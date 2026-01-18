export class Logger {
    static info(message, data = null) {
        console.log(`ℹ️ ${message}`, data || '');
    }
    
    static success(message, data = null) {
        console.log(`✅ ${message}`, data || '');
    }
    
    static error(message, error = null) {
        console.error(`❌ ${message}`, error || '');
    }
    
    static warn(message, data = null) {
        console.warn(`⚠️ ${message}`, data || '');
    }
    
    static group(title, callback) {
        console.group(title);
        callback();
        console.groupEnd();
    }
}