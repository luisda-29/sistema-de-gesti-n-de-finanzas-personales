/**
 * Interfaz para estrategias de autenticación (Polimorfismo)
 * Define los métodos que toda estrategia de autenticación debe implementar
 */
export class IAuthStrategy {
    /**
     * Autentica un usuario
     * @param {Object} credentials - Credenciales de autenticación
     * @returns {Promise<Object>} Usuario autenticado o null
     */
    async authenticate(credentials) {
        throw new Error('Method not implemented');
    }

    /**
     * Registra un nuevo usuario
     * @param {Object} userData - Datos del usuario
     * @returns {Promise<Object>} Usuario creado o null
     */
    async register(userData) {
        throw new Error('Method not implemented');
    }

    /**
     * Valida las credenciales
     * @param {Object} credentials - Credenciales a validar
     * @returns {Boolean} true si son válidas
     */
    validateCredentials(credentials) {
        throw new Error('Method not implemented');
    }

    /**
     * Obtiene el nombre de la estrategia
     * @returns {String} Nombre de la estrategia
     */
    getStrategyName() {
        throw new Error('Method not implemented');
    }
}
