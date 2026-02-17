// Dashboard Interactions (Functional UI)

function syncUserUI() {
    const user = window.storageManager && window.storageManager.getCurrentUser ? window.storageManager.getCurrentUser() : null;
    if (!user) return;

    try {

        // Actualizar Header
        const headerName = document.getElementById('header-user-name');
        if (headerName) headerName.innerText = user.name || 'Usuario';

        // Actualizar Sección Perfil (Display)
        const profileNameDisp = document.getElementById('profile-name-display');
        const profileEmailDisp = document.getElementById('profile-email-display');
        if (profileNameDisp) profileNameDisp.innerText = user.name || 'Usuario';
        if (profileEmailDisp) profileEmailDisp.innerText = user.email || 'correo@ejemplo.com';

        // Actualizar Inputs de Edición
        const editName = document.getElementById('edit-name');
        const editEmail = document.getElementById('edit-email');
        if (editName) editName.value = user.name || '';
        if (editEmail) editEmail.value = user.email || '';

        // Actualizar Avatares (Imagen)
        if (user.avatar) {
            const hAvatar = document.getElementById('header-avatar');
            const pAvatar = document.getElementById('profile-avatar');
            if (hAvatar) hAvatar.style.backgroundImage = `url(${user.avatar})`;
            if (pAvatar) pAvatar.style.backgroundImage = `url(${user.avatar})`;
        }

    } catch (e) {
        console.error('Error sincronizando UI de usuario:', e);
    }
}

function handleAvatarClick() {
    const input = document.getElementById('avatar-input');
    if (input) input.click();
}

function savePersonalData() {
    const currentUser = window.storageManager.getCurrentUser();
    if (!currentUser) return;
    const newName = document.getElementById('edit-name').value.trim();
    const newEmail = document.getElementById('edit-email').value.trim();

    if (!newName || !newEmail) {
        alert('Nombre y correo no pueden estar vacíos.');
        return;
    }

    // 1. Actualizar objeto de sesión
    currentUser.name = newName;
    currentUser.email = newEmail;

    // 2. Actualizar en la lista maestra de usuarios
    const users = window.storageManager.getUsers();
    if (users && Array.isArray(users)) {
        const index = users.findIndex(u => u.id === currentUser.id);
        if (index !== -1) {
            users[index].name = newName;
            users[index].email = newEmail;
            window.storageManager.saveUsers(users);
        }
    }

    window.storageManager.setCurrentUser(currentUser);
    syncUserUI();
    alert('¡Información personal actualizada con éxito!');
}

function updatePassword() {
    const pass = document.getElementById('edit-password').value;
    const confirm = document.getElementById('confirm-password').value;

    if (!pass) {
        alert('Por favor ingresa una nueva contraseña.');
        return;
    }

    if (pass !== confirm) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    if (pass.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        return;
    }

    const currentUser = window.storageManager.getCurrentUser();
    if (currentUser) {
        // Actualizar en la lista maestra
        const users = window.storageManager.getUsers();
        if (users && Array.isArray(users)) {
            const index = users.findIndex(u => u.id === currentUser.id);
            if (index !== -1) {
                users[index].password = pass; // Actualizar contraseña real
                window.storageManager.saveUsers(users);

                alert('¡Contraseña actualizada con éxito!');
                document.getElementById('edit-password').value = '';
                document.getElementById('confirm-password').value = '';
            }
        }
    }
}

function handleLogout(e) {
    if (e) e.preventDefault();
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        if (window.storageManager && window.storageManager.clearSession) {
            window.storageManager.clearSession();
        } else {
            localStorage.removeItem('finanzas_currentUser');
        }
        window.location.href = 'login.html';
    }
}

