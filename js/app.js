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
            
            // Crear categorías por defecto
            categoryManager.createDefaultCategories(user.id);
            
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
            showDashboard();
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
window.onload = function() {
    const user = authManager.getCurrentUser();
    if (user && authManager.isAuthenticated()) {
        showDashboard();
    } else {
        uiController.showAuthContainer();
        uiController.showLoginForm();
    }
};