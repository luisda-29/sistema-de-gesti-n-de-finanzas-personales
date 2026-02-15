/**
 * Gestor de categorías
 * Maneja todas las operaciones CRUD de categorías
 */
export class CategoryManager {
    constructor(storageManager) {
        this.storage = storageManager;
    }

    /**
     * Obtiene todas las categorías del usuario actual
     */
    getCategories(userId) {
        return this.storage.getCategories(userId);
    }

    /**
     * Obtiene una categoría específica
     */
    getCategoryById(userId, categoryId) {
        const categories = this.storage.getCategories(userId);
        return categories.find(c => c.id === categoryId) || null;
    }

    /**
     * Crea una nueva categoría
     */
    createCategory(userId, categoryData) {
        if (!this._validateCategory(categoryData)) {
            throw new Error('Datos de categoría inválidos');
        }

        const categories = this.storage.getCategories(userId);

        const newCategory = {
            id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            name: categoryData.name,
            type: categoryData.type,
            balance: categoryData.balance || 0,
            createdAt: new Date().toISOString()
        };

        categories.push(newCategory);
        this.storage.saveCategories(userId, categories);
        console.log(`✓ Categoría creada: ${newCategory.name}`);
        return newCategory;
    }

    /**
     * Actualiza una categoría existente
     */
    updateCategory(userId, categoryId, updates) {
        const categories = this.storage.getCategories(userId);
        const index = categories.findIndex(c => c.id === categoryId);

        if (index === -1) {
            throw new Error('Categoría no encontrada');
        }

        categories[index] = {
            ...categories[index],
            ...updates,
            id: categoryId, // Mantener el ID original
            createdAt: categories[index].createdAt // Mantener fecha de creación
        };

        this.storage.saveCategories(userId, categories);
        console.log(`✓ Categoría actualizada: ${categories[index].name}`);
        return categories[index];
    }

    /**
     * Elimina una categoría
     */
    deleteCategory(userId, categoryId) {
        let categories = this.storage.getCategories(userId);
        const initialLength = categories.length;

        categories = categories.filter(c => c.id !== categoryId);

        if (categories.length === initialLength) {
            throw new Error('Categoría no encontrada');
        }

        this.storage.saveCategories(userId, categories);
        console.log(`✓ Categoría eliminada: ${categoryId}`);
        return true;
    }

    /**
     * Crea categorías por defecto para un nuevo usuario
     */
    createDefaultCategories(userId) {
        const defaultCategories = [
            { name: 'Bolsillo', type: 'Bolsillo', balance: 0 },
            { name: 'Tarjeta de Crédito', type: 'Tarjeta de Crédito', balance: 0 },
            { name: 'Meta de Ahorro', type: 'Meta', balance: 0 },
            { name: 'Resumen Total', type: 'Resumen', balance: 0 },
            { name: 'Pago de Vehículo', type: 'Pago Vehículo', balance: 0 },
            { name: 'Pago Rápido', type: 'Pago Rápido', balance: 0 }
        ];

        defaultCategories.forEach(cat => {
            this.createCategory(userId, cat);
        });

        console.log(`✓ Categorías por defecto creadas para usuario: ${userId}`);
    }

    _validateCategory(categoryData) {
        return categoryData &&
            categoryData.name &&
            categoryData.type &&
            typeof categoryData.name === 'string' &&
            categoryData.name.trim().length > 0;
    }
}
