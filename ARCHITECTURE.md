# Arquitectura del Sistema de Gestión de Finanzas Personales

## Descripción General

El proyecto ha sido refactorizado siguiendo principios de **Separación de Responsabilidades**, implementando **Interfaces/Clases Base** y **Polimorfismo** para una arquitectura escalable y mantenible.

---

## 📁 Estructura de Directorios

```
js/
├── interfaces/              # Definiciones de interfaces/contratos
│   ├── IAuthStrategy.js     # Interfaz para estrategias de autenticación
│   └── IStorage.js          # Interfaz para adaptadores de almacenamiento
│
├── auth/                    # Implementaciones de estrategias de autenticación
│   └── EmailPasswordAuth.js # Estrategia de autenticación por email/contraseña
│
├── storage/                 # Adaptadores de almacenamiento
│   └── LocalStorageAdapter.js # Adaptador para LocalStorage
│
├── managers/                # Gestores/Servicios de lógica de negocio
│   ├── StorageManager.js    # Gestor centralizado de almacenamiento
│   ├── AuthManager.js       # Gestor de autenticación
│   └── CategoryManager.js   # Gestor de categorías (CRUD)
│
├── controllers/             # Controladores del UI
│   └── UIController.js      # Controlador de la interfaz de usuario
│
├── app.js                   # Archivo principal (orquestación)
├── crud.js                  # Funciones CRUD genéricas (opcional)
└── storage.js               # Funciones de almacenamiento antiguas (deprecated)
```

---

## 🏗️ Principios Arquitectónicos

### 1. **Separación de Responsabilidades**

Cada clase tiene una única responsabilidad:

- **Interfaces (IAuthStrategy, IStorage)**: Definen contratos que deben cumplir las implementaciones
- **Adaptadores (LocalStorageAdapter)**: Manejan la persistencia de datos
- **Managers (StorageManager, AuthManager, CategoryManager)**: Orquestan la lógica de negocio
- **Controllers (UIController)**: Manejan la interacción con el DOM
- **Estrategias de Auth (EmailPasswordAuth)**: Implementan específicamente un método de autenticación

### 2. **Polimorfismo** (Implementado en Autenticación)

El sistema permite múltiples estrategias de autenticación sin cambiar el código principal:

```javascript
// La misma interfaz para diferentes estrategias
const emailAuthStrategy = new EmailPasswordAuth(storageManager);
authManager.setStrategy(emailAuthStrategy);

// En el futuro se pueden agregar más estrategias:
// const googleAuthStrategy = new GoogleAuth(storageManager);
// const twoFactorAuth = new TwoFactorAuth(storageManager);
```

### 3. **Inyección de Dependencias**

Los componentes reciben sus dependencias en el constructor:

```javascript
// Los managers saben qué almacenamiento usar
const authManager = new AuthManager(storageManager);
const categoryManager = new CategoryManager(storageManager);

// El controller sabe qué managers usar
const uiController = new UIController(authManager, categoryManager);
```

---

## 📋 Descripción de Clases

### Interfaces

#### **IAuthStrategy** (`js/interfaces/IAuthStrategy.js`)
Define el contrato para cualquier estrategia de autenticación:
- `authenticate(credentials)`: Autentica un usuario
- `register(userData)`: Registra un nuevo usuario
- `validateCredentials(credentials)`: Valida credenciales
- `getStrategyName()`: Retorna el nombre de la estrategia

#### **IStorage** (`js/interfaces/IStorage.js`)
Define el contrato para adaptadores de almacenamiento:
- `get(key, defaultValue)`: Obtiene un valor
- `set(key, value)`: Guarda un valor
- `remove(key)`: Elimina un valor
- `has(key)`: Verifica existencia
- `clear()`: Limpia todo

---

### Adaptadores de Almacenamiento

#### **LocalStorageAdapter** (`js/storage/LocalStorageAdapter.js`)
Implementa `IStorage` usando LocalStorage del navegador:
- Prefija las claves automáticamente para evitar conflictos
- Maneja JSON serialización/deserialización
- Gestión de errores integrada

---

### Gestores de Lógica

#### **StorageManager** (`js/managers/StorageManager.js`)
Interfaz centralizada para todas las operaciones de almacenamiento:
- `getUsers()`, `saveUsers()`: Gestión de usuarios
- `getCurrentUser()`, `setCurrentUser()`: Usuario actual
- `getCategories()`, `saveCategories()`: Categorías por usuario
- `clearSession()`, `clearAll()`: Limpiar datos

#### **AuthManager** (`js/managers/AuthManager.js`)
Orquesta la lógica de autenticación usando estrategias:
- `setStrategy(strategy)`: Establece la estrategia de autenticación
- `login(credentials)`: Inicia sesión (polimórfico)
- `register(userData)`: Registra usuario (polimórfico)
- `logout()`: Cierra sesión
- `isAuthenticated()`: Verifica autenticación

