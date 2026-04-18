# Plan de Migración — Intranet PROMESE/CAL (IIS + PostgreSQL)

## Objetivo

Migrar la persistencia actual basada en `localStorage` hacia una arquitectura interna, simple y mantenible en **Windows Server + IIS + PostgreSQL**, manteniendo la UI existente y los flujos ya implementados:

- Noticias (Hero) con detalle HTML y modal “Ver más”
- Menú del Día (imagen gestionada por RRHH)
- Desvinculaciones (formulario, tabla, importación/exportación)

---

## 1) Alcance de la migración

### Módulos incluidos
1. **Noticias**
   - Crear, editar, eliminar
   - Detalle enriquecido (HTML permitido con sanitización)
   - Mostrar últimas 4 en Home

2. **Menú del Día**
   - Subir/cambiar/eliminar imagen
   - Mostrar popup desde botón “VER MENÚ DEL DÍA”

3. **Desvinculaciones**
   - CRUD básico
   - Estado (`pendiente_ad` / `procesado_ad`)
   - Importar CSV/TSV
   - Exportar Excel (TSV/XLS)

### Roles
- **RRHH**: acceso a Noticias + Menú del Día + Desvinculaciones
- **IT/Admin**: acceso completo (como está hoy)

---

## 2) Arquitectura objetivo (simple)

###[Frontend (actual)]
- Sitio estático servido por IIS.
- Mantener estructura actual de vistas y controladores JS.
- Reemplazar gradualmente `localStorage` por llamadas `fetch` a API.

###[Backend API (interno)]
- Opción recomendada simple: **Node.js + Express** (también válido .NET minimal API).
- API privada dentro de red corporativa.
- Sanitización HTML del lado servidor (además del cliente).

###[Base de datos]
- **PostgreSQL** on-premise (sin licencias SQL Server).
- Esquema pequeño con tablas de negocio.

