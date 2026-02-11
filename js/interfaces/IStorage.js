/**
 * Interfaz para adaptadores de almacenamiento
 * Define los métodos que todo almacenamiento debe implementar
 */
export class IStorage {
    /**
     * Obtiene un valor por clave
     * @param {String} key - Clave
     * @param {*} defaultValue - Valor por defecto si no existe
     * @returns {*} Valor almacenado
     */
    get(key, defaultValue = null) {
        throw new Error('Method not implemented');
    }

    /**
     * Guarda un valor
     * @param {String} key - Clave
     * @param {*} value - Valor a guardar
     * @returns {Boolean} true si se guardó correctamente
     */
    set(key, value) {
        throw new Error('Method not implemented');
    }

    /**
     * Elimina un valor
     * @param {String} key - Clave
     * @returns {Boolean} true si se eliminó
     */
    remove(key) {
        throw new Error('Method not implemented');
    }

    /**
     * Verifica si existe una clave
     * @param {String} key - Clave
     * @returns {Boolean} true si existe
     */
    has(key) {
        throw new Error('Method not implemented');
    }

    /**
     * Limpia todo el almacenamiento
     * @returns {Boolean} true si se limpió
     */
    clear() {
        throw new Error('Method not implemented');
    }
}
