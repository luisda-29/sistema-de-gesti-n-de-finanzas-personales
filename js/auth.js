// Lógica de Autenticación

function toggleAuth(e) {
    if (e) e.preventDefault();

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        document.title = "Login - Sistema de Gestión Financiera";
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        document.title = "Registro - Sistema de Gestión Financiera";
    }
}

function handleLogin() {
    const user = document.getElementById('login-username').value;
    const pass = document.getElementById('login-password').value;

    if (!user || !pass) {
        alert("Por favor completa todos los campos.");
        return;
    }

    console.log("Iniciando sesión con:", user);

    // Simulación de éxito por ahora
    alert("¡Bienvenido, " + user + "!");
    window.location.href = 'index.html';
}

function handleRegister() {
    const name = document.getElementById('reg-fullname').value;
    const email = document.getElementById('reg-email').value;
    const user = document.getElementById('reg-username').value;
    const pass = document.getElementById('reg-password').value;

    if (!name || !email || !user || !pass) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    if (!validateEmail(email)) {
        alert("Por favor ingresa un correo electrónico válido.");
        return;
    }

    console.log("Registrando usuario:", user);

    // Simulación de éxito por ahora
    alert("Cuenta creada con éxito. Ahora puedes iniciar sesión.");
    toggleAuth();
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}
