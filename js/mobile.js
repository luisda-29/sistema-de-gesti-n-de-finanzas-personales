/* ==================== */
/* FUNCIONALIDAD MÓVIL */
/* ==================== */

document.addEventListener('DOMContentLoaded', function() {
    const btnMenuToggle = document.getElementById('btn-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const navLinks = document.querySelectorAll('.nav-link');

    // Abrir/Cerrar sidebar al hacer clic en el botón menú
    if (btnMenuToggle) {
        btnMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleSidebar();
        });
    }

    // Cerrar sidebar al hacer clic en un enlace del menú
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Permitir que el click normal ocurra
            setTimeout(() => {
                closeSidebar();
            }, 100);
        });
    });

    // Cerrar sidebar al hacer clic en el overlay
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // Cerrar sidebar al redimensionar la ventana (pasar de móvil a desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 480) {
            closeSidebar();
        }
    });

    // Funciones de control del sidebar
    function toggleSidebar() {
        const isMobile = window.innerWidth <= 480;
        
        if (isMobile) {
            if (sidebar && sidebar.classList.contains('active')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        }
    }

    function openSidebar() {
        if (sidebar) {
            sidebar.classList.add('active');
        }
        if (sidebarOverlay) {
            sidebarOverlay.classList.add('active');
        }
    }

    function closeSidebar() {
        if (sidebar) {
            sidebar.classList.remove('active');
        }
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove('active');
        }
    }
});
