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
window.authManager = authManager;

// ========== FUNCIONES DE AUTENTICACIÓN PÚBLICAS ==========

/**
 * Muestra el formulario de registro
 */
function showRegister() {
    uiController.clearLoginMessage();
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    if (registerForm) registerForm.style.display = 'block';
    if (loginForm) loginForm.style.display = 'none';
}

/**
 * Muestra el formulario de login
 */
function showLogin() {
    uiController.clearRegisterMessage();
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    if (registerForm) registerForm.style.display = 'none';
    if (loginForm) loginForm.style.display = 'block';
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
            // Si estamos en index.html integrado, ocultar login y mostrar dashboard
            const loginContainer = document.getElementById('login-container');
            const appContainer = document.getElementById('app-container');
            if (loginContainer && appContainer) {
                loginContainer.style.display = 'none';
                appContainer.style.display = '';
                showDashboard();
            } else {
                // Si no estamos en el index integrado, redirigir
                window.location.href = 'index.html';
            }
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
    // Si estamos en index integrado, mostrar login
    const loginContainer = document.getElementById('login-container');
    const appContainer = document.getElementById('app-container');
    if (loginContainer && appContainer) {
        loginContainer.style.display = '';
        appContainer.style.display = 'none';
        showLogin();
    } else {
        uiController.showAuthContainer();
        uiController.showLoginForm();
    }
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

/**
 * Maneja el logout desde el sidebar
 */
function handleLogout(event) {
    event.preventDefault();
    logout();
}

// ========== INICIALIZACIÓN ==========
/**
 * Verifica si ya está logueado al cargar la página
 */
window.addEventListener('DOMContentLoaded', () => {
    const user = authManager.getCurrentUser();

    if (user && authManager.isAuthenticated()) {
        // Si ya hay sesión
        if (window.location.pathname.endsWith('login.html')) {
            // En login.html, redirigir al index
            window.location.href = 'index.html';
        } else {
            // En index.html integrado, mostrar dashboard
            const loginContainer = document.getElementById('login-container');
            const appContainer = document.getElementById('app-container');
            if (loginContainer && appContainer) {
                loginContainer.style.display = 'none';
                appContainer.style.display = '';
                showDashboard();
            }
        }
    } else {
        // Mostrar login
        if (window.location.pathname.endsWith('login.html')) {
            showLogin();
        } else {
            // En index.html integrado
            const loginContainer = document.getElementById('login-container');
            const appContainer = document.getElementById('app-container');
            if (loginContainer && appContainer) {
                loginContainer.style.display = '';
                appContainer.style.display = 'none';
                showLogin();
            }
        }
    }
});

// Hacer funciones disponibles globalmente
window.showLogin = showLogin;
window.showRegister = showRegister;
window.login = login;
window.register = register;
window.logout = logout;
window.showDashboard = showDashboard;
window.addCategory = addCategory;
window.handleLogout = handleLogout;