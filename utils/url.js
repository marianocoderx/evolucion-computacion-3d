export class UrlUtils {
    static getHashId() {
        return window.location.hash.substring(1);
    }
    
    static updateUrl(milestoneId) {
        const newUrl = `${window.location.pathname}#${milestoneId}`;
        window.history.pushState({}, '', newUrl);
    }
    
    static getUrlParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }
}