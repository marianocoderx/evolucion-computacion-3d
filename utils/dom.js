export class DOMUtils {
    static createElement(tag, className = '', attributes = {}, innerHTML = '') {
        const element = document.createElement(tag);
        if (className) element.className = className;
        
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
        
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    }
    
    static removeElement(selector) {
        const element = document.querySelector(selector);
        if (element) element.remove();
    }
    
    static addEvent(element, event, handler) {
        element.addEventListener(event, handler);
        return () => element.removeEventListener(event, handler);
    }
    
    static showElement(selector) {
        const element = document.querySelector(selector);
        if (element) element.style.display = 'block';
    }
    
    static hideElement(selector) {
        const element = document.querySelector(selector);
        if (element) element.style.display = 'none';
    }
}