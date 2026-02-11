
// ========== FUNCIONES DE ALMACENAMIENTO login ==========
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

export {getUsers, saveUsers, getCurrentUser, setCurrentUser, getCategories, saveCategories}