#### **CategoryManager** (`js/managers/CategoryManager.js`)
Implementa CRUD completo para categorías:
- `getCategories(userId)`: Obtiene todas las categorías
- `getCategoryById(userId, categoryId)`: Obtiene una categoría específica
- `createCategory(userId, categoryData)`: Crea una categoría
- `updateCategory(userId, categoryId, updates)`: Actualiza una categoría
- `deleteCategory(userId, categoryId)`: Elimina una categoría
- `createDefaultCategories(userId)`: Crea categorías por defecto

---

### Estrategias de Autenticación

#### **EmailPasswordAuth** (`js/auth/EmailPasswordAuth.js`)
Implementa `IAuthStrategy` para autenticación email/contraseña:
- Validación de credenciales
- Registro de usuarios
- Validación de formato de email
- Requisitos mínimos de contraseña (6 caracteres)

---

### Controlador de UI

#### **UIController** (`js/controllers/UIController.js`)
Gestiona toda la interacción con la interfaz de usuario:
- **Métodos de formularios**: `showLoginForm()`, `showRegisterForm()`, etc.
- **Gestión de mensajes**: `setLoginMessage()`, `setRegisterMessage()`, etc.
- **Obtención de datos**: `getLoginFormData()`, `getRegisterFormData()`, etc.
- **Manejo de dashboard**: `showDashboard()`, `loadCategories()`, etc.
- **Gestión de eventos**: `handleEditCategory()`, `handleDeleteCategory()`

---

## 🔄 Flujo de Datos

### Flujo de Login
```
Usuario escribe credenciales
              ↓
UIController.getLoginFormData()
              ↓
authManager.login(credentials)
              ↓
emailAuthStrategy.authenticate(credentials)
              ↓
StorageManager.getCurrentUser()
              ↓
LocalStorageAdapter.get()
              ↓
Usuario autenticado → showDashboard()
```

### Flujo de Creación de Categoría
```
Usuario completa formulario
              ↓
UIController.getNewCategoryData()
              ↓
categoryManager.createCategory(userId, data)
              ↓
StorageManager.getCategories()
              ↓
StorageManager.saveCategories()
              ↓
LocalStorageAdapter.set()
              ↓
UIController.loadCategories() → Actualiza vista
```

---

## 🔐 Seguridad

### Aspectos Implementados
- Validación de email con expresión regular
- Validación de longitud mínima de contraseña (6 caracteres)
- Verificación de email único en el registro
- Manejo centralizado de sesiones

### Recomendaciones Futuras
- Implementar hash de contraseñas (bcrypt)
- Agregar JWT para autenticación más segura
- Implementar autenticación multifactor
- HTTPS para comunicación segura

---

## 🚀 Cómo Agregar Nuevas Estrategias de Autenticación

### Ejemplo: Agregar autenticación con Google

1. **Crear nueva clase en `js/auth/GoogleAuth.js`**:
```javascript
import { IAuthStrategy } from '../interfaces/IAuthStrategy.js';

export class GoogleAuth extends IAuthStrategy {
    constructor(storageManager) {
        super();
        this.storage = storageManager;
    }

    async authenticate(credentials) {
        // Lógica de autenticación con Google
    }

    async register(userData) {
        // Lógica de registro con Google
    }

    validateCredentials(credentials) {
        return credentials && credentials.googleToken;
    }

    getStrategyName() {
        return 'google-auth';
    }
}
```

2. **Usar en `app.js`**:
```javascript
import { GoogleAuth } from './auth/GoogleAuth.js';

const googleAuthStrategy = new GoogleAuth(storageManager);
authManager.setStrategy(googleAuthStrategy);
```

---

## 📱 Uso de Componentes

### Ejemplo: Crear una categoría desde componente externo
```javascript
import { CategoryManager } from './managers/CategoryManager.js';
import { StorageManager } from './managers/StorageManager.js';

const categoryManager = new CategoryManager(storageManager);
const newCategory = categoryManager.createCategory(userId, {
    name: 'Nueva Categoría',
    type: 'Bolsillo',
    balance: 100
});
```

---

## ✅ Ventajas de Esta Arquitectura

1. **Mantenibilidad**: Cada componente tiene una responsabilidad clara
2. **Escalabilidad**: Fácil agregar nuevas estrategias de autenticación
3. **Testabilidad**: Componentes pueden ser probados de forma aislada
4. **Reutilización**: Managers y adaptadores son reutilizables
5. **Flexibilidad**: Cambiar adaptadores (ej: de LocalStorage a IndexedDB) es trivial
6. **Separación**: Lógica de negocio separada de UI

---

## 🔧 Tecnologías Utilizadas

- **JavaScript ES6+**: Módulos, clases, async/await
- **LocalStorage API**: Persistencia de datos
- **DOM API**: Manipulación de UI
- **Módulos ES6**: Importación/exportación de código

