// ========================================
// EJEMPLOS DE USO - SISTEMA DE FINANZAS
// ========================================

/**
 * Este archivo contiene ejemplos de cómo usar los diferentes componentes
 * del sistema de gestión de finanzas. Los ejemplos están comentados para
 * que puedas copiar y usar en la consola del navegador.
 */

// ========================================
// 1. EJEMPLO: USAR DIRECTAMENTE EL AUTH MANAGER
// ========================================

/*
// Obtener el usuario actual
const currentUser = authManager.getCurrentUser();
console.log('Usuario actual:', currentUser);

// Verificar si está autenticado
if (authManager.isAuthenticated()) {
    console.log('Usuario autenticado');
} else {
    console.log('Usuario no autenticado');
}
*/

// ========================================
// 2. EJEMPLO: TRABAJAR CON CATEGORÍAS
// ========================================

/*
const userId = 'user123';

// Obtener todas las categorías
const allCategories = categoryManager.getCategories(userId);
console.log('Categorías:', allCategories);

// Obtener una categoría específica
const category = categoryManager.getCategoryById(userId, 'cat-001');
console.log('Categoría encontrada:', category);

// Crear una nueva categoría
const newCat = categoryManager.createCategory(userId, {
    name: 'Entretenimiento',
    type: 'Gasto',
    balance: 50.00
});
console.log('Categoría creada:', newCat);

// Actualizar una categoría
const updated = categoryManager.updateCategory(userId, newCat.id, {
    balance: 75.50
});
console.log('Categoría actualizada:', updated);

// Eliminar una categoría
categoryManager.deleteCategory(userId, newCat.id);
console.log('Categoría eliminada');
*/

// ========================================
// 3. EJEMPLO: CREAR UNA NUEVA ESTRATEGIA
// ========================================

/*
// Imaginemos una estrategia de autenticación por código QR
import { IAuthStrategy } from './interfaces/IAuthStrategy.js';

export class QRCodeAuth extends IAuthStrategy {
    constructor(storageManager) {
        super();
        this.storage = storageManager;
    }

    async authenticate(credentials) {
        // Validar código QR
        if (!this.validateCredentials(credentials)) {
            return null;
        }

        const users = this.storage.get('users', []);
        const user = users.find(u => u.qrCode === credentials.qrCode);
        
        return user || null;
    }

    async register(userData) {
        if (!userData.email || !userData.qrCode) {
            throw new Error('Email y QR requeridos');
        }

        const users = this.storage.get('users', []);

        const newUser = {
            id: Date.now().toString(),
            email: userData.email,
            qrCode: userData.qrCode,
            createdAt: new Date().toISOString(),
            authStrategy: this.getStrategyName()
        };

        users.push(newUser);
        this.storage.set('users', users);

        return newUser;
    }

    validateCredentials(credentials) {
        return credentials && credentials.qrCode && credentials.qrCode.length > 0;
    }

    getStrategyName() {
        return 'qr-code-auth';
    }
}

// Usar la nueva estrategia
// const qrAuthStrategy = new QRCodeAuth(storageManager);
// authManager.setStrategy(qrAuthStrategy);
*/

// ========================================
// 4. EJEMPLO: MANEJO DE ERRORES EN REGISTRO
// ========================================

/*
// Estos ejemplos muestran cómo manejar errores

async function manejarRegistroSeguro() {
    const userData = {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        password: 'secure123'
    };

    try {
        const user = await authManager.register(userData);
        console.log('Registro exitoso:', user);
    } catch (error) {
        // Estos son los posibles errores:
        switch(error.message) {
            case 'Todos los campos son obligatorios':
                console.error('Faltan campos requeridos');
                break;
            case 'Contraseña mínimo 6 caracteres':
                console.error('Contraseña muy corta');
                break;
            case 'Email inválido':
                console.error('Email no válido');
                break;
            case 'Email ya registrado':
                console.error('Email ya existe en el sistema');
                break;
            default:
                console.error('Error desconocido:', error.message);
        }
    }
}

// manejarRegistroSeguro();
*/

// ========================================
// 5. EJEMPLO: USAR STORAGE MANAGER DIRECTAMENTE
// ========================================

/*
// Operaciones directas con el storage

// Obtener usuarios
const users = storageManager.getUsers();
console.log('Todos los usuarios:', users);

// Guardar usuarios
const nuevosUsuarios = [
    { id: '1', email: 'user1@example.com', name: 'Usuario 1' }
];
storageManager.saveUsers(nuevosUsuarios);

// Trabajar con categorías
const categoriasUsuario = storageManager.getCategories('user-id-123');
console.log('Categorías:', categoriasUsuario);

// Limpiar sesión actual
storageManager.clearSession();

// Limpiar TODO (¡cuidado!)
// storageManager.clearAll();
*/

