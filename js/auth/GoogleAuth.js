/**
 * Ejemplo de extensión: Autenticación con Google
 * Este archivo demuestra cómo agregar autenticación con redes sociales
 */

import { IAuthStrategy } from '../interfaces/IAuthStrategy.js';

/**
 * Estrategia de autenticación con Google
 * Implementa IAuthStrategy para que sea compatible con AuthManager
 */
export class GoogleAuth extends IAuthStrategy {
    constructor(storageManager, googleClientId) {
        super();
        this.storage = storageManager;
        this.googleClientId = googleClientId;
        this.isGoogleAPIReady = false;
    }

    /**
     * Inicializa la API de Google
     */
    async initGoogleAPI() {
        if (this.isGoogleAPIReady) return;

        // En tiempo real, cargar la API de Google
        // await this._loadGoogleScript();
        
        this.isGoogleAPIReady = true;
        console.log('✓ Google API inicializado');
    }

    /**
     * Autentica con token de Google
     */
    async authenticate(credentials) {
        if (!this.validateCredentials(credentials)) {
            return null;
        }

        try {
            // Simular verificación de token con Google
            const googleProfile = await this._verifyGoogleToken(credentials.token);
            
            if (!googleProfile) {
                return null;
            }

            // Buscar o crear usuario
            let user = this._findUserByEmail(googleProfile.email);
            
            if (!user) {
                user = await this._createUserFromGoogleProfile(googleProfile);
            }

            return user;
        } catch (error) {
            console.error('Error en autenticación Google:', error);
            return null;
        }
    }

    /**
     * Registra un nuevo usuario usando Google
     */
    async register(userData) {
        if (!this.validateCredentials(userData)) {
            throw new Error('Token de Google requerido');
        }

        try {
            const googleProfile = await this._verifyGoogleToken(userData.token);
            
            if (!googleProfile) {
                throw new Error('Token de Google inválido');
            }

            const existingUser = this._findUserByEmail(googleProfile.email);
            if (existingUser) {
                throw new Error('Usuario ya registrado con este email');
            }

            return await this._createUserFromGoogleProfile(googleProfile);
        } catch (error) {
            console.error('Error en registro Google:', error);
            throw error;
        }
    }

    /**
     * Valida las credenciales para Google
     */
    validateCredentials(credentials) {
        return credentials && 
               credentials.token && 
               typeof credentials.token === 'string' &&
               credentials.token.length > 0;
    }

    /**
     * Desconecta el usuario de Google
     */
    async disconnect(userId) {
        const users = this.storage.get('users', []);
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex !== -1) {
            users[userIndex].googleConnected = false;
            users[userIndex].googleId = null;
            this.storage.set('users', users);
            console.log(`✓ Desconexión de Google completada para usuario ${userId}`);
        }
    }

    // ========== MÉTODOS PRIVADOS ==========

    /**
     * Verifica el token con Google (simulado)
     */
    async _verifyGoogleToken(token) {
        // En producción, hacer llamada a Google API
        // fetch('https://www.googleapis.com/oauth2/v1/userinfo?access_token=' + token)
        
        // Simulación para desarrollo
        if (token.startsWith('google_token_')) {
            return {
                id: 'google_' + Date.now(),
                email: 'usuario@gmail.com',
                name: 'Usuario Google',
                picture: 'https://via.placeholder.com/150'
            };
        }

        return null;
    }

    /**
     * Busca usuario por email
     */
    _findUserByEmail(email) {
        const users = this.storage.get('users', []);
        return users.find(u => u.email === email) || null;
    }

    /**
     * Crea usuario a partir del perfil de Google
     */
    async _createUserFromGoogleProfile(googleProfile) {
        const users = this.storage.get('users', []);

        const newUser = {
            id: Date.now().toString(),
            email: googleProfile.email,
            name: googleProfile.name,
            picture: googleProfile.picture,
            googleId: googleProfile.id,
            googleConnected: true,
            createdAt: new Date().toISOString(),
            authStrategy: this.getStrategyName(),
            // No tiene password en autenticación social
            password: null
        };

        users.push(newUser);
        this.storage.set('users', users);

        console.log(`✓ Usuario creado con Google: ${newUser.email}`);
        return newUser;
    }

    /**
     * Carga el script de Google dinámicamente (simulado)
     */
    async _loadGoogleScript() {
        return new Promise((resolve, reject) => {
            // En tiempo real, cargar: https://accounts.google.com/gsi/client
            console.log('Cargando Google API...');
            
            // Simulación
            setTimeout(() => resolve(true), 1000);
        });
    }

    getStrategyName() {
        return 'google-auth';
    }
}

// ========== EJEMPLO DE USO ==========

/*
import { GoogleAuth } from './auth/GoogleAuth.js';

const googleAuth = new GoogleAuth(storageManager, 'YOUR_GOOGLE_CLIENT_ID');

// Inicializar
await googleAuth.initGoogleAPI();

// Registrar con Google
const usuario = await authManager.register({
    token: 'google_token_abc123xyz'
});

console.log('Usuario registrado con Google:', usuario);

// Iniciar sesión con Google
const credenciales = {
    token: 'google_token_abc123xyz'
};

authManager.setStrategy(googleAuth);
const usuarioAutenticado = await authManager.login(credenciales);
console.log('Usuario autenticado con Google:', usuarioAutenticado);

// Desconectar Google
await googleAuth.disconnect('user-id-123');
*/
