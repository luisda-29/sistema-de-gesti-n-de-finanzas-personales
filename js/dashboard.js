// Dashboard Interactions (Functional UI)

function showSection(viewId) {
    console.log(`Cambiando a vista: ${viewId}`);

    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.view-section');
    sections.forEach(s => s.style.display = 'none');

    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(viewId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    // Actualizar título de la cabecera
    const titleMap = {
        'view-dashboard': 'Dashboard',
        'view-movimientos': 'Movimientos',
        'view-billeteras': 'Mis Billeteras',
        'view-categorias': 'Categorías',
        'view-micuenta': 'Mi Cuenta'
    };

    const titleElement = document.getElementById('view-title');
    if (titleElement && titleMap[viewId]) {
        titleElement.innerText = titleMap[viewId];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Dashboard de Finanzas cargado');

    // Mapeo de IDs de navegación a IDs de vista
    const navMapping = {
        'nav-dashboard': 'view-dashboard',
        'nav-movimientos': 'view-movimientos',
        'nav-billeteras': 'view-billeteras',
        'nav-categorias': 'view-categorias',
        'nav-micuenta': 'view-micuenta'
    };

    // Configurar Navegación Lateral
    Object.keys(navMapping).forEach(navId => {
        const link = document.getElementById(navId);
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                // Actualizar estado activo visual
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Cambiar vista
                showSection(navMapping[navId]);
            });
        }
    });

    // Toggle Modo Oscuro (Visual)
    const darkModeBtn = document.querySelector('.action-btn:first-child');
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const icon = darkModeBtn.querySelector('i');
            if (icon && icon.classList.contains('far')) {
                icon.classList.replace('far', 'fas');
            } else if (icon) {
                icon.classList.replace('fas', 'far');
            }
        });
    }

    // Sincronización Inicial de Saldos
    syncGlobalBalance();

    // --- Lógica de Filtros para Movimientos ---
    const filterDate = document.getElementById('filter-date');
    const filterDesc = document.getElementById('filter-desc');
    const filterCategory = document.getElementById('filter-category');
    const clearBtn = document.getElementById('clear-filters');
    const tableBody = document.querySelector('#table-movimientos tbody');

    function filterTable() {
        if (!tableBody) return;

        const dateVal = filterDate.value; // YYYY-MM-DD
        const descVal = filterDesc.value.toLowerCase();
        const catVal = filterCategory.value;

        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length < 3) return;

            const rowDateRaw = cells[0].innerText; // "11 Feb 2026"
            const rowDesc = cells[1].innerText.toLowerCase();
            const rowCat = cells[2].innerText;

            // Conversión simple de fecha para demo (puedes mejorar con un parser real)
            // Para propósitos visuales, si el input está vacío, ignoramos el filtro de fecha
            let matchDate = true;
            if (dateVal) {
                // Mapeo completo de meses para comparar
                const months = {
                    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
                    'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
                    'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
                };
                const parts = rowDateRaw.split(' '); // [11, Feb, 2026]
                const rowDateIso = `${parts[2]}-${months[parts[1]] || '01'}-${parts[0].padStart(2, '0')}`;
                matchDate = rowDateIso === dateVal;
            }

            const matchDesc = rowDesc.includes(descVal);
            const matchCat = catVal === "" || rowCat === catVal;

            if (matchDate && matchDesc && matchCat) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    if (filterDate) filterDate.addEventListener('input', filterTable);
    if (filterDesc) filterDesc.addEventListener('input', filterTable);
    if (filterCategory) filterCategory.addEventListener('change', filterTable);

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            filterDate.value = '';
            filterDesc.value = '';
            filterCategory.value = '';
            filterTable();
        });
    }

    // Animación Inicial
    const doughnut = document.querySelector('.doughnut-placeholder');
    if (doughnut) {
        doughnut.style.transition = 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            doughnut.style.transform = 'rotate(360deg)';
        }, 300);
    }
});

// --- Funciones Globales para Billeteras ---

function updateWalletBalance(elementId, action) {
    const balanceElement = document.getElementById(elementId);
    if (!balanceElement) return;

    // Obtener valor actual (quitar '$' y puntos)
    let currentVal = parseInt(balanceElement.innerText.replace(/[$.]/g, ''));

    const amountStr = prompt(`Monto a ${action === 'add' ? 'ingresar' : 'retirar'}:`);
    const amount = parseInt(amountStr);

    if (isNaN(amount) || amount <= 0) {
        alert("Por favor ingresa un monto válido.");
        return;
    }

    if (action === 'withdraw' && amount > currentVal) {
        alert("Saldo insuficiente en esta billetera.");
        return;
    }

    // Calcular nuevo saldo
    const newVal = action === 'add' ? currentVal + amount : currentVal - amount;

    // Actualizar visualmente la billetera
    balanceElement.innerText = `$${newVal.toLocaleString('es-CO')}`;

    // Sincronizar con el dashboard
    syncGlobalBalance();
}

function syncGlobalBalance() {
    const wallet1 = parseInt(document.getElementById('val-efectivo').innerText.replace(/[$.]/g, ''));
    const wallet2 = parseInt(document.getElementById('val-banco').innerText.replace(/[$.]/g, ''));

    const total = wallet1 + wallet2;
    const formattedTotal = `$${total.toLocaleString('es-CO')}`;

    // Actualizar elementos del Dashboard
    const dashChart = document.getElementById('total-balance-chart');
    const dashStat = document.getElementById('total-balance-stat');

    if (dashChart) dashChart.innerText = formattedTotal;
    if (dashStat) dashStat.innerText = formattedTotal;
}
