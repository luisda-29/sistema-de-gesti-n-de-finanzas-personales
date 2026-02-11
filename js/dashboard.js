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

    // Inicializar Selectores de Categorías
    updateCategorySelectors();

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

    // --- Lógica de Registro de Movimientos (Ingresos/Gastos) ---
    const btnRegIncome = document.getElementById('btn-reg-income');
    const btnRegExpense = document.getElementById('btn-reg-expense');

    if (btnRegIncome) {
        btnRegIncome.addEventListener('click', () => {
            const date = document.getElementById('inc-date').value;
            const walletId = document.getElementById('inc-wallet').value;
            const desc = document.getElementById('inc-desc').value;
            const cat = document.getElementById('inc-cat').value;
            const amount = document.getElementById('inc-amount').value;

            if (!date || !desc || !cat || !amount || !walletId) {
                alert("Por favor completa todos los campos del ingreso.");
                return;
            }

            // Actualizar Billetera
            const balanceElement = document.getElementById(walletId);
            let currentVal = parseInt(balanceElement.innerText.replace(/[$.]/g, ''));
            const newVal = currentVal + parseInt(amount);
            balanceElement.innerText = `$${newVal.toLocaleString('es-CO')}`;

            // Crear fila en tabla
            createMovementRow(date, desc, cat, amount, 'income', walletId);

            // Sincronizar Global
            syncGlobalBalance();

            // Limpiar
            document.getElementById('inc-desc').value = '';
            document.getElementById('inc-amount').value = '';
            alert("Ingreso registrado con éxito.");
        });
    }

    if (btnRegExpense) {
        btnRegExpense.addEventListener('click', () => {
            const date = document.getElementById('exp-date').value;
            const walletId = document.getElementById('exp-wallet').value;
            const desc = document.getElementById('exp-desc').value;
            const cat = document.getElementById('exp-cat').value;
            const amount = document.getElementById('exp-amount').value;

            if (!date || !desc || !cat || !amount || !walletId) {
                alert("Por favor completa todos los campos del gasto.");
                return;
            }

            // Actualizar Billetera
            const balanceElement = document.getElementById(walletId);
            let currentVal = parseInt(balanceElement.innerText.replace(/[$.]/g, ''));

            if (parseInt(amount) > currentVal) {
                alert("Saldo insuficiente en la billetera seleccionada.");
                return;
            }

            const newVal = currentVal - parseInt(amount);
            balanceElement.innerText = `$${newVal.toLocaleString('es-CO')}`;

            // Crear fila en tabla
            createMovementRow(date, desc, cat, amount, 'expense', walletId);

            // Sincronizar Global
            syncGlobalBalance();

            // Limpiar
            document.getElementById('exp-desc').value = '';
            document.getElementById('exp-amount').value = '';
            alert("Gasto registrado con éxito.");
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

function promptNewWallet() {
    const name = prompt("Nombre de la nueva billetera:");
    if (!name) return;

    const balanceStr = prompt(`Saldo inicial para "${name}":`, "0");
    const balance = parseInt(balanceStr);

    if (isNaN(balance) || balance < 0) {
        alert("Por favor ingresa un saldo inicial válido.");
        return;
    }

    createNewWallet(name, balance);
}

function createNewWallet(name, balance) {
    const container = document.getElementById('wallets-container');
    if (!container) return;

    // Generar un ID único basado en el nombre
    const walletId = `val-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

    // Crear la tarjeta
    const walletCard = document.createElement('div');
    walletCard.className = 'card';
    walletCard.onclick = () => showWalletDetail(walletId, name);
    walletCard.style.borderLeft = '4px solid #3b82f6';
    walletCard.style.cursor = 'pointer';
    walletCard.style.transition = 'transform 0.2s';
    walletCard.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start;">
            <div>
                <h4 style="color: var(--text-muted); font-size: 12px; text-transform: uppercase;">${name}</h4>
                <h2 style="font-size: 24px; margin-top: 8px;" id="${walletId}" class="wallet-value">$${balance.toLocaleString('es-CO')}</h2>
            </div>
            <i class="fas fa-wallet" style="color: #3b82f6;"></i>
        </div>
        <div class="wallet-actions">
            <button class="btn-wallet-action add" onclick="event.stopPropagation(); updateWalletBalance('${walletId}', 'add')">
                <i class="fas fa-plus"></i> Ingresar
            </button>
            <button class="btn-wallet-action withdraw" onclick="event.stopPropagation(); updateWalletBalance('${walletId}', 'withdraw')">
                <i class="fas fa-minus"></i> Retirar
            </button>
        </div>
    `;

    // Insertar antes del botón "Nueva Billetera"
    container.insertBefore(walletCard, container.lastElementChild);

    // Añadir a los selects de registro
    const incWalletSelect = document.getElementById('inc-wallet');
    const expWalletSelect = document.getElementById('exp-wallet');

    const newOption = `<option value="${walletId}">${name}</option>`;
    if (incWalletSelect) incWalletSelect.insertAdjacentHTML('beforeend', newOption);
    if (expWalletSelect) expWalletSelect.insertAdjacentHTML('beforeend', newOption);

    // Sincronizar balances
    syncGlobalBalance();
}

function updateWalletBalance(elementId, action) {
    const balanceElement = document.getElementById(elementId);
    if (!balanceElement) return;

    // Obtener el nombre de la billetera desde el h4 superior
    const walletName = balanceElement.parentElement.querySelector('h4').innerText;

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

    // --- REGISTRAR MOVIMIENTO AUTOMÁTICO ---
    const today = new Date().toISOString().split('T')[0];
    const description = `${action === 'add' ? 'Ingreso' : 'Retiro'} manual - ${walletName}`;
    const category = "Ajuste";
    const type = action === 'add' ? 'income' : 'expense';

    createMovementRow(today, description, category, amount, type, elementId);

    // Sincronizar con el dashboard
    syncGlobalBalance();
}

function syncGlobalBalance() {
    const walletValues = document.querySelectorAll('.wallet-value');
    let total = 0;

    walletValues.forEach(el => {
        const val = parseInt(el.innerText.replace(/[$.|]/g, '')) || 0;
        total += val;
    });

    const formattedTotal = `$${total.toLocaleString('es-CO')}`;

    // Actualizar elementos del Dashboard
    const dashChart = document.getElementById('total-balance-chart');
    const dashStat = document.getElementById('total-balance-stat');

    if (dashChart) dashChart.innerText = formattedTotal;
    if (dashStat) dashStat.innerText = formattedTotal;
}

function createMovementRow(date, desc, cat, amount, type, walletId = "") {
    const tableBody = document.querySelector('#table-movimientos tbody');
    if (!tableBody) return;

    // Formatear fecha de YYYY-MM-DD a "DD Mon YYYY" para demo
    const dateObj = new Date(date + "T00:00:00");
    const options = { day: '2-digit', month: 'short', year: 'numeric' };
    const formattedDate = dateObj.toLocaleDateString('en-GB', options).replace(/ /g, ' ');

    const row = document.createElement('tr');
    row.style.borderBottom = '1px solid var(--border-color)';
    row.setAttribute('data-wallet-id', walletId);
    row.innerHTML = `
        <td style="padding: 12px;">${formattedDate}</td>
        <td>${desc}</td>
        <td>${cat}</td>
        <td style="color: ${type === 'income' ? '#2ecc71' : '#e74c3c'};">
            ${type === 'income' ? '+' : '-'}$${parseInt(amount).toLocaleString('es-CO')}
        </td>
    `;

    // Insertar al inicio de la tabla
    tableBody.prepend(row);
}

// --- Funciones Globales para Billeteras (Detalle) ---

function showWalletDetail(walletId, walletName) {
    const mainView = document.getElementById('wallets-main-view');
    const detailView = document.getElementById('wallet-detail-view');
    const detailName = document.getElementById('detail-wallet-name-label');
    const detailBalance = document.getElementById('detail-wallet-balance');
    const detailIncomes = document.getElementById('detail-wallet-incomes');
    const detailExpenses = document.getElementById('detail-wallet-expenses');
    const detailTableBody = document.querySelector('#table-wallet-details tbody');

    if (!mainView || !detailView || !detailTableBody) return;

    // Actualizar Header
    detailName.innerText = `Historial: ${walletName}`;
    const currentBalance = document.getElementById(walletId).innerText;
    detailBalance.innerText = currentBalance;

    detailTableBody.innerHTML = '';
    let totalIncomes = 0;
    let totalExpenses = 0;

    // Filtrar movimientos
    const rows = document.querySelectorAll('#table-movimientos tbody tr');
    rows.forEach(row => {
        if (row.getAttribute('data-wallet-id') === walletId) {
            const cells = row.querySelectorAll('td');
            const amountText = cells[3].innerText;
            const amount = parseInt(amountText.replace(/[$.|+-]/g, '')) || 0;
            const isIncome = amountText.includes('+');

            if (isIncome) totalIncomes += amount;
            else totalExpenses += amount;

            const newRow = document.createElement('tr');
            newRow.style.borderBottom = '1px solid var(--border-color)';
            newRow.innerHTML = `
                <td style="padding: 12px;">${cells[0].innerText}</td>
                <td>${cells[1].innerText}</td>
                <td style="color: ${isIncome ? '#2ecc71' : '#e74c3c'};">
                    ${amountText}
                </td>
            `;
            detailTableBody.appendChild(newRow);
        }
    });

    detailIncomes.innerText = `+$${totalIncomes.toLocaleString('es-CO')}`;
    detailExpenses.innerText = `-$${totalExpenses.toLocaleString('es-CO')}`;

    mainView.style.display = 'none';
    detailView.style.display = 'block';
}

function hideWalletDetail() {
    const mainView = document.getElementById('wallets-main-view');
    const detailView = document.getElementById('wallet-detail-view');
    if (mainView && detailView) {
        mainView.style.display = 'block';
        detailView.style.display = 'none';
    }
}

// --- Funciones Globales para Categorías ---

function updateCategorySelectors() {
    const container = document.getElementById('categories-container');
    const selects = ['inc-cat', 'exp-cat', 'filter-category'];

    if (!container) return;

    // Obtener nombres de categorías desde las cards (excluyendo la de "Nueva")
    const categories = [];
    container.querySelectorAll('.card').forEach(card => {
        const nameDiv = card.querySelector('div:last-child');
        if (nameDiv && nameDiv.innerText !== 'Nueva') {
            categories.push(nameDiv.innerText.trim());
        }
    });

    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;

        // Guardar valor seleccionado actual
        const currentVal = select.value;

        // Limpiar opciones manteniendo la primera (placeholder/Todas)
        const firstOption = select.options[0];
        select.innerHTML = '';
        select.appendChild(firstOption);

        // Añadir nuevas opciones
        categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat;
            opt.innerText = cat;
            select.appendChild(opt);
        });

        // Restaurar valor si aún existe
        select.value = currentVal;
    });
}