// ========================================
// 6. EJEMPLO: USAR STORAGE ADAPTER DIRECTAMENTE
// ========================================

/*
// Operaciones de bajo nivel con el adaptador

// Obtener un valor
const miValor = storageAdapter.get('miClave', 'valor_por_defecto');
console.log('Valor:', miValor);

// Guardar un valor
storageAdapter.set('miClave', { dato: 'importante' });

// Verificar si existe una clave
if (storageAdapter.has('miClave')) {
    console.log('La clave existe');
}

// Eliminar una clave
storageAdapter.remove('miClave');

// Limpiar todo lo del app
storageAdapter.clear();
*/

// ========================================
// 7. EJEMPLO: FLUJO COMPLETO DE USUARIO
// ========================================

/*
async function flujoCompletoUsuario() {
    // 1. Registrar nuevo usuario
    try {
        const nuevoUsuario = await authManager.register({
            name: 'María García',
            email: 'maria@example.com',
            password: 'password123'
        });
        
        console.log('Usuario registrado:', nuevoUsuario);
        
        // 2. El usuario es autenticado automáticamente após el registro
        const usuarioActual = authManager.getCurrentUser();
        console.log('Usuario actual:', usuarioActual);
        
        // 3. Crear categorías por defecto
        categoryManager.createDefaultCategories(nuevoUsuario.id);
        
        // 4. Agregar una categoría personalizada
        const categoriPersonal = categoryManager.createCategory(nuevoUsuario.id, {
            name: 'Categoría Personal',
            type: 'Personal',
            balance: 1000
        });
        
        console.log('Categoría creada:', categoriPersonal);
        
        // 5. Actualizar balance
        categoryManager.updateCategory(nuevoUsuario.id, categoriPersonal.id, {
            balance: 1500
        });
        
        // 6. Ver categorías
        const categorias = categoryManager.getCategories(nuevoUsuario.id);
        console.log('Todas las categorías:', categorias);
        
        // 7. Cerrar sesión
        authManager.logout();
        console.log('Sesión cerrada');
        
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// flujoCompletoUsuario();
*/

// ========================================
// 8. EJEMPLO: LISTAR TODOS LOS USUARIOS Y SUS DATOS
// ========================================

/*
function listarTodosLosUsuariosYSusDatos() {
    const usuarios = storageManager.getUsers();
    
    usuarios.forEach(usuario => {
        console.log(`\n=== USUARIO: ${usuario.name} ===`);
        console.log(`Email: ${usuario.email}`);
        console.log(`ID: ${usuario.id}`);
        
        const categorias = storageManager.getCategories(usuario.id);
        console.log(`Número de categorías: ${categorias.length}`);
        
        categorias.forEach(cat => {
            console.log(`  - ${cat.name} (${cat.type}): $${cat.balance}`);
        });
    });
}

// listarTodosLosUsuariosYSusDatos();
*/

// ========================================
// 9. EJEMPLO: VALIDACIÓN DE DATOS
// ========================================

/*
// Probando validación de email

async function probarValidacionEmail() {
    const tests = [
        { email: 'usuario@example.com', esperado: true },
        { email: 'invalido@.com', esperado: false },
        { email: '@nodomain.com', esperado: false },
        { email: 'sinemail', esperado: false }
    ];
    
    for (const test of tests) {
        const credenciales = {
            email: test.email,
            password: 'password123'
        };
        
        const esValida = emailAuthStrategy.validateCredentials(credenciales);
        console.log(`${test.email} -> Válido: ${esValida} (Esperado: ${test.esperado})`);
    }
}

// probarValidacionEmail();
*/

// ========================================
// 10. EJEMPLO: INTERFAZ UI CONTROLLER
// ========================================

/*
// Usar UIController sin tener que tocar el DOM directamente

// Mostrar/ocultar formularios
uiController.showLoginForm();
uiController.showRegisterForm();

// Limpiar formularios
uiController.clearLoginForm();
uiController.clearRegisterForm();

// Mostrar/ocultar dashboard
uiController.showDashboard();
uiController.showAuthContainer();

// Mostrar mensajes de error/éxito
uiController.setLoginMessage('Credenciales incorrectas', true);
uiController.setRegisterMessage('¡Cuenta creada!', false);

// Cargar categorías en la UI
const user = authManager.getCurrentUser();
if (user) {
    uiController.loadCategories(user.id);
}
*/

console.log('✓ Ejemplos cargados. Descomenta los ejemplos que quieras probar en la consola.');
