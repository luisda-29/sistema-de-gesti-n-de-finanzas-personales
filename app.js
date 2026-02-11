// ========== FUNCIONES DE ALMACENAMIENTO ==========
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function getCategories(userId) {
    const key = `categories_${userId}`;
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveCategories(userId, categories) {
    const key = `categories_${userId}`;
    localStorage.setItem(key, JSON.stringify(categories));
}

// ========== AUTENTICACIÓN ==========
function showRegister() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function showLogin() {
    document.getElementById('registerForm').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
}

function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    if (!name || !email || !password) {
        document.getElementById('registerMessage').textContent = 'Todos los campos son obligatorios';
        return;
    }
    
    if (password.length < 6) {
        document.getElementById('registerMessage').textContent = 'Contraseña mínimo 6 caracteres';
        return;
    }
    
    const users = getUsers();
    
    if (users.find(u => u.email === email)) {
        document.getElementById('registerMessage').textContent = 'Email ya registrado';
        return;
    }
    
    const newUser = {
        id: Date.now().toString(),
        name: name,
        email: email,
        password: password // Nota: En producción usar hash
    };
    
    users.push(newUser);
    saveUsers(users);
    
    // Crear categorías por defecto
    const defaultCategories = [
        { id: '1', name: 'Bolsillo', type: 'Bolsillo', balance: 0 },
        { id: '2', name: 'Tarjeta de Crédito', type: 'Tarjeta de Crédito', balance: 0 },
        { id: '3', name: 'Meta de Ahorro', type: 'Meta', balance: 0 },
        { id: '4', name: 'Resumen Total', type: 'Resumen', balance: 0 },
        { id: '5', name: 'Pago de Vehículo', type: 'Pago Vehículo', balance: 0 },
        { id: '6', name: 'Pago Rápido', type: 'Pago Rápido', balance: 0 }
    ];
    
    saveCategories(newUser.id, defaultCategories);
    
    document.getElementById('registerMessage').textContent = '¡Cuenta creada! Ahora inicia sesión.';
    showLogin();
}

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        setCurrentUser(user);
        showDashboard();
    } else {
        document.getElementById('loginMessage').textContent = 'Credenciales incorrectas';
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('authContainer').style.display = 'block';
    showLogin();
}

// ========== DASHBOARD Y CATEGORÍAS ==========
function showDashboard() {
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    
    loadCategories();
}

function loadCategories() {
    const user = getCurrentUser();
    if (!user) return;
    
    const categories = getCategories(user.id);
    const container = document.getElementById('categoriesList');
    
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
            <button onclick="editCategory('${cat.id}')">Editar</button>
            <button onclick="deleteCategory('${cat.id}')">Eliminar</button>
        `;
        
        container.appendChild(div);
    });
}

function addCategory() {
    const name = document.getElementById('newCategoryName').value;
    const type = document.getElementById('newCategoryType').value;
    
    if (!name) {
        alert('Ingresa un nombre');
        return;
    }
    
    const user = getCurrentUser();
    if (!user) return;
    
    const categories = getCategories(user.id);
    
    const newCategory = {
        id: Date.now().toString(),
        name: name,
        type: type,
        balance: 0
    };
    
    categories.push(newCategory);
    saveCategories(user.id, categories);
    
    document.getElementById('newCategoryName').value = '';
    loadCategories();
}

function editCategory(categoryId) {
    const user = getCurrentUser();
    const categories = getCategories(user.id);
    const category = categories.find(c => c.id === categoryId);
    
    if (!category) return;
    
    const newBalance = prompt(`Editar balance para ${category.name}:`, category.balance);
    if (newBalance !== null) {
        category.balance = parseFloat(newBalance) || 0;
        saveCategories(user.id, categories);
        loadCategories();
    }
}

function deleteCategory(categoryId) {
    if (!confirm('¿Eliminar esta categoría?')) return;
    
    const user = getCurrentUser();
    let categories = getCategories(user.id);
    categories = categories.filter(c => c.id !== categoryId);
    saveCategories(user.id, categories);
    loadCategories();
}

// ========== INICIALIZACIÓN ==========
// Verificar si ya está logueado al cargar
window.onload = function() {
    const user = getCurrentUser();
    if (user) {
        showDashboard();
    }
};