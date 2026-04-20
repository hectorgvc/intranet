// =====================================================================
// 1. STATE & DATA (Modelo - Única fuente de verdad)
// =====================================================================

const DEFAULT_PORTALES = [
  { id: 1, categoria: 'Sistemas Internos / Externos', nombre: 'Carpeta Compartida', url: 'https://promesecal1.sharepoint.com/Documentos%20compartidos/Forms/AllItems.aspx', descripcion: 'Documentos compartidos en SharePoint', icono: 'folder' },
  { id: 2, categoria: 'Sistemas Internos / Externos', nombre: 'Correo Institucional', url: 'https://outlook.cloud.microsoft/mail/', descripcion: 'Acceso al correo @promesecal.gob.do', icono: 'mail' },
  { id: 3, categoria: 'Sistemas Internos / Externos', nombre: 'Dynamics 365', url: 'https://login.microsoftonline.com/0503b823-2203-40b2-9a56-7160e119e07e/oauth2/authorize?client_id=00000015-0000-0000-c000-000000000000&response_type=code%20id_token&scope=openid%20profile&state=OpenIdConnect.AuthenticationProperties%3DAQAAANCMnd8BFdERjHoAwE_Cl-sBAAAA6bK6hrngzEq4UaIJLsKw-wAAAAACAAAAAAAQZgAAAAEAACAAAACOOUjCbLwCZDq6fxq0SRCpGn23MJ_zR2GccCFkvG2ntAAAAAAOgAAAAAIAACAAAABRA_yKCsw0gFE4KwoPTNAqnU_2SRx53EaFqvGg2xnCDEAAAAAjS7KIgv2i3ok4alZqF2qaJriDF26YzcxXOoWCUzLYtaOXLVQb8efGiCETgPxJ5ubonrKSmIoDA2PGKBxi1yH9QAAAAId9tSrRq8P3Hj_8ev5ChRRENN3XgLeVsBJ7-5OM5SIt8vMTpoxHAP-vVyZyJTuC86zy0eZRkkNnieqv6728MpI%26RedirectTo%3Dhttps%253A%252F%252Fpromesecal.operations.dynamics.com%252F&response_mode=form_post&nonce=639117679886090222.ZTkzYmM0YjAtOGFjMi00M2Q3LThjY2QtMjBkNGUzOWZiNGMyZjEzZjUxNjktMjZkMi00MDFjLTljMTUtMjYxMjc0NDMxZWFl&redirect_uri=https%3A%2F%2Fpromesecal.operations.dynamics.com%2F&max_age=86400&x-client-SKU=ID_NET472&x-client-ver=8.3.0.0', descripcion: 'Sistema de inventario y gestión ERP', icono: 'database' },
  { id: 4, categoria: 'Sistemas Internos / Externos', nombre: 'Portal de Farmacias del Pueblo', url: 'http://pfp.promesecal.gob.do/', descripcion: 'Portal de gestión de farmacias', icono: 'home' },
  { id: 5, categoria: 'Sistemas Internos / Externos', nombre: 'SGP — Sistema de Gestión de Pedidos', url: 'http://sgp.promesecal.gob.do/', descripcion: 'Seguimiento y gestión de pedidos', icono: 'package' },
  { id: 6, categoria: 'Sistemas Internos / Externos', nombre: 'Mesa de Ayuda', url: 'https://mesadeayuda.promesecal.gob.do/front/central.php', descripcion: 'Inventario y tickets DTIC (GLPI)', icono: 'headphones' },
  { id: 7, categoria: 'Sistemas Internos / Externos', nombre: 'Sistema de Horas Extras', url: 'http://horasextras.promesecal.gob.do/Login.php', descripcion: 'Registro y reportes de horas extras', icono: 'clock' },
  { id: 8, categoria: 'Sistemas Internos / Externos', nombre: 'Sistema de Registro de Pacientes POSFP', url: 'http://rp.promesecal.gob.do/login.aspx', descripcion: 'Registro de pacientes farmacias del pueblo', icono: 'clipboard-list' },
  { id: 9, categoria: 'Reportes de Operaciones', nombre: 'Recibo de Ingresos', url: 'http://promesevsap11/Reports/Pages/Report.aspx?ItemPath=/Reportes+Viejos/Tesoreria/GP+2018/Cuadre+de+Caja+%281%29', descripcion: 'Reporte de cuadre de caja', icono: 'file-text' },
  { id: 10, categoria: 'Reportes de Operaciones', nombre: 'Existencias por Lotes', url: 'http://reporte.promesecal.gob.do/Reports/Pages/Report.aspx?ItemPath=/Reportes+Viejos/Inventario/GP+2018/EXISTENCIA+POR+LOTE', descripcion: 'Inventario de insumos por lote', icono: 'layers' },
  { id: 11, categoria: 'Aplicaciones Externas (Gobierno)', nombre: 'MAP', url: 'https://map.gob.do/', descripcion: 'Portal del Ministerio de Administración Pública', icono: 'landmark' },
  { id: 12, categoria: 'Aplicaciones Externas (Gobierno)', nombre: 'Portal de Compras', url: 'https://comunidad.comprasdominicana.gob.do/STS/DGCP/Login.aspx', descripcion: 'Compras y Contrataciones Públicas (DGCP)', icono: 'shopping-cart' },
  { id: 13, categoria: 'Aplicaciones Externas (Gobierno)', nombre: 'SIGEF', url: 'https://www.transparenciafiscal.gob.do/web/guest', descripcion: 'Sistema de Gestión Financiera del Estado', icono: 'bar-chart' },
  { id: 14, categoria: 'Aplicaciones Externas (Gobierno)', nombre: 'Volante de Pago', url: 'https://map.gob.do/volantepago', descripcion: 'Consulta de volante de pago del personal', icono: 'credit-card' },
];