function deleteAccount() {
    const currentUser = window.storageManager.getCurrentUser();
    if (!currentUser) return;

    const confirmPass = prompt("Para eliminar tu cuenta, por favor ingresa tu contraseña actual:");
    if (!confirmPass) return;

    // 1. Validar contraseña contra la lista maestra
    const users = window.storageManager.getUsers();
    if (users && Array.isArray(users)) {
        const userInDb = users.find(u => u.id === currentUser.id);

        if (!userInDb || userInDb.password !== confirmPass) {
            alert("Error: La contraseña ingresada es incorrecta.");
            return;
        }

        if (confirm(`¿Estás COMPLETAMENTE seguro, ${currentUser.name}? Todos tus datos, billeteras y movimientos se borrarán para siempre.`)) {
            // 2. Eliminar datos del usuario (Aislamiento)
            if (window.storageManager.removeData) {
                window.storageManager.removeData(currentUser.id);
            } else {
                localStorage.removeItem(`finanzas_data_${currentUser.id}`);
            }

            // 3. Eliminar de la lista maestra
            const updatedUsers = users.filter(u => u.id !== currentUser.id);
            window.storageManager.saveUsers(updatedUsers);

            // 4. Limpiar sesión y salir
            window.storageManager.clearSession();
            alert("Tu cuenta y todos tus datos han sido eliminados. Lamentamos verte partir.");
            window.location.href = 'login.html';
        }
    }
}

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

// --- Gestión de Datos (LocalStorage) ---

function getAppData() {
    const user = window.storageManager.getCurrentUser();
    if (!user) return { wallets: [], movements: [], categories: [] };

    const data = window.storageManager.getData(user.id);
    return data ? data : { wallets: [], movements: [], categories: [] };
}

function saveAppData(data) {
    const user = window.storageManager.getCurrentUser();
    if (!user) return;
    window.storageManager.saveData(user.id, data);
}

function updateWalletSelectors() {
    const data = getAppData();
    const selects = ['inc-wallet', 'exp-wallet'];

    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;

        const currentVal = select.value;
        // Limpiar opciones
        select.innerHTML = '';

        if (data.wallets.length === 0) {
            const opt = document.createElement('option');
            opt.value = "";
            opt.innerText = "No hay billeteras";
            opt.disabled = true;
            opt.selected = true;
            select.appendChild(opt);
        } else {
            data.wallets.forEach(w => {
                const opt = document.createElement('option');
                opt.value = w.id;
                opt.innerText = w.name;
                select.appendChild(opt);
            });
        }

        if (currentVal && data.wallets.find(w => w.id === currentVal)) {
            select.value = currentVal;
        }
    });
}