function promptNewCategory() {
    const name = prompt("Nombre de la nueva categoría:");
    if (!name) return;

    const emoji = prompt(`Emoji para "${name}":`, "📁");
    if (!emoji) return;

    createNewCategory(name, emoji);
}

function createNewCategory(name, emoji) {
    const container = document.getElementById('categories-container');
    if (!container) return;

    // Crear la card de categoría
    const catCard = document.createElement('div');
    catCard.className = 'card';
    catCard.onclick = () => showCategoryDetail(name, emoji);
    catCard.style.textAlign = 'center';
    catCard.style.cursor = 'pointer';
    catCard.style.transition = 'transform 0.2s';
    catCard.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 8px;">${emoji}</div>
        <div style="font-size: 14px; font-weight: 600;">${name}</div>
    `;

    // Insertar antes del botón "Nueva"
    container.insertBefore(catCard, container.lastElementChild);

    // Sincronizar selectores
    updateCategorySelectors();
}

function showCategoryDetail(name, emoji = "") {
    const mainView = document.getElementById('categories-main-view');
    const detailView = document.getElementById('category-detail-view');
    const detailName = document.getElementById('detail-category-name');
    const detailEmoji = document.getElementById('detail-category-emoji');
    const detailTotal = document.getElementById('detail-category-total');
    const detailTableBody = document.querySelector('#table-category-details tbody');

    if (!mainView || !detailView || !detailTableBody) return;

    // Actualizar Header del Detalle
    detailName.innerText = name;
    if (emoji) detailEmoji.innerText = emoji;

    // Limpiar tabla de detalles
    detailTableBody.innerHTML = '';
    let total = 0;

    // Buscar movimientos en la tabla principal
    const mainRows = document.querySelectorAll('#table-movimientos tbody tr');
    mainRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 4) return;

        const catCell = cells[2].innerText.trim();
        if (catCell === name) {
            const date = cells[0].innerText;
            const desc = cells[1].innerText;
            const amountText = cells[3].innerText;
            const amount = parseInt(amountText.replace(/[$.|+-]/g, '')) || 0;
            const isExpense = amountText.includes('-');

            total += isExpense ? -amount : amount;

            const newRow = document.createElement('tr');
            newRow.style.borderBottom = '1px solid var(--border-color)';
            newRow.innerHTML = `
                <td style="padding: 12px;">${date}</td>
                <td>${desc}</td>
                <td style="color: ${isExpense ? '#e74c3c' : '#2ecc71'};">
                    ${amountText}
                </td>
            `;
            detailTableBody.appendChild(newRow);
        }
    });

    // Actualizar Total
    detailTotal.innerText = `Total: $${Math.abs(total).toLocaleString('es-CO')}`;
    detailTotal.style.color = total >= 0 ? '#2ecc71' : '#e74c3c';

    // Cambiar vista
    mainView.style.display = 'none';
    detailView.style.display = 'block';
}

function hideCategoryDetail() {
    const mainView = document.getElementById('categories-main-view');
    const detailView = document.getElementById('category-detail-view');

    if (mainView && detailView) {
        mainView.style.display = 'block';
        detailView.style.display = 'none';
    }
}
