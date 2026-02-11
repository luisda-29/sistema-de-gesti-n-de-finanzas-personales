/**
 * Gestor centralizado de almacenamiento
 * Actúa como intermediario entre la aplicación y el adaptador de almacenamiento
 */
export class StorageManager {
    constructor(storageAdapter) {
        this.adapter = storageAdapter;
    }

    /**
     * Obtiene todos los usuarios
     */
    getUsers() {
        return this.adapter.get('users', []);
    }

    /**
     * Guarda los usuarios
     */
    saveUsers(users) {
        return this.adapter.set('users', users);
    }

    /**
     * Obtiene el usuario actual
     */
    getCurrentUser() {
        return this.adapter.get('currentUser', null);
    }

    /**
     * Establece el usuario actual
     */
    setCurrentUser(user) {
        return this.adapter.set('currentUser', user);
    }

    /**
     * Obtiene las categorías de un usuario
     */
    getCategories(userId) {
        const key = `categories_${userId}`;
        return this.adapter.get(key, []);
    }

    /**
     * Guarda las categorías de un usuario
     */
    saveCategories(userId, categories) {
        const key = `categories_${userId}`;
        return this.adapter.set(key, categories);
    }

    /**
     * Limpia la sesión del usuario actual
     */
    clearSession() {
        return this.adapter.remove('currentUser');
    }

    /**
     * Limpia todo (cuidado al usar)
     */
    clearAll() {
        return this.adapter.clear();
    }
}
