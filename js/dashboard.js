// Dashboard Interactions (UI only)

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard cargado');

    // Tab Switching Logic
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Here you could add logic to change the content below the tabs
            console.log(`Cambiando a pestaña: ${tab.innerText}`);
        });
    });

    // Sidebar Navigation Active State
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Prevent default for demo purposes if needed
            // e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Dark Mode Toggle (Visual only)
    const darkModeBtn = document.querySelector('.action-btn:first-child');
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const icon = darkModeBtn.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.replace('far', 'fas');
                console.log('Modo oscuro activado (visual)');
            } else {
                icon.classList.replace('fas', 'far');
                console.log('Modo oscuro desactivado (visual)');
            }
        });
    }

    // Chart Animation Simulation
    const doughnut = document.querySelector('.doughnut-placeholder');
    if (doughnut) {
        doughnut.style.transition = 'transform 1s ease-out';
        setTimeout(() => {
            doughnut.style.transform = 'rotate(360deg)';
        }, 500);
    }
});
