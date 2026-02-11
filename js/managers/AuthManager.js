/**
 * Gestor de autenticación
 * Maneja las operaciones de autenticación usando diferentes estrategias (polimorfismo)
 */
export class AuthManager {
    constructor(storageManager) {
        this.storage = storageManager;
        this.currentStrategy = null;
    }

    /**
     * Establece la estrategia de autenticación
     * @param {IAuthStrategy} strategy - Estrategia a usar
     */
    setStrategy(strategy) {
        this.currentStrategy = strategy;
        console.log(`Estrategia de autenticación establecida: ${strategy.getStrategyName()}`);
    }

    /**
     * Autentica un usuario con la estrategia actual
     * @param {Object} credentials - Credenciales
     * @returns {Promise<Object|null>} Usuario o null
     */
    async login(credentials) {
        if (!this.currentStrategy) {
            throw new Error('No hay estrategia de autenticación establecida');
        }

        try {
            const user = await this.currentStrategy.authenticate(credentials);
            
            if (user) {
                this.storage.setCurrentUser(user);
                console.log(`✓ Usuario autenticado: ${user.email}`);
            }
            
            return user;
        } catch (error) {
            console.error('Error en login:', error);
            return null;
        }
    }

    /**
     * Registra un nuevo usuario
     * @param {Object} userData - Datos del usuario
     * @returns {Promise<Object|null>} Usuario creado o null
     */
    async register(userData) {
        if (!this.currentStrategy) {
            throw new Error('No hay estrategia de autenticación establecida');
        }

        try {
            const user = await this.currentStrategy.register(userData);
            console.log(`✓ Usuario registrado: ${user.email}`);
            return user;
        } catch (error) {
            console.error('Error en registro:', error.message);
            throw error;
        }
    }

    /**
     * Cierra sesión del usuario actual
     */
    logout() {
        this.storage.clearSession();
        console.log('✓ Sesión cerrada');
    }

    /**
     * Obtiene el usuario actual
     */
    getCurrentUser() {
        return this.storage.getCurrentUser();
    }

    /**
     * Verifica si hay usuario autenticado
     */
    isAuthenticated() {
        return this.storage.getCurrentUser() !== null;
    }
}
