# Plan de Implementación — Login con Active Directory (JS/Node) para Admin Hub

## Objetivo
Habilitar autenticación por usuario/clave contra Active Directory local para el acceso al **Admin Hub**, reemplazando la clave única actual, manteniendo control de permisos por rol:

- **RRHH**: acceso a `Noticias (Hero)`, `Menú del Día`, `Desvinculaciones`.
- **IT/Admin**: acceso total del Admin Hub.

> Nota: Se implementará en **JavaScript con Node.js (backend)**.  
> En frontend puro no es seguro ni viable conectar LDAP/AD directamente.

---

## Alcance funcional

1. **Autenticación AD real** (usuario + contraseña) mediante LDAP.
2. **Autorización por lista permitida** (fase inicial):
   - `Estefany Morillo Romero` → rol `rrhh`
   - `Hector Gregory Velez Comas` → rol `it`
3. **API de login** para el frontend:
   - `POST /api/auth/login`
4. **Frontend Admin Hub**:
   - Reemplazar login de contraseña única por `usuario + contraseña`.
   - Consumir API y establecer rol en sesión local.
5. Mantener módulos ya implementados:
   - Menú del Día (popup y gestión en admin).
   - Desvinculaciones (estado pendiente/procesado, import/export, estadísticas).

---

## Datos AD suministrados

```env
LDAP_HOST=promese.promesecal.gob.do
LDAP_PORT=389
LDAP_DOMAIN=promese.promesecal.gob.do
LDAP_BASE_DN=DC=promese,DC=promesecal,DC=gob,DC=do
```

---

## Arquitectura propuesta

### Frontend (actual)
- Sigue sirviendo la intranet y el Admin Hub.
- `loginAdmin()` enviará credenciales al backend:
  - body: `{ username, password }`
- Si responde OK:
  - guardar sesión (rol, nombre) en `sessionStorage`/estado
  - render de tabs por rol como ya está implementado.

### Backend Node.js (nuevo)
- Servidor Express mínimo:
  - `POST /api/auth/login`
- Flujo:
  1. Construye usuario AD (`username@promese.promesecal.gob.do`) o bind alterno.
  2. Hace bind LDAP con contraseña recibida.
  3. Busca atributos de usuario (`displayName`, `cn`, `sAMAccountName`, `mail`).
  4. Evalúa whitelist y asigna rol.
  5. Devuelve JSON:
     ```json
     { "ok": true, "role": "rrhh|it", "displayName": "..." }
     ```

---

## Seguridad (fase oficina)

1. **Sin hardcode de claves** en frontend.
2. Variables sensibles en `.env`.
3. Sanitización básica de input.
4. Limitar mensajes de error (no filtrar detalles LDAP).
5. (Recomendado en siguiente fase) migrar LDAP a LDAPS/StartTLS si disponible.
6. (Recomendado) sesión segura con cookie httpOnly en lugar de storage frontend.

---

## Archivos a crear/modificar (plan)

### Nuevos
- `server.js` (API Express auth LDAP)
- `package.json` (dependencias backend)
- `.env.example` (config LDAP + whitelist)
- `README-auth.md` (cómo ejecutar en red interna)

### Modificar
- `index.html`
  - Form login admin con campo `usuario` + `contraseña`
- `js/controllers/admin.js`
  - `loginAdmin()` consumiendo `/api/auth/login`
  - manejo de respuesta y rol
- `js/state.js`
  - ajustar/remover dependencia de contraseña única local para admin

---

## Variables de entorno sugeridas

```env
PORT=3000
LDAP_HOST=promese.promesecal.gob.do
LDAP_PORT=389
LDAP_DOMAIN=promese.promesecal.gob.do
LDAP_BASE_DN=DC=promese,DC=promesecal,DC=gob,DC=do

# Lista permitida inicial (fase 1)
ALLOW_RRHH=Estefany Morillo Romero
ALLOW_IT=Hector Gregory Velez Comas
```

---

## Criterios de aceptación

1. Usuario AD válido + en whitelist entra al Admin Hub.
2. Usuario AD válido + fuera de whitelist recibe “sin permisos”.
3. Usuario/clave inválido AD recibe “credenciales inválidas”.
4. RRHH solo ve tabs permitidas.
5. IT ve tabs completas.
6. No existe contraseña maestra hardcodeada en frontend para producción interna.

---

## Plan de pruebas (cuando estés en oficina)

### Prueba rápida (crítica)
1. Login con usuario RRHH real.
2. Login con usuario IT real.
3. Intento con usuario válido AD sin permisos.
4. Intento con credenciales erróneas.
5. Verificación de tabs por rol.

### Prueba completa
1. Todo lo anterior + persistencia de sesión.
2. Menú del Día (subir/cambiar/eliminar + popup home).
3. Desvinculaciones:
   - crear
   - cambiar estado
   - estadísticas
   - importar/exportar
4. Refresh y validación de localStorage/session.
5. Prueba desde 2 equipos en red interna.

---

## Riesgos y mitigaciones

- **Conectividad LDAP fuera de oficina**: esperado; validar solo en red interna.
- **LDAP sin TLS**: permitir fase interna temporal; planificar hardening.
- **Atributo de nombre variable (`cn` vs `displayName`)**:
  - implementar fallback en mapeo.
- **Cambios de nombres de usuario**:
  - migrar luego a validación por grupo AD (recomendado).

---

## Próximo paso acordado
Dejar este plan versionado y listo; implementación y pruebas finales en oficina con acceso al AD local.