const RAW_DIR = `Ext.1050 · ELBYS ALFREDO PAULINO KING · ADMINISTRADOR DE REDES · DEPARTAMENTO DE OPERACIONES TICs
Ext.1503 · LINA PATRICIA MONTAÑO PEÑA DE FELIZ · ASESORA · DIRECCION GENERAL
Ext.1519 · JOCASTA ISABEL MEJIA TELLERIAS · AUXILIAR ADMINISTRATIVA · DEPARTAMENTO FISCALIZACION
Ext.1016 · ELBA DENEB TIO MARRERO · ASISTENTE DIRECCION GENERAL · DIRECCION GENERAL
Ext.1034 · YOLANDA T. MELGEN LOPEZ · ENCARGADO · DEPARTAMENTO ADMINISTRATIVO
Ext.1261 · SOCORRO RAMIREZ TURBI · SECRETARIA · ALMACEN MONUMENTAL
Ext.2201 · LUIS STALIN RODRIGUEZ RAMIREZ · COORDINADOR · ALMACEN MONUMENTAL
Ext.1621 · GISSELL ALTAGRACIA RODRIGUEZ CERDA · RECEPCIONISTA · ALMACEN REGION NORTE
Ext.1622 · YENNY MERCEDES CARABALLO DE GUZMAN · COORDINADORA ALMACEN REGION NORTE · ALMACEN REGION NORTE
Ext.1623 · ALFONSINA DE JESUS MENDEZ REYES · ANALISTA DE RECURSOS HUMANOS · ALMACEN REGION NORTE
Ext.1218 · LUIS MANUEL PENA FELIZ · DIRECTOR DE RECURSOS HUMANOS · DIRECCION DE RECURSOS HUMANOS
Ext.1001 · RECEPCION 1ER NIVEL · RECEPCIONISTA · RECEPCION
Ext.1003 · RECEPCION 2DO NIVEL · RECEPCIONISTA · RECEPCION`;

const DEFAULT_DIRECTORIO = RAW_DIR.trim().split('\n').filter(Boolean).map((line, idx) => {
  const parts = line.split('·').map(s => s.trim().replace(/\u00a0/g, ' '));
  const ext = parts[0] || '';
  const nombre = parts[1] || 'Usuario ' + idx;
  const cargo = parts[2] || 'Sin Cargo';
  const depto = parts[3] || 'Desconocido';
  const names = nombre.split(' ');
  const fname = names[0] ? names[0].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
  const lname = names.length > 1 ? names[names.length-1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : '';
  const correo = `${lname}.${fname}@promesecal.gob.do`;
  return { id: idx+1, nombre, cargo, departamento: depto, extension: ext, correo };
});

const DEFAULT_NOTICIAS = [
  { id: 1, titulo: 'Jornada de Vacunación contra la Influenza 2026', autor: 'Gestión Humana', fecha: '14 Abr 2026', imagen: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=300&q=80' },
  { id: 2, titulo: 'Actualización del sistema Dynamics 365 completada exitosamente', autor: 'DTIC', fecha: '12 Abr 2026', imagen: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=300&q=80' },
  { id: 3, titulo: 'Inauguración de nueva Farmacia del Pueblo en Santiago', autor: 'Dirección General', fecha: '10 Abr 2026', imagen: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=300&q=80' }
];

// ── Roles de acceso ──────────────────────────────────────────────────
// 'it'   → acceso total (contraseña: dtic2025)
// 'rrhh' → acceso a Noticias + Desvinculaciones (contraseña: rrhh2025)
const ADMIN_PASSWORDS = {
  it:   'dtic2025',
  rrhh: 'rrhh2025'   // ← cambia esto en producción
};

let feriados = [];
let directorio = (typeof LDAP_DATA !== 'undefined') ? [...LDAP_DATA] : [...DEFAULT_DIRECTORIO];
let portales = [...DEFAULT_PORTALES];
let noticias = [...DEFAULT_NOTICIAS];

// Estado global de sesión admin
let adminLoggedIn = false;
let adminRole = null; // 'it' | 'rrhh'

// Paginación
let dirPage = 1;

// Estado del calendario navegable
let calYear  = new Date().getFullYear();
let calMonth = new Date().getMonth();

// ── Carga desde localStorage ─────────────────────────────────────────
try {
  const sDir  = localStorage.getItem('promese_directorio');   if (sDir)  directorio    = JSON.parse(sDir);
  const sPor  = localStorage.getItem('promese_portales');      if (sPor)  portales      = JSON.parse(sPor);
  const sNot  = localStorage.getItem('promese_noticias');      if (sNot)  noticias      = JSON.parse(sNot);
} catch(e) { console.log('Error parseando localStorage, usando defaults', e); }

function saveData() {
  localStorage.setItem('promese_directorio', JSON.stringify(directorio));
  localStorage.setItem('promese_portales', JSON.stringify(portales));
  localStorage.setItem('promese_noticias', JSON.stringify(noticias));
}

// ── Helpers: Menú del Día ────────────────────────────────────────────
function getMenuDelDia() {
  try {
    const raw = localStorage.getItem('promese_menu_dia');
    return raw ? JSON.parse(raw) : null;
  } catch(e) { return null; }
}

function saveMenuDelDia(data) {
  localStorage.setItem('promese_menu_dia', JSON.stringify(data));
}

// ── Helpers: Desvinculaciones ────────────────────────────────────────
function getDesvinculaciones() {
  try {
    const raw = localStorage.getItem('promese_desvinculaciones');
    return raw ? JSON.parse(raw) : [];
  } catch(e) { return []; }
}

function saveDesvinculaciones(arr) {
  localStorage.setItem('promese_desvinculaciones', JSON.stringify(arr));
}
