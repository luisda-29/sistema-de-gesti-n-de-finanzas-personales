/**
 * Controlador de UI
 * Maneja la interacción con la interfaz de usuario
 */
export class UIController {
    constructor(authManager, categoryManager) {
        this.auth = authManager;
        this.categories = categoryManager;
    }

    // ========== MÉTODOS PARA FORMS DE AUTENTICACIÓN ==========

    /**
     * Muestra el formulario de login
     */
    showLoginForm() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm) loginForm.style.display = 'block';
        if (registerForm) registerForm.style.display = 'none';
    }

    /**
     * Muestra el formulario de registro
     */
    showRegisterForm() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'block';
    }

    /**
     * Limpiar mensaje de login
     */
    clearLoginMessage() {
        const message = document.getElementById('loginMessage');
        if (message) message.textContent = '';
    }

    /**
     * Mostrar mensaje de login
     */
    setLoginMessage(message, isError = true) {
        const messageEl = document.getElementById('loginMessage');
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.style.color = isError ? 'red' : 'green';
        }
    }

    /**
     * Obtener datos del formulario de login
     */
    getLoginFormData() {
        return {
            email: document.getElementById('loginEmail')?.value || '',
            password: document.getElementById('loginPassword')?.value || ''
        };
    }

    /**
     * Limpiar formulario de login
     */
    clearLoginForm() {
        const email = document.getElementById('loginEmail');
        const password = document.getElementById('loginPassword');
        
        if (email) email.value = '';
        if (password) password.value = '';
        this.clearLoginMessage();
    }

    // ========== MÉTODOS PARA FORMS DE REGISTRO ==========

    /**
     * Limpiar mensaje de registro
     */
    clearRegisterMessage() {
        const message = document.getElementById('registerMessage');
        if (message) message.textContent = '';
    }

    /**
     * Mostrar mensaje de registro
     */
    setRegisterMessage(message, isError = true) {
        const messageEl = document.getElementById('registerMessage');
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.style.color = isError ? 'red' : 'green';
        }
    }

    /**
     * Obtener datos del formulario de registro
     */
    getRegisterFormData() {
        return {
            name: document.getElementById('registerName')?.value || '',
            email: document.getElementById('registerEmail')?.value || '',
            password: document.getElementById('registerPassword')?.value || ''
        };
    }

    /**
     * Limpiar formulario de registro
     */
    clearRegisterForm() {
        const name = document.getElementById('registerName');
        const email = document.getElementById('registerEmail');
        const password = document.getElementById('registerPassword');
        
        if (name) name.value = '';
        if (email) email.value = '';
        if (password) password.value = '';
        this.clearRegisterMessage();
    }

    // ========== MÉTODOS PARA DASHBOARD ==========

    /**
     * Muestra el dashboard
     */
    showDashboard() {
        const authContainer = document.getElementById('authContainer');
        const dashboard = document.getElementById('dashboard');
        
        if (authContainer) authContainer.style.display = 'none';
        if (dashboard) dashboard.style.display = 'block';
    }

    /**
     * Muestra la pantalla de autenticación
     */
    showAuthContainer() {
        const authContainer = document.getElementById('authContainer');
        const dashboard = document.getElementById('dashboard');
        
        if (authContainer) authContainer.style.display = 'block';
        if (dashboard) dashboard.style.display = 'none';
    }

    /**
     * Carga y muestra las categorías
     */
    loadCategories(userId) {
        const categories = this.categories.getCategories(userId);
        const container = document.getElementById('categoriesList');

        if (!container) return;

        container.innerHTML = '<h3>Tus Categorías:</h3>';

        if (categories.length === 0) {
            container.innerHTML += '<p>No tienes categorías. Agrega una.</p>';
            return;
        }

        categories.forEach(cat => {
            const div = document.createElement('div');
            div.style.border = '1px solid #ccc';
            div.style.padding = '10px';
            div.style.margin = '5px';
            
            div.innerHTML = `
                <strong>${cat.name}</strong> (${cat.type})<br>
                Balance: $${cat.balance}<br>
                <button onclick="window.uiController.handleEditCategory('${cat.id}')">Editar</button>
                <button onclick="window.uiController.handleDeleteCategory('${cat.id}')">Eliminar</button>
            `;
            
            container.appendChild(div);
        });
    }

    /**
     * Obtiene datos del formulario de nueva categoría
     */
    getNewCategoryData() {
        return {
            name: document.getElementById('newCategoryName')?.value || '',
            type: document.getElementById('newCategoryType')?.value || ''
        };
    }

    /**
     * Limpiar formulario de nueva categoría
     */
    clearNewCategoryForm() {
        const name = document.getElementById('newCategoryName');
        if (name) name.value = '';
    }

    /**
     * Maneja edición de categoría
     */
    handleEditCategory(categoryId) {
        const user = this.auth.getCurrentUser();
        if (!user) return;

        const category = this.categories.getCategoryById(user.id, categoryId);
        if (!category) return;

        const newBalance = prompt(`Editar balance para ${category.name}:`, category.balance);
        if (newBalance !== null) {
            try {
                this.categories.updateCategory(user.id, categoryId, {
                    balance: parseFloat(newBalance) || 0
                });
                this.loadCategories(user.id);
            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        }
    }

    /**
     * Maneja eliminación de categoría
     */
    handleDeleteCategory(categoryId) {
        if (!confirm('¿Eliminar esta categoría?')) return;

        const user = this.auth.getCurrentUser();
        if (!user) return;

        try {
            this.categories.deleteCategory(user.id, categoryId);
            this.loadCategories(user.id);
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }
}
