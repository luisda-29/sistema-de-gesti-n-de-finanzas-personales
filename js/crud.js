// =====================================================
// CRUD CON LOCALSTORAGE - JAVASCRIPT VANILLA
// =====================================================

/**
 * Nombre de la clave en LocalStorage donde se guardan los datos
 * Cambia este valor según tus necesidades
 */
const STORAGE_KEY = 'finanzasPersonales';

// =====================================================
// CREAR (CREATE)
// =====================================================

/**
 * Crea un nuevo registro en LocalStorage
 * @param {Object} objeto - El objeto a guardar (ej: {nombre: 'Juan', edad: 30})
 * @returns {Object} El objeto guardado con ID asignado automáticamente
 */
function crear(objeto) {
    try {
        // Obtener datos actuales o crear array vacío
        const datos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        
        // Generar ID automáticamente (máximo ID + 1)
        const maxId = datos.length > 0 ? Math.max(...datos.map(d => d.id)) : 0;
        objeto.id = maxId + 1;
        
        // Agregar el nuevo objeto al array
        datos.push(objeto);
        
        // Guardar en LocalStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
        
        console.log('✓ Registro creado:', objeto);
        return objeto;
    } catch (error) {
        console.error('Error al crear:', error.message);
        return null;
    }
}

// =====================================================
// LEER (READ)
// =====================================================

/**
 * Lee todos los registros guardados en LocalStorage
 * @returns {Array} Array con todos los objetos guardados
 */
function leerTodos() {
    try {
        const datos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        console.log('✓ Registros leídos:', datos);
        return datos;
    } catch (error) {
        console.error('Error al leer:', error.message);
        return [];
    }
}

/**
 * Lee un registro específico por ID
 * @param {Number} id - El ID del registro a buscar
 * @returns {Object} El objeto encontrado o null
 */
function leerPorId(id) {
    try {
        const datos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        const registro = datos.find(d => d.id === id);
        
        if (registro) {
            console.log('✓ Registro encontrado:', registro);
            return registro;
        } else {
            console.log('⚠ Registro no encontrado con ID:', id);
            return null;
        }
    } catch (error) {
        console.error('Error al leer por ID:', error.message);
        return null;
    }
}

// =====================================================
// ACTUALIZAR (UPDATE)
// =====================================================

/**
 * Actualiza un registro existente
 * @param {Number} id - El ID del registro a actualizar
 * @param {Object} nuevosDatos - Los nuevos datos a actualizar
 * @returns {Object} El objeto actualizado o null
 */
function actualizar(id, nuevosDatos) {
    try {
        const datos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        
        // Buscar el índice del registro
        const indice = datos.findIndex(d => d.id === id);
        
        if (indice === -1) {
            console.log('⚠ Registro no encontrado con ID:', id);
            return null;
        }
        
        // Mantener el ID y actualizar los campos
        datos[indice] = { ...datos[indice], ...nuevosDatos, id };
        
        // Guardar en LocalStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
        
        console.log('✓ Registro actualizado:', datos[indice]);
        return datos[indice];
    } catch (error) {
        console.error('Error al actualizar:', error.message);
        return null;
    }
}

// =====================================================
// ELIMINAR (DELETE)
// =====================================================

/**
 * Elimina un registro de LocalStorage
 * @param {Number} id - El ID del registro a eliminar
 * @returns {Boolean} true si se eliminó, false si no
 */
function eliminar(id) {
    try {
        const datos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        
        // Buscar el índice del registro
        const indice = datos.findIndex(d => d.id === id);
        
        if (indice === -1) {
            console.log('⚠ Registro no encontrado con ID:', id);
            return false;
        }
        
        // Eliminar el registro
        const eliminado = datos.splice(indice, 1)[0];
        
        // Guardar en LocalStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
        
        console.log('✓ Registro eliminado:', eliminado);
        return true;
    } catch (error) {
        console.error('Error al eliminar:', error.message);
        return false;
    }
}

// =====================================================
// FUNCIÓN AUXILIAR - LIMPIAR ALMACENAMIENTO
// =====================================================

/**
 * Elimina todos los datos de LocalStorage
 * ¡Usar con cuidado!
 */
function limpiarTodo() {
    try {
        localStorage.removeItem(STORAGE_KEY);
        console.log('✓ Almacenamiento limpiado');
    } catch (error) {
        console.error('Error al limpiar:', error.message);
    }
}

// =====================================================
// EJEMPLOS DE USO
// =====================================================

/*
// Crear registros
crear({ nombre: 'Juan', edad: 30, email: 'juan@example.com' });
crear({ nombre: 'María', edad: 25, email: 'maria@example.com' });
crear({ nombre: 'Carlos', edad: 35, email: 'carlos@example.com' });

// Leer todos
leerTodos();

// Leer por ID
leerPorId(1);

// Actualizar
actualizar(1, { edad: 31, email: 'juannuevo@example.com' });

// Eliminar
eliminar(2);

// Limpiar todo
limpiarTodo();
*/

// =====================================================
// EXPORTAR FUNCIONES (para usar como módulo)
// =====================================================

export { crear, leerTodos, leerPorId, actualizar, eliminar, limpiarTodo };