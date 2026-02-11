import { IStorage } from '../interfaces/IStorage.js';

/**
 * Adaptador de almacenamiento para LocalStorage
 * Implementa la interfaz IStorage
 */
export class LocalStorageAdapter extends IStorage {
    constructor(prefix = 'app_') {
        super();
        this.prefix = prefix;
    }

    get(key, defaultValue = null) {
        try {
            const fullKey = this._getFullKey(key);
            const value = localStorage.getItem(fullKey);
            
            if (value === null) {
                return defaultValue;
            }

            return JSON.parse(value);
        } catch (error) {
            console.error(`Error al obtener ${key}:`, error);
            return defaultValue;
        }
    }

    set(key, value) {
        try {
            const fullKey = this._getFullKey(key);
            localStorage.setItem(fullKey, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error al guardar ${key}:`, error);
            return false;
        }
    }

    remove(key) {
        try {
            const fullKey = this._getFullKey(key);
            localStorage.removeItem(fullKey);
            return true;
        } catch (error) {
            console.error(`Error al eliminar ${key}:`, error);
            return false;
        }
    }

    has(key) {
        const fullKey = this._getFullKey(key);
        return localStorage.getItem(fullKey) !== null;
    }

    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('Error al limpiar storage:', error);
            return false;
        }
    }

    _getFullKey(key) {
        return `${this.prefix}${key}`;
    }
}