function renderAll() {
    const data = getAppData();

    // 1. Renderizar Billeteras
    const walletContainer = document.getElementById('wallets-container');
    if (walletContainer) {
        // Limpiar excepto el botón "Nueva"
        const newBtn = walletContainer.lastElementChild;
        walletContainer.innerHTML = '';
        [...data.wallets].reverse().forEach(w => {
            const card = document.createElement('div');
            card.className = 'card';
            card.onclick = () => showWalletDetail(w.id, w.name);
            card.style.borderLeft = '4px solid var(--accent-blue)';
            card.style.cursor = 'pointer';
            card.style.transition = 'transform 0.2s';
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div>
                        <h4 style="color: var(--text-muted); font-size: 12px; text-transform: uppercase;">${w.name}</h4>
                        <h2 style="font-size: 24px; margin-top: 8px;" id="${w.id}" class="wallet-value">$${w.balance.toLocaleString('es-CO')}</h2>
                    </div>
                    <i class="fas fa-wallet" style="color: var(--accent-blue);"></i>
                </div>
                <div class="wallet-actions">
                    <button class="btn-wallet-action add" onclick="event.stopPropagation(); updateWalletBalance('${w.id}', 'add')">
                        <i class="fas fa-plus"></i> Ingresar
                    </button>
                    <button class="btn-wallet-action withdraw" onclick="event.stopPropagation(); updateWalletBalance('${w.id}', 'withdraw')">
                        <i class="fas fa-minus"></i> Retirar
                    </button>
                </div>
            `;
            walletContainer.appendChild(card);
        });
        walletContainer.appendChild(newBtn);
    }

    // 2. Renderizar Categorías
    const catContainer = document.getElementById('categories-container');
    if (catContainer) {
        const newBtn = catContainer.lastElementChild;
        catContainer.innerHTML = '';
        data.categories.forEach(c => {
            const card = document.createElement('div');
            card.className = 'card';
            card.onclick = () => showCategoryDetail(c.name, c.emoji);
            card.style.textAlign = 'center';
            card.style.cursor = 'pointer';
            card.style.transition = 'transform 0.2s';
            card.innerHTML = `
                <div style="font-size: 24px; margin-bottom: 8px;">${c.emoji}</div>
                <div style="font-size: 14px; font-weight: 600;">${c.name}</div>
            `;
            catContainer.appendChild(card);
        });
        catContainer.appendChild(newBtn);
    }

    // 3. Renderizar Movimientos
    const tableBody = document.querySelector('#table-movimientos tbody');
    if (tableBody) {
        tableBody.innerHTML = '';
        // Invertimos primero para que a igualdad de fecha, el más reciente (último en el array) quede arriba
        const sortedMovements = [...data.movements].reverse().sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedMovements.forEach(m => {
            const dateObj = new Date(m.date + "T00:00:00");
            const options = { day: '2-digit', month: 'short', year: 'numeric' };
            const formattedDate = dateObj.toLocaleDateString('en-GB', options);

            const row = document.createElement('tr');
            row.style.borderBottom = '1px solid var(--border-color)';
            row.innerHTML = `
                <td style="padding: 12px;">${formattedDate}</td>
                <td>${m.desc}</td>
                <td>${m.cat}</td>
                <td style="color: ${m.type === 'income' ? '#2ecc71' : '#e74c3c'};">
                    ${m.type === 'income' ? '+' : '-'}$${parseInt(m.amount).toLocaleString('es-CO')}
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // 4. Sincronizar Selectores y Balances Globales
    updateCategorySelectors();
    updateWalletSelectors();
    syncGlobalBalance();
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

    // Cargar y Renderizar todo desde LocalStorage
    renderAll();

    // --- Lógica de Menú Móvil ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');

    if (mobileMenuBtn && sidebar && sidebarOverlay) {
        // Asegurar visibilidad en pantallas pequeñas
        const showIfMobile = () => {
            if (window.innerWidth <= 900) mobileMenuBtn.style.display = 'inline-flex';
            else mobileMenuBtn.style.display = 'none';
        };
        showIfMobile();
        window.addEventListener('resize', showIfMobile);
        mobileMenuBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
            sidebarOverlay.classList.add('active');
        });

        sidebarOverlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
        });

        // Cerrar al hacer clic en un enlace (móvil)
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                    sidebarOverlay.classList.remove('active');
                }
            });
        });
    }

    // Inicializar Selectores de Categorías
    updateCategorySelectors();

    // --- Lógica de Avatar / Foto de Perfil ---
    const profileAvatar = document.getElementById('profile-avatar');
    const avatarInput = document.getElementById('avatar-input');

    if (profileAvatar) {
        profileAvatar.addEventListener('click', handleAvatarClick);
    }

    if (avatarInput) {
        avatarInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) return;

            // Verificar tamaño (opcional, ej: < 2MB para no saturar LocalStorage)
            if (file.size > 2 * 1024 * 1024) {
                alert('La imagen es demasiado pesada. Elige una de menos de 2MB.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function (event) {
                const base64Image = event.target.result;

                const currentUser = window.storageManager.getCurrentUser();
                if (currentUser) {
                    currentUser.avatar = base64Image;

                    // 1. Actualizar en la lista maestra
                    const users = window.storageManager.getUsers();
                    if (users && Array.isArray(users)) {
                        const index = users.findIndex(u => u.id === currentUser.id);
                        if (index !== -1) {
                            users[index].avatar = base64Image;
                            window.storageManager.saveUsers(users);
                        }
                    }

                    window.storageManager.setCurrentUser(currentUser);
                    syncUserUI();
                }
            };
            reader.readAsDataURL(file);
        });
    }

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
        btnRegIncome.addEventListener('click', () => registerMovement('income'));
    }

    if (btnRegExpense) {
        btnRegExpense.addEventListener('click', () => registerMovement('expense'));
    }

    // Animación Inicial
    const doughnut = document.querySelector('.doughnut-placeholder');
    if (doughnut) {
        doughnut.style.transition = 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => {
            doughnut.style.transform = 'rotate(360deg)';
        }, 300);
    }

    // Cargar datos de usuario
    syncUserUI();
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

    const data = getAppData();
    const walletId = `val-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;

    data.wallets.push({
        id: walletId,
        name: name,
        balance: balance
    });

    saveAppData(data);
    renderAll();
    alert(`Billetera "${name}" creada.`);
}

function updateWalletBalance(walletId, action) {
    const data = getAppData();
    const wallet = data.wallets.find(w => w.id === walletId);
    if (!wallet) return;

    const amountStr = prompt(`Monto a ${action === 'add' ? 'ingresar' : 'retirar'}:`);
    const amount = parseInt(amountStr);

    if (isNaN(amount) || amount <= 0) {
        alert("Por favor ingresa un monto válido.");
        return;
    }

    if (action === 'withdraw' && amount > wallet.balance) {
        alert("Saldo insuficiente en esta billetera.");
        return;
    }

    // Actualizar saldo
    wallet.balance = action === 'add' ? wallet.balance + amount : wallet.balance - amount;

    // Registrar movimiento (Fecha Local)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    data.movements.push({
        date: today,
        desc: `${action === 'add' ? 'Ingreso' : 'Retiro'} manual - ${wallet.name}`,
        cat: "Ajuste",
        amount: amount,
        type: action === 'add' ? 'income' : 'expense',
        walletId: walletId
    });

    saveAppData(data);
    renderAll();
}

function syncGlobalBalance() {
    const data = getAppData();
    let total = 0;
    let totalIncomes = 0;
    let totalExpenses = 0;

    data.wallets.forEach(w => total += w.balance);
    data.movements.forEach(m => {
        if (m.type === 'income') totalIncomes += m.amount;
        else totalExpenses += m.amount;
    });

    const formattedTotal = `$${total.toLocaleString('es-CO')}`;

    // Actualizar elementos del Dashboard
    const dashChart = document.getElementById('total-balance-chart');
    const dashStat = document.getElementById('total-balance-stat');
    const dIncomes = document.getElementById('dash-total-incomes');
    const dExpenses = document.getElementById('dash-total-expenses');
    const sIncomes = document.getElementById('stat-total-incomes');
    const sExpenses = document.getElementById('stat-total-expenses');

    if (dashChart) dashChart.innerText = formattedTotal;
    if (dashStat) dashStat.innerText = formattedTotal;
    if (dIncomes) dIncomes.innerText = `$${totalIncomes.toLocaleString('es-CO')}`;
    if (dExpenses) dExpenses.innerText = `$${totalExpenses.toLocaleString('es-CO')}`;
    if (sIncomes) sIncomes.innerText = `+$${totalIncomes.toLocaleString('es-CO')}`;
    if (sExpenses) sExpenses.innerText = `-$${totalExpenses.toLocaleString('es-CO')}`;
}

// Registro desde el Dashboard (Formularios)
// Se han movido a listeners dentro de DOMContentLoaded o funciones específicas

function registerMovement(type) {
    const dateInput = type === 'income' ? 'inc-date' : 'exp-date';
    const walletSelect = type === 'income' ? 'inc-wallet' : 'exp-wallet';
    const descInput = type === 'income' ? 'inc-desc' : 'exp-desc';
    const catSelect = type === 'income' ? 'inc-cat' : 'exp-cat';
    const amountInput = type === 'income' ? 'inc-amount' : 'exp-amount';

    const date = document.getElementById(dateInput).value;
    const walletId = document.getElementById(walletSelect).value;
    const desc = document.getElementById(descInput).value;
    const cat = document.getElementById(catSelect).value;
    const amount = parseInt(document.getElementById(amountInput).value);

    if (!date || !desc || !cat || !amount || !walletId) {
        alert("Por favor completa todos los campos.");
        return;
    }

    const data = getAppData();
    const wallet = data.wallets.find(w => w.id === walletId);

    if (type === 'expense' && amount > wallet.balance) {
        alert("Saldo insuficiente en la billetera seleccionada.");
        return;
    }

    // Actualizar billetera
    wallet.balance = type === 'income' ? wallet.balance + amount : wallet.balance - amount;

    // Agregar movimiento
    data.movements.push({
        date, desc, cat, amount, type, walletId
    });

    saveAppData(data);
    renderAll();

    // Limpiar campos
    document.getElementById(descInput).value = '';
    document.getElementById(amountInput).value = '';
    alert(`${type === 'income' ? 'Ingreso' : 'Gasto'} registrado.`);
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

    const data = getAppData();
    const wallet = data.wallets.find(w => w.id === walletId);
    if (!wallet) return;

    detailName.innerText = `Historial: ${walletName}`;
    detailBalance.innerText = `$${wallet.balance.toLocaleString('es-CO')}`;

    detailTableBody.innerHTML = '';
    let totalIncomes = 0;
    let totalExpenses = 0;

    const filteredMovements = data.movements.filter(m => m.walletId === walletId);
    [...filteredMovements].reverse().sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(m => {
        if (m.type === 'income') totalIncomes += m.amount;
        else totalExpenses += m.amount;

        const dateObj = new Date(m.date + "T00:00:00");
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-GB', options);

        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid var(--border-color)';
        row.innerHTML = `
            <td style="padding: 12px;">${formattedDate}</td>
            <td>${m.desc}</td>
            <td style="color: ${m.type === 'income' ? '#2ecc71' : '#e74c3c'};">
                ${m.type === 'income' ? '+' : '-'}$${m.amount.toLocaleString('es-CO')}
            </td>
        `;
        detailTableBody.appendChild(row);
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
    const data = getAppData();
    const selects = ['inc-cat', 'exp-cat', 'filter-category'];

    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (!select) return;

        const currentVal = select.value;
        const firstOption = select.options[0];
        select.innerHTML = '';
        select.appendChild(firstOption);

        data.categories.forEach(cat => {
            const opt = document.createElement('option');
            opt.value = cat.name;
            opt.innerText = cat.name;
            select.appendChild(opt);
        });

        select.value = currentVal;
    });
}

function promptNewCategory() {
    const name = prompt("Nombre de la nueva categoría:");
    if (!name) return;

    const emoji = prompt(`Emoji para "${name}":`, "📁");
    if (!emoji) return;

    const data = getAppData();
    data.categories.push({ name, emoji });
    saveAppData(data);
    renderAll();
}

function showCategoryDetail(name, emoji = "") {
    const mainView = document.getElementById('categories-main-view');
    const detailView = document.getElementById('category-detail-view');
    const detailName = document.getElementById('detail-category-name');
    const detailEmoji = document.getElementById('detail-category-emoji');
    const detailTotal = document.getElementById('detail-category-total');
    const detailTableBody = document.querySelector('#table-category-details tbody');

    if (!mainView || !detailView || !detailTableBody) return;

    detailName.innerText = name;
    if (emoji) detailEmoji.innerText = emoji;

    detailTableBody.innerHTML = '';
    let total = 0;

    const data = getAppData();
    const filteredMovements = data.movements.filter(m => m.cat === name);
    [...filteredMovements].reverse().sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(m => {
        total += m.type === 'income' ? m.amount : -m.amount;

        const dateObj = new Date(m.date + "T00:00:00");
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString('en-GB', options);

        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid var(--border-color)';
        row.innerHTML = `
            <td style="padding: 12px;">${formattedDate}</td>
            <td>${m.desc}</td>
            <td style="color: ${m.type === 'income' ? '#2ecc71' : '#e74c3c'};">
                ${m.type === 'income' ? '+' : '-'}$${m.amount.toLocaleString('es-CO')}
            </td>
        `;
        detailTableBody.appendChild(row);
    });

    detailTotal.innerText = `Total: $${Math.abs(total).toLocaleString('es-CO')}`;
    detailTotal.style.color = total >= 0 ? '#2ecc71' : '#e74c3c';

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
