/**
 * Ejemplo de extensión: Autenticación de dos factores
 * Este archivo demuestra cómo agregar una nueva estrategia de autenticación
 * sin modificar el código existente (Open/Closed Principle)
 */

import { IAuthStrategy } from '../interfaces/IAuthStrategy.js';

/**
 * Estrategia de autenticación con verify dos factores (2FA)
 * Implementa IAuthStrategy para que sea compatible con AuthManager
 */
export class TwoFactorAuth extends IAuthStrategy {
    constructor(storageManager) {
        super();
        this.storage = storageManager;
        this.minPasswordLength = 6;
    }

    /**
     * Autentica un usuario con 2FA
     * Requiere: email, password, y código de verificación
     */
    async authenticate(credentials) {
        if (!this.validateCredentials(credentials)) {
            return null;
        }

        const users = this.storage.get('users', []);
        const user = users.find(u => 
            u.email === credentials.email && 
            u.password === credentials.password &&
            u.twoFactorEnabled === true
        );

        if (!user) {
            return null;
        }

        // Aquí iría la lógica de verificación del código 2FA
        // Por ahora, simulamos que el código es válido
        if (this._verify2FACode(user.id, credentials.code)) {
            return user;
        }

        return null;
    }

    /**
     * Registra un nuevo usuario con 2FA habilitado
     */
    async register(userData) {
        if (!this._validateRegistration(userData)) {
            return null;
        }

        const users = this.storage.get('users', []);

        if (users.find(u => u.email === userData.email)) {
            throw new Error('Email ya registrado');
        }

        const newUser = {
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email,
            password: userData.password,
            twoFactorEnabled: userData.enableTwoFactor || false,
            twoFactorSecret: this._generateTwoFactorSecret(),
            createdAt: new Date().toISOString(),
            authStrategy: this.getStrategyName()
        };

        users.push(newUser);
        this.storage.set('users', users);

        // Si 2FA está habilitado, guardar secreto en sesión
        if (newUser.twoFactorEnabled) {
            console.log(`✓ 2FA habilitado. Secreto generado: ${newUser.twoFactorSecret}`);
        }

        return newUser;
    }

    /**
     * Valida credenciales para 2FA
     */
    validateCredentials(credentials) {
        return credentials && 
               credentials.email && 
               credentials.password &&
               credentials.code &&
               this._isValidEmail(credentials.email);
    }

    /**
     * Habilita 2FA para un usuario existente
     */
    enableTwoFactor(userId) {
        const users = this.storage.get('users', []);
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            throw new Error('Usuario no encontrado');
        }

        const secret = this._generateTwoFactorSecret();
        users[userIndex].twoFactorEnabled = true;
        users[userIndex].twoFactorSecret = secret;

        this.storage.set('users', users);
        console.log(`✓ 2FA habilitado para usuario ${userId}`);
        
        return {
            secret: secret,
            qrCode: this._generateQRCode(users[userIndex].email, secret)
        };
    }

    /**
     * Deshabilita 2FA para un usuario
     */
    disableTwoFactor(userId) {
        const users = this.storage.get('users', []);
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex === -1) {
            throw new Error('Usuario no encontrado');
        }

        users[userIndex].twoFactorEnabled = false;
        users[userIndex].twoFactorSecret = null;

        this.storage.set('users', users);
        console.log(`✓ 2FA deshabilitado para usuario ${userId}`);
    }

    // ========== MÉTODOS PRIVADOS ==========

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

    _generateTwoFactorSecret() {
        // En producción, usar una librería como 'speakeasy'
        // Por ahora, generar un secreto simulado
        return Math.random().toString(36).substring(2, 11);
    }

    _generateQRCode(email, secret) {
        // En producción, usar 'qrcode' librería
        // Por ahora, retornar URL simulada
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/${email}?secret=${secret}`;
    }

    _verify2FACode(userId, code) {
        // En producción, usar speakeasy.totp.verify()
        // Simulación: el código '000000' siempre está correcto
        return code === '000000' || Math.random() > 0.5; // Simulación
    }

    getStrategyName() {
        return 'two-factor-auth';
    }
}

// ========== EJEMPLO DE USO ==========

/*
import { TwoFactorAuth } from './auth/TwoFactorAuth.js';

// Registrar usuario con 2FA
const twoFactorAuth = new TwoFactorAuth(storageManager);
authManager.setStrategy(twoFactorAuth);

const usuario = await authManager.register({
    name: 'Juan Seguro',
    email: 'juan.seguro@example.com',
    password: 'password123',
    enableTwoFactor: true
});

console.log('Usuario registrado con 2FA:', usuario);

// Iniciar sesión con 2FA
const credenciales = {
    email: 'juan.seguro@example.com',
    password: 'password123',
    code: '000000' // Código 2FA
};

const usuarioAutenticado = await authManager.login(credenciales);
console.log('Usuario autenticado con 2FA:', usuarioAutenticado);

// Habilitar/Deshabilitar 2FA
const resultado = twoFactorAuth.enableTwoFactor('user-id-123');
console.log('QR Code para escanear:', resultado.qrCode);

twoFactorAuth.disableTwoFactor('user-id-123');
*/
