import { IAuthStrategy } from '../interfaces/IAuthStrategy.js';

/**
 * Implementación de autenticación por Email y Contraseña
 * Implementa la interfaz IAuthStrategy
 */
export class EmailPasswordAuth extends IAuthStrategy {
    constructor(storageManager) {
        super();
        this.storage = storageManager;
        this.minPasswordLength = 6;
    }

    async authenticate(credentials) {
        if (!this.validateCredentials(credentials)) {
            return null;
        }

        const users = this.storage.getUsers();
        const user = users.find(u => u.email === credentials.email && u.password === credentials.password);

        return user || null;
    }

    async register(userData) {
        if (!this._validateRegistration(userData)) {
            return null;
        }

        const users = this.storage.getUsers();

        // Verificar si el email ya está registrado
        if (users.find(u => u.email === userData.email)) {
            throw new Error('Email ya registrado');
        }

        // Calcular el próximo ID secuencial disponible (1, 2, 3...)
        let nextId = 1;
        while (users.some(u => u.id === nextId.toString())) {
            nextId++;
        }

        const newUser = {
            id: nextId.toString(),
            name: userData.name,
            email: userData.email,
            password: userData.password, // En producción usar hash
            createdAt: new Date().toISOString(),
            authStrategy: this.getStrategyName()
        };

        users.push(newUser);
        this.storage.saveUsers(users);

        return newUser;
    }

    validateCredentials(credentials) {
        return credentials &&
            credentials.email &&
            credentials.password &&
            this._isValidEmail(credentials.email);
    }

    _validateRegistration(userData) {
        if (!userData.name || !userData.email || !userData.password) {
            throw new Error('Todos los campos son obligatorios');
        }

        if (userData.password.length < this.minPasswordLength) {
            throw new Error(`Contraseña mínimo ${this.minPasswordLength} caracteres`);
        }

        if (!this._isValidEmail(userData.email)) {
            throw new Error('Email inválido');
        }

        return true;
    }

    _isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    getStrategyName() {
        return 'email-password';
    }
}
