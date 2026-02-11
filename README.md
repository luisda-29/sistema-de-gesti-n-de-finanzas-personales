# Dashboard de Finanzas Personales

## Descripcion del Proyecto

Aplicacion web para gestionar finanzas personales sin backend. El usuario puede registrar ingresos y gastos, organizarlos por billeteras y categorias, y visualizar su estado financiero con filtros por fecha y categoria.

Toda la informacion se almacena en `localStorage`.

## Objetivo del MVP

Entregar un dashboard funcional que permita:

- Registrar y editar movimientos financieros.
- Consultar saldo global y por billetera.
- Filtrar movimientos por fecha y categoria.
- Mantener los datos al recargar la pagina.

## Alcance Funcional (MVP)

### 1) Dashboard financiero

- Mostrar `saldo total`.
- Mostrar `total ingresos`.
- Mostrar `total gastos`.
- Mostrar `balance` (ingresos - gastos).

### 2) CRUD de movimientos

- Crear movimiento (`tipo`, `monto`, `fecha`, `categoria`, `billetera`, `descripcion opcional`).
- Listar movimientos en tabla o lista.
- Editar movimiento existente.
- Eliminar movimiento.

### 3) Gestion de billeteras

- Crear billetera.
- Editar nombre de billetera.
- Eliminar billetera sin romper datos existentes.
- Visualizar saldo por billetera.

### 4) Gestion de categorias

- Crear categorias personalizadas.
- Editar categorias.
- Eliminar categorias.
- Asignar categoria a cada movimiento.

### 5) Filtros

- Filtro por rango de fechas.
- Filtro por categoria.
- Filtro por tipo (`ingreso` o `gasto`).
- Los filtros deben actualizar resumen y listado.

## Criterios de Aceptacion

- Si creo un ingreso, el saldo total aumenta correctamente.
- Si creo un gasto, el saldo total disminuye correctamente.
- Si edito un movimiento, los totales se recalculan sin recargar.
- Si elimino un movimiento, desaparece del listado y se recalculan metricas.
- Si recargo la pagina, los datos permanecen.
- Si aplico filtros, solo se muestran los movimientos que cumplen la condicion.
- Si no hay movimientos, la interfaz no debe romperse.
- El layout debe ser usable en movil y escritorio.

## Reglas Tecnicas

- Sin backend.
- Sin base de datos externa.
- Persistencia obligatoria con `localStorage`.
- Implementacion con `HTML`, `CSS`/`Bootstrap` y `JavaScript` vanilla.
- Codigo organizado en modulos por responsabilidad.

## Estructura Sugerida

```text
/finance-dashboard
|
|-- index.html
|-- /css
|   |-- styles.css
|-- /js
|   |-- app.js
|   |-- storage.js
|   |-- ui.js
|   |-- filters.js
|   |-- validators.js
|-- README.md
```

## Modelo de Datos Minimo (Referencia)

```json
{
  "wallets": [
    { "id": "w1", "name": "Efectivo" }
  ],
  "categories": [
    { "id": "c1", "name": "Alimentacion", "type": "gasto" },
    { "id": "c2", "name": "Salario", "type": "ingreso" }
  ],
  "transactions": [
    {
      "id": "t1",
      "type": "gasto",
      "amount": 50000,
      "date": "2026-02-11",
      "categoryId": "c1",
      "walletId": "w1",
      "description": "Supermercado"
    }
  ]
}
```

## Checklist de Implementacion

- [ ] Estructura base HTML creada.
- [ ] Dashboard con tarjetas de resumen operativo.
- [ ] Formularios para CRUD de movimientos, billeteras y categorias.
- [ ] Listado de movimientos con acciones editar/eliminar.
- [ ] Filtros funcionales por fecha, categoria y tipo.
- [ ] Persistencia completa en `localStorage`.
- [ ] Validaciones basicas (monto > 0, fecha valida, campos obligatorios).
- [ ] Prueba manual de flujo completo (crear, editar, eliminar, recargar).
- [ ] Ajuste responsive para movil.

## Mejoras Futuras (Post-MVP)

- Graficos con Chart.js.
- Exportar movimientos a CSV.
- Importar datos desde CSV.
- Modo oscuro.
- Presupuestos mensuales con alertas.

## Autor

Proyecto con fines educativos y practicos.
