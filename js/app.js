// ========== IMPORTAR MÓDULOS ==========
import { LocalStorageAdapter } from './storage/LocalStorageAdapter.js';
import { StorageManager } from './managers/StorageManager.js';
import { AuthManager } from './managers/AuthManager.js';
import { CategoryManager } from './managers/CategoryManager.js';
import { UIController } from './controllers/UIController.js';
import { EmailPasswordAuth } from './auth/EmailPasswordAuth.js';

// ========== INICIALIZACIÓN DE COMPONENTES ==========
const storageAdapter = new LocalStorageAdapter('finanzas_');
const storageManager = new StorageManager(storageAdapter);
const authManager = new AuthManager(storageManager);
const categoryManager = new CategoryManager(storageManager);
const uiController = new UIController(authManager, categoryManager);

// Establecer la estrategia de autenticación por email/password
const emailAuthStrategy = new EmailPasswordAuth(storageManager);
authManager.setStrategy(emailAuthStrategy);

// Hacer disponible globalmente para el HTML
window.uiController = uiController;
// Exponer managers para que scripts no-modulares (dashboard.js) puedan usarlos
window.storageManager = storageManager;
window.authManager = authManager;
window.categoryManager = categoryManager;
window.storageAdapter = storageAdapter;

// ========== FUNCIONES DE AUTENTICACIÓN PÚBLICAS ==========

/**
 * Muestra el formulario de registro
 */
function showRegister() {
    uiController.clearLoginMessage();
    uiController.showRegisterForm();
}

/**
 * Muestra el formulario de login
 */
function showLogin() {
    uiController.clearRegisterMessage();
    uiController.showLoginForm();
}

/**
 * Registra un nuevo usuario
 */
async function register() {
    const userData = uiController.getRegisterFormData();

    try {
        const user = await authManager.register(userData);
        if (user) {
            uiController.setRegisterMessage('¡Cuenta creada! Ahora inicia sesión.', false);
            uiController.clearRegisterForm();

            // Desactivado para permitir inicio limpio
            // categoryManager.createDefaultCategories(user.id);

            // Mostrar login después de 1.5 segundos
            setTimeout(() => showLogin(), 1500);
        }
    } catch (error) {
        uiController.setRegisterMessage(error.message, true);
    }
}

/**
 * Inicia sesión de un usuario
 */
async function login() {
    const credentials = uiController.getLoginFormData();

    try {
        const user = await authManager.login(credentials);
        if (user) {
            uiController.clearLoginForm();
            // Redirigir al dashboard principal
            window.location.href = 'index.html';
        } else {
            uiController.setLoginMessage('Credenciales incorrectas', true);
        }
    } catch (error) {
        uiController.setLoginMessage(error.message, true);
    }
}

/**
 * Cierra la sesión del usuario
 */
function logout() {
    authManager.logout();
    uiController.clearLoginForm();
    uiController.showAuthContainer();
    uiController.showLoginForm();
}

// ========== FUNCIONES DEL DASHBOARD ==========

/**
 * Muestra el dashboard
 */
function showDashboard() {
    const user = authManager.getCurrentUser();
    if (!user) return;

    uiController.showDashboard();
    uiController.loadCategories(user.id);
}

/**
 * Agrega una nueva categoría
 */
function addCategory() {
    const user = authManager.getCurrentUser();
    if (!user) return;

    const categoryData = uiController.getNewCategoryData();

    if (!categoryData.name) {
        alert('Ingresa un nombre');
        return;
    }

    try {
        categoryManager.createCategory(user.id, categoryData);
        uiController.clearNewCategoryForm();
        uiController.loadCategories(user.id);
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
}

// ========== INICIALIZACIÓN ==========
/**
 * Verifica si ya está logueado al cargar la página
 */
window.addEventListener('DOMContentLoaded', () => {
    const user = authManager.getCurrentUser();

    // Configurar listeners de UI si estamos en la página de login
    const btnLogin = document.getElementById('btn-login-submit');
    const btnRegister = document.getElementById('btn-register-submit');
    const linkShowRegister = document.getElementById('link-show-register');
    const linkShowLogin = document.getElementById('link-show-login');

    if (btnLogin) btnLogin.addEventListener('click', login);
    if (btnRegister) btnRegister.addEventListener('click', register);
    if (linkShowRegister) linkShowRegister.addEventListener('click', (e) => { e.preventDefault(); showRegister(); });
    if (linkShowLogin) linkShowLogin.addEventListener('click', (e) => { e.preventDefault(); showLogin(); });

    if (user && authManager.isAuthenticated()) {
        // Si estamos en login.html y ya hay sesión, ir al index
        if (window.location.pathname.endsWith('login.html')) {
            window.location.href = 'index.html';
        }
    } else {
        // Solo mostrar forms si estamos en login.html
        if (window.location.pathname.endsWith('login.html')) {
            showLogin();
        }
    }

    // Si estamos en index.html pero no hay sesión, redirigir al login
    if (!user && window.location.pathname.endsWith('index.html')) {
        window.location.href = 'login.html';
    }
});