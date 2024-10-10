export function localStorageSet(key: string, value: string|number|boolean|object) {
    try{
        const localStorage: Storage= window.localStorage;
        localStorage.setItem(key, JSON.stringify(value));
        return !!localStorage.getItem(key);
    }catch {
        return false;
    }
}

export function localStorageGet(key: string) {
        const localStorage: Storage= window.localStorage;
        return localStorage.getItem(key) ?? false;
}

export function localStorageClear(key: string) {
    const localStorage: Storage= window.localStorage;
    return localStorage.removeItem(key);
}