###[Archivos (imágenes)]
- Carpeta local del servidor, por ejemplo:
  - `D:\IntranetData\uploads\menu-dia\`
  - `D:\IntranetData\uploads\noticias\` (si se decide soportar upload directo de imágenes en noticias)
- Guardar en BD solo metadatos y rutas.

---

## 3) Preparación de servidor (Windows + IIS)

1. Crear servidor/VM interno (si no existe).
2. Instalar IIS con componentes necesarios:
   - Static Content
   - URL Rewrite
   - (Opcional) ARR si usarán reverse proxy a API.
3. Configurar sitio IIS para frontend (ruta física del proyecto compilado/estático).
4. Habilitar HTTPS interno (certificado corporativo si aplica).
5. Restringir acceso por red interna/firewall.

---

## 4) Instalación PostgreSQL (on-prem)

1. Instalar PostgreSQL (versión estable LTS).
2. Crear base de datos:
   - `intranet_promesecal`
3. Crear usuario de aplicación (mínimos privilegios), por ejemplo:
   - `intranet_app`
4. Configurar acceso local/interno únicamente.
5. Definir política de backups:
   - `pg_dump` diario + retención semanal/mensual.

---

## 5) Modelo de datos propuesto

## Tabla: `noticias`
- `id` (bigserial, pk)
- `titulo` (text, not null)
- `autor` (text, not null)
- `imagen_url` (text, null)
- `detalle_html` (text, null)
- `fecha_publicacion` (timestamp, not null default now())
- `creado_por` (text, null)
- `actualizado_en` (timestamp, null)

## Tabla: `menu_dia`
- `id` (smallint, pk, fijo = 1)
- `imagen_path` (text, not null)
- `imagen_nombre` (text, null)
- `actualizado_en` (timestamp, not null default now())
- `actualizado_por` (text, null)

## Tabla: `desvinculaciones`
- `id` (bigserial, pk)
- `mes` (varchar(20), not null)
- `nombre` (text, not null)
- `cargo` (text, not null)
- `razon` (text, not null)
- `estado` (varchar(20), not null default 'pendiente_ad')
- `fecha_registro` (timestamp, not null default now())
- `creado_por` (text, null)

Índices sugeridos:
- `noticias(fecha_publicacion desc)`
- `desvinculaciones(estado, fecha_registro desc)`

---

## 6) API mínima requerida

## Noticias
- `GET /api/noticias?limit=4`
- `GET /api/noticias/:id`
- `POST /api/noticias`
- `PUT /api/noticias/:id`
- `DELETE /api/noticias/:id`

Reglas:
- En Home mostrar últimas 4.
- Sanitizar `detalle_html` en backend.

## Menú del Día
- `GET /api/menu-dia`
- `POST /api/menu-dia` (multipart upload o base64 controlado)
- `DELETE /api/menu-dia`

## Desvinculaciones
- `GET /api/desvinculaciones`
- `POST /api/desvinculaciones`
- `PUT /api/desvinculaciones/:id` (estado/edición)
- `DELETE /api/desvinculaciones/:id`
- `POST /api/desvinculaciones/import` (CSV/TSV)
- `GET /api/desvinculaciones/export` (TSV/XLS)

---

## 7) Seguridad (mínima necesaria)

1. API accesible solo en red interna.
2. Sanitizar HTML en backend (whitelist tags seguras).
3. Bloquear:
   - `<script>`
   - atributos `on*`
   - `javascript:` en links/src
4. Validar subida de archivos:
   - tipo MIME
   - tamaño máximo
   - nombres seguros
5. Evitar permisos de escritura amplios en carpetas uploads.
6. Logs de auditoría básicos (quién/qué/cuándo en cambios críticos).

---

## 8) Estrategia de migración por fases

### Fase 0 — Respaldo y baseline
- Exportar datos actuales de `localStorage` (manual desde navegador o script temporal).
- Snapshot del código actual (tag/commit de referencia).

### Fase 1 — Backend + BD
- Levantar API interna conectada a PostgreSQL.
- Implementar endpoints de Noticias/Menú/Desvinculaciones.
- Probar con Postman/curl en red interna.

### Fase 2 — Integración frontend (sin romper UI)
- En `services.js`, crear capa API.
- Mantener fallback temporal a `localStorage` si API no responde.
- Migrar módulo por módulo:
  1) Noticias
  2) Menú del Día
  3) Desvinculaciones

### Fase 3 — Carga de datos inicial
- Importar datos existentes al nuevo esquema.
- Validar conteos y consistencia.

### Fase 4 — Corte operativo
- Desactivar fallback `localStorage`.
- Forzar uso de API + BD.
- Habilitar monitoreo y backups diarios.

---

## 9) Checklist de implementación (lunes)

## Infraestructura
- [ ] IIS configurado y sitio publicado
- [ ] PostgreSQL instalado y DB creada
- [ ] Usuario app con privilegios mínimos
- [ ] Carpeta uploads creada con permisos correctos
- [ ] Firewall interno aplicado

## Backend
- [ ] Proyecto API creado
- [ ] Conexión PostgreSQL estable
- [ ] Endpoints Noticias listos
- [ ] Endpoints Menú del Día listos
- [ ] Endpoints Desvinculaciones listos
- [ ] Sanitización HTML backend implementada
- [ ] Validación de uploads implementada

## Frontend
- [ ] `services.js` con cliente API
- [ ] Noticias migradas a API
- [ ] Menú del Día migrado a API
- [ ] Desvinculaciones migradas a API
- [ ] Fallback local temporal (solo transición)
- [ ] QA visual y funcional completo

## Datos y operación
- [ ] Migración de datos localStorage → PostgreSQL
- [ ] Prueba de backup y restore
- [ ] Documentar runbook de reinicio y soporte

---

## 10) Pruebas recomendadas (antes de go-live)

## Funcionales
- Crear/editar/eliminar noticia
- Render de HTML enriquecido (h1/h2/img/listas/links)
- Botón “Ver más” modal correcto
- Menú del Día subir/mostrar/eliminar
- Desvinculaciones CRUD + estado + import/export

## Seguridad básica
- Inyección de scripts bloqueada
- Links `javascript:` bloqueados
- Upload inválido rechazado

## Persistencia
- Datos visibles entre distintos equipos/usuarios internos
- Reinicio de IIS/API no pierde datos
- Restore desde backup validado

---

## 11) Riesgos y mitigación

1. **Riesgo:** pérdida de datos locales no migrados  
   **Mitigación:** export previo de localStorage y validación de carga.

2. **Riesgo:** sanitización insuficiente  
   **Mitigación:** doble sanitización (frontend + backend), pruebas XSS.

3. **Riesgo:** permisos incorrectos en uploads  
   **Mitigación:** ACL mínima y rutas fijas.

4. **Riesgo:** dependencia de una sola VM  
   **Mitigación:** backups + snapshot + plan de recuperación.

---

## 12) Recomendación final

Para una intranet privada en IIS, la combinación **PostgreSQL on-prem + API interna + almacenamiento local controlado** es la opción más simple, económica y segura frente a mantener `localStorage` o depender de un servicio cloud externo.
