# TODO - Ajustes Admin Hub RRHH + Menú del Día + Desvinculaciones + Mini CMS Noticias

- [x] 1) Extender estado global (`js/state.js`)
  - [x] Agregar roles y contraseñas (`ADMIN_PASSWORDS`, `adminRole`)
  - [x] Agregar helpers de Menú del Día (`getMenuDelDia`, `saveMenuDelDia`, `clearMenuDelDia`)
  - [x] Agregar helpers de Desvinculaciones (`getDesvinculaciones`, `saveDesvinculaciones`)

- [x] 2) Actualizar Admin Hub (`js/controllers/admin.js`)
  - [x] Login por rol IT/RRHH
  - [x] Tabs dinámicos por rol
  - [x] Quitar `Directorio` y `Nomenclaturas` del Admin Hub
  - [x] Agregar tab `Menú del Día` (subir/cambiar/eliminar imagen)
  - [x] Agregar tab `Desvinculaciones` (form + tabla + exportar + importar CSV/TSV)

- [x] 3) Actualizar Dashboard (`js/controllers/dashboard.js`)
  - [x] Cambiar botón a `VER MENÚ DEL DÍA`
  - [x] Agregar popup/modal para mostrar imagen del menú del día
  - [x] Mensaje cuando no exista imagen configurada

- [x] 4) Actualizar markup base (`index.html`)
  - [x] Dejar tabs iniciales mínimos (se regeneran por rol desde JS)

- [ ] 5) Verificación rápida
  - [ ] Validar flujos RRHH e IT
  - [ ] Validar persistencia en `localStorage`

- [ ] 6) Mini CMS de Noticias (nuevo)
  - [x] Admin: agregar campo detalle largo en formulario
  - [x] Admin: guardar detalle y limitar colección a 4
  - [x] Admin: mostrar resumen de detalle en tabla
  - [x] Home: mostrar máximo 4 noticias
  - [x] Home: agregar “Ver más” con modal de contenido completo
  - [x] Compatibilidad con noticias antiguas sin `detalle`
  - [x] Ajustar legibilidad visual de tabla Desvinculaciones (fuentes/márgenes/evitar cortes)

- [x] 7) Mejoras solicitadas: seguimiento AD en Desvinculaciones
  - [x] Agregar estado por registro (`pendiente_ad` / `procesado_ad`)
  - [x] Agregar panel de estadísticas (total/pendientes/procesados/%)
  - [x] Agregar columna Estado + acciones para cambiar estado
  - [x] Incluir estado en exportación e importación
  - [x] Ordenar listado con pendientes primero
