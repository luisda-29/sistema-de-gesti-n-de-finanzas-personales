# Sistema de Gestión de Finanzas Personales

Sistema web para gestionar finanzas personales con autenticación de usuarios, creación de categorías y control de balances.

## 🎯 Características

- ✅ **Autenticación de Usuarios**: Login y registro con email y contraseña
- ✅ **Gestión de Categorías**: CRUD completo de categorías de gasto
- ✅ **Control de Balances**: Seguimiento de dinero en diferentes categorías
- ✅ **Persistencia de Datos**: LocalStorage para almacenamiento
- ✅ **Arquitectura Modular**: Separación de responsabilidades
- ✅ **Polimorfismo**: Múltiples estrategias de autenticación

## 🏗️ Arquitectura Refactorizada

El proyecto implementa patrones de diseño profesionales:

### Principios Aplicados

1. **Separación de Responsabilidades (SRP)**
   - Cada componente tiene una única responsabilidad
   - Interfaces bien definidas

2. **Polimorfismo (Estrategias de Autenticación)**
   - EmailPasswordAuth: Autenticación por email/contraseña
   - Fácil de extender para agregar más estrategias (Google, 2FA, etc.)

3. **Inyección de Dependencias**
   - Los componentes reciben sus dependencias en el constructor
   - Mayor flexibilidad y testabilidad

4. **Patrón Adaptador**
   - LocalStorageAdapter implementa la interfaz IStorage
   - Fácil cambiar a IndexedDB u otro sistema

## 📂 Estructura del Proyecto

```
js/
├── interfaces/                  # Definiciones de contratos
│   ├── IAuthStrategy.js         # Estrategias de autenticación
│   └── IStorage.js              # Adaptadores de almacenamiento
│
├── auth/                        # Implementaciones de autenticación
│   └── EmailPasswordAuth.js     # Email/Contraseña
│
├── storage/                     # Adaptadores de almacenamiento
│   └── LocalStorageAdapter.js   # LocalStorage implementation
│
├── managers/                    # Lógica de negocio
│   ├── StorageManager.js        # Interfaz centralizada de storage
│   ├── AuthManager.js           # Orquestación de autenticación
│   └── CategoryManager.js       # CRUD de categorías
│
├── controllers/                 # UI Controllers
│   └── UIController.js          # Control de interfaz
│
└── app.js                       # Archivo principal

index.html                       # Interfaz web
ARCHITECTURE.md                  # Documentación de arquitectura
EJEMPLOS_USO.js                  # Ejemplos de uso
```

## 🚀 Cómo Funciona

### Flujo de Autenticación

```
Usuario → UI → AuthManager → EmailPasswordAuth → StorageManager → LocalStorage
                  ↓
            Usuario autenticado → Dashboard
```

### Flujo de Categorías

```
Usuario → CategoryManager → StorageManager → LocalStorage
              ↓
         Categorías actualizadas → UIController → Renderizar UI
```

## 📋 Cómo Usar

### 1. **Registro de Usuario**

```javascript
// Los usuarios se registran directamente desde la UI
// O programáticamente:
const usuario = await authManager.register({
    name: 'Juan Pérez',
    email: 'juan@example.com',
    password: 'password123'
});
```

### 2. **Iniciar Sesión**

```javascript
// Desde la UI o programáticamente:
const usuario = await authManager.login({
    email: 'juan@example.com',
    password: 'password123'
});
```

### 3. **Trabajar con Categorías**

```javascript
const userId = authManager.getCurrentUser().id;

// Crear categoría
const categoria = categoryManager.createCategory(userId, {
    name: 'Entretenimiento',
    type: 'Gasto',
    balance: 100
});

// Obtener categorías
const categorias = categoryManager.getCategories(userId);

// Actualizar categoría
categoryManager.updateCategory(userId, categoria.id, {
    balance: 150
});

// Eliminar categoría
categoryManager.deleteCategory(userId, categoria.id);
```

## 🔐 Seguridad

### Implementado
- Validación de email con expresión regular
- Requisito mínimo de contraseña (6 caracteres)
- Verificación de email único en el registro
- Validación de datos en múltiples niveles

### Futuro
- Hash de contraseñas (bcrypt)
- JWT para autenticación más segura
- Autenticación multifactor (2FA)
- HTTPS obligatorio

## 🔄 Extensibilidad

### Agregar nueva estrategia de autenticación

```javascript
import { IAuthStrategy } from './interfaces/IAuthStrategy.js';

export class GoogleAuth extends IAuthStrategy {
    async authenticate(credentials) { /* ... */ }
    async register(userData) { /* ... */ }
    validateCredentials(credentials) { /* ... */ }
    getStrategyName() { return 'google-auth'; }
}

// Usar
const googleAuthStrategy = new GoogleAuth(storageManager);
authManager.setStrategy(googleAuthStrategy);
```

### Cambiar adaptador de almacenamiento

```javascript
import { IndexedDBAdapter } from './storage/IndexedDBAdapter.js';

const storageAdapter = new IndexedDBAdapter('finanzas');
const storageManager = new StorageManager(storageAdapter);
```

## 📖 Documentación Adicional

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Documentación detallada de la arquitectura
- **[EJEMPLOS_USO.js](EJEMPLOS_USO.js)** - Ejemplos de uso de todos los componentes

## 🛠️ Tecnologías Utilizadas

- **JavaScript ES6+**: Módulos, clases, async/await
- **HTML5**: Interfaz de usuario
- **LocalStorage API**: Persistencia de datos
- **DOM API**: Manipulación de interfaz

## 📝 Cambios Realizados

### De la versión anterior a esta:

| Aspecto | Antes | Ahora |
|--------|-------|-------|
| Organización | Todo en app.js | Separado por responsabilidades |
| Almacenamiento | Funciones simples | StorageManager + Adaptadores |
| Autenticación | Código directo | AuthManager + Estrategias |
| Categorías | Funciones simples | CategoryManager con CRUD |
| UI | Mezcla de lógica y UI | UIController separado |
| Extensibilidad | Difícil | Fácil con interfaces |
| Testing | Complejo | Componentes independientes |

## 💡 Conclusión

Esta refactorización convierte el proyecto en una base profesional y profesional, lista para escalar y mantener. Cada componente puede usarse de forma independiente y la arquitectura permite agregar nuevas características sin afectar el código existente.
