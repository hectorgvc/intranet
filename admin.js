// ---> [ MÓDULO: ADMIN HUB ] <---
// Roles: 'it' = acceso total | 'rrhh' = Noticias + Desvinculaciones

// ─────────────────────────────────────────────
// LOGIN / LOGOUT
// ─────────────────────────────────────────────

function loginAdmin() {
  const pw = document.getElementById('adminPassword').value.trim();
  let role = null;

  if (pw === ADMIN_PASSWORDS.it)   role = 'it';
  if (pw === ADMIN_PASSWORDS.rrhh) role = 'rrhh';

  if (role) {
    adminLoggedIn = true;
    adminRole = role;
    document.getElementById('adminLogin').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
    document.getElementById('adminError').classList.add('hidden');
    _buildAdminTabs();
    // Abrir en noticias por defecto
    const firstTab = document.querySelector('.admin-tab');
    switchAdminTab('noticias', firstTab);
  } else {
    document.getElementById('adminError').classList.remove('hidden');
  }
}

function logoutAdmin() {
  adminLoggedIn = false;
  adminRole = null;
  document.getElementById('adminLogin').classList.remove('hidden');
  document.getElementById('adminPanel').classList.add('hidden');
  document.getElementById('adminPassword').value = '';
}

/** Construye las pestañas según el rol */
function _buildAdminTabs() {
  const tabBar = document.querySelector('#adminPanel .flex.items-center');
  if (!tabBar) return;

  const tabsDiv = tabBar.querySelector('.flex:first-child');
  if (!tabsDiv) return;

  // Limpiar tabs existentes (excepto el botón de logout)
  tabsDiv.innerHTML = '';

  const tabsIT = [
    { id: 'noticias',        label: 'Noticias (Hero)' },
    { id: 'menuDelDia',      label: 'Menú del Día' },
    { id: 'desvinculaciones',label: 'Desvinculaciones' },
    { id: 'directorio',      label: 'Directorio' },
    { id: 'portalesAdmin',   label: 'Portal Links' },
  ];

  const tabsRRHH = [
    { id: 'noticias',        label: 'Noticias (Hero)' },
    { id: 'menuDelDia',      label: 'Menú del Día' },
    { id: 'desvinculaciones',label: 'Desvinculaciones' },
  ];

  const tabs = adminRole === 'it' ? tabsIT : tabsRRHH;

  tabs.forEach((t, i) => {
    const btn = document.createElement('button');
    btn.className = 'admin-tab' + (i === 0 ? ' active' : '');
    btn.textContent = t.label;
    btn.setAttribute('data-tab', t.id);
    btn.onclick = function() { switchAdminTab(t.id, this); };
    tabsDiv.appendChild(btn);
  });

  // Badge de rol
  const badge = document.createElement('span');
  badge.className = 'text-xs font-bold px-2 py-1 rounded-full ml-3 ' +
    (adminRole === 'it' ? 'bg-[#0f4c5c] text-white' : 'bg-[#e63329] text-white');
  badge.textContent = adminRole === 'it' ? '👤 IT Admin' : '👤 RRHH';
  tabsDiv.appendChild(badge);

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function switchAdminTab(tabId, btn) {
  if (btn) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
  }
  const container = document.getElementById('adminContentContainer');
  window.currentAdminTab = tabId;

  if (tabId === 'noticias')         container.innerHTML = buildAdminNoticias();
  if (tabId === 'menuDelDia')       container.innerHTML = buildAdminMenuDelDia();
  if (tabId === 'desvinculaciones') container.innerHTML = buildAdminDesvinculaciones();
  if (tabId === 'directorio')       container.innerHTML = buildAdminDirectorio();
  if (tabId === 'portalesAdmin')    container.innerHTML = buildAdminPortales();

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ─────────────────────────────────────────────
// TAB: NOTICIAS (Hero)
// ─────────────────────────────────────────────

function buildAdminNoticias() {
  return `
    <div class="card p-6 mb-6 shadow-sm border border-gray-200">
      <h3 class="font-bold text-lg mb-4 text-[#0f4c5c] flex items-center gap-2">
        <i data-lucide="megaphone" class="w-5 h-5"></i> Agregar Nuevo Comunicado
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input id="anTitle"  type="text" placeholder="Título del aviso" class="input-field md:col-span-2">
        <input id="anAuthor" type="text" placeholder="Autor / Departamento (Ej. RRHH)" class="input-field">
        <input id="anImage"  type="text" placeholder="URL de la imagen (Opcional)" class="input-field">
      </div>
      <button onclick="saveNoticia()" class="btn-primary w-full md:w-auto">Publicar Comunicado</button>
    </div>
    <div class="card overflow-x-auto border-gray-200">
      <table class="data-table">
        <thead><tr><th>Título</th><th>Autor</th><th>Fecha</th><th>Acciones</th></tr></thead>
        <tbody>
          ${noticias.map(n => `
            <tr>
              <td class="font-bold text-[#111] max-w-[200px] truncate" title="${n.titulo}">${n.titulo}</td>
              <td class="text-sm font-medium text-gray-600">${n.autor}</td>
              <td class="text-sm">${n.fecha}</td>
              <td><button onclick="deleteNoticia(${n.id})" class="text-[#e63329] border border-[#e63329] rounded px-3 py-1 hover:bg-red-50 text-xs font-bold uppercase transition">Eliminar</button></td>
            </tr>
          `).join('')}
          ${noticias.length === 0 ? '<tr><td colspan="4" class="text-center py-6 text-gray-500 italic">No hay comunicados activos.</td></tr>' : ''}
        </tbody>
      </table>
    </div>`;
}

function saveNoticia() {
  const t = document.getElementById('anTitle').value;
  const a = document.getElementById('anAuthor').value || 'Institucional';
  const i = document.getElementById('anImage').value  || `https://ui-avatars.com/api/?name=${encodeURIComponent(a)}&background=2a7d7b&color=fff&size=200`;
  if (!t) return showToast('⚠️ El título es obligatorio');
  const now   = new Date();
  const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  noticias.unshift({ id: Date.now(), titulo: t, autor: a, imagen: i, fecha: `${now.getDate()} ${meses[now.getMonth()]} ${now.getFullYear()}` });
  if (noticias.length > 5) noticias.pop();
  saveData(); showToast('✅ Aviso publicado'); switchAdminTab('noticias');
}

function deleteNoticia(id) {
  if (!confirm('¿Eliminar esta noticia del dashboard?')) return;
  noticias = noticias.filter(x => x.id !== id);
  saveData(); switchAdminTab('noticias'); showToast('🗑️ Aviso borrado');
}

// ─────────────────────────────────────────────
// TAB: MENÚ DEL DÍA
// ─────────────────────────────────────────────

function buildAdminMenuDelDia() {
  const menu = getMenuDelDia();
  const tieneImagen = menu && menu.src;

  return `
    <div class="card p-6 mb-6 border-gray-200">
      <h3 class="font-bold text-lg mb-1 text-[#0f4c5c] flex items-center gap-2">
        <i data-lucide="utensils" class="w-5 h-5"></i> Imagen del Menú del Día
      </h3>
      <p class="text-sm text-gray-500 mb-5">Esta imagen aparecerá en el lightbox cuando los usuarios hagan clic en <strong>"Ver Menú del Día"</strong> en el inicio.</p>

      <!-- Upload desde PC -->
      <div class="mb-4">
        <label class="block text-sm font-semibold text-gray-700 mb-2">Subir imagen desde tu PC</label>
        <input type="file" id="menuFileInput" accept="image/*" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#eefbfa] file:text-[#2a7d7b] hover:file:bg-[#d5f4f2] cursor-pointer" onchange="previewMenuFile(this)">
      </div>

      <div class="flex items-center gap-4 my-3">
        <hr class="flex-1 border-gray-200">
        <span class="text-xs text-gray-400 font-semibold uppercase">ó</span>
        <hr class="flex-1 border-gray-200">
      </div>

      <!-- URL -->
      <div class="mb-5">
        <label class="block text-sm font-semibold text-gray-700 mb-2">Pegar URL de imagen</label>
        <div class="flex gap-2">
          <input id="menuUrlInput" type="url" placeholder="https://..." class="input-field flex-1" value="${tieneImagen && menu.type === 'url' ? menu.src : ''}">
          <button onclick="saveMenuUrl()" class="btn-primary whitespace-nowrap">Guardar URL</button>
        </div>
      </div>

      <!-- Preview -->
      <div id="menuPreviewZone" class="${tieneImagen ? '' : 'hidden'} mt-4">
        <p class="text-sm font-semibold text-gray-700 mb-2">Vista previa actual:</p>
        <div class="relative inline-block">
          <img id="menuPreviewImg" src="${tieneImagen ? menu.src : ''}" alt="Menú del Día" class="max-h-64 rounded-lg border border-gray-200 shadow-sm object-contain">
          <button onclick="eliminarMenuDelDia()" class="absolute top-2 right-2 bg-[#e63329] text-white text-xs font-bold px-2 py-1 rounded hover:bg-[#c8241b] transition">✕ Quitar</button>
        </div>
      </div>

      ${!tieneImagen ? '<div class="mt-4 p-6 border-2 border-dashed border-gray-200 rounded-lg text-center text-gray-400 text-sm"><i data-lucide="image" class="w-8 h-8 mx-auto mb-2 opacity-40"></i><p>No hay imagen cargada.</p></div>' : ''}
    </div>`;
}

function previewMenuFile(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const src = e.target.result;
    saveMenuDelDia({ type: 'file', src });
    showToast('✅ Imagen guardada');
    switchAdminTab('menuDelDia');
  };
  reader.readAsDataURL(file);
}

function saveMenuUrl() {
  const url = document.getElementById('menuUrlInput').value.trim();
  if (!url) return showToast('⚠️ Ingresa una URL válida');
  saveMenuDelDia({ type: 'url', src: url });
  showToast('✅ URL guardada'); switchAdminTab('menuDelDia');
}

function eliminarMenuDelDia() {
  if (!confirm('¿Quitar la imagen del menú del día?')) return;
  localStorage.removeItem('promese_menu_dia');
  showToast('🗑️ Imagen eliminada'); switchAdminTab('menuDelDia');
}

// ─────────────────────────────────────────────
// TAB: DESVINCULACIONES
// ─────────────────────────────────────────────

function buildAdminDesvinculaciones() {
  const registros = getDesvinculaciones();
  const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const mesOptions = MESES.map((m, i) => `<option value="${m}">${m}</option>`).join('');

  const rows = registros.length ? registros.map((r, idx) => `
    <tr>
      <td class="text-sm font-semibold text-[#0f4c5c]">${r.mes}</td>
      <td class="font-bold text-[#111]">${r.nombre}</td>
      <td class="text-sm text-gray-600">${r.cargo}</td>
      <td class="text-sm">${r.razon}</td>
      <td class="text-xs text-gray-400">${r.fecha || ''}</td>
      <td>
        <button onclick="deleteDesvinculacion(${idx})" class="text-[#e63329] border border-[#e63329] rounded px-2 py-1 hover:bg-red-50 text-xs font-bold uppercase transition">Borrar</button>
      </td>
    </tr>`).join('') :
    '<tr><td colspan="6" class="text-center py-8 text-gray-400 italic">No hay registros de desvinculaciones.</td></tr>';

  return `
    <div class="card p-6 mb-6 border-gray-200">
      <h3 class="font-bold text-lg mb-1 text-[#0f4c5c] flex items-center gap-2">
        <i data-lucide="user-x" class="w-5 h-5"></i> Registrar Desvinculación
      </h3>
      <p class="text-sm text-gray-500 mb-5">Registra el egreso de un colaborador para notificar a IT y gestionar permisos.</p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Mes</label>
          <select id="dvMes" class="input-field">
            <option value="">Seleccionar mes...</option>
            ${mesOptions}
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Nombre y Apellido</label>
          <input id="dvNombre" type="text" placeholder="Nombre completo" class="input-field">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Cargo</label>
          <input id="dvCargo" type="text" placeholder="Cargo que ocupaba" class="input-field">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Razón</label>
          <select id="dvRazon" class="input-field">
            <option value="">Seleccionar...</option>
            <option>Renuncia voluntaria</option>
            <option>Terminación de contrato</option>
            <option>Jubilación</option>
            <option>Destitución</option>
            <option>Otro</option>
          </select>
        </div>
      </div>
      <button onclick="saveDesvinculacion()" class="btn-primary flex items-center gap-2">
        <i data-lucide="plus" class="w-4 h-4"></i> Registrar
      </button>
    </div>

    <div class="card border-gray-200 overflow-x-auto">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <span class="font-bold text-[#111]">Historial de Desvinculaciones</span>
          <span class="ml-2 text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">${registros.length} registros</span>
        </div>
        <button onclick="exportDesvinculacionesXLS()" class="btn-outline flex items-center gap-2 text-sm">
          <i data-lucide="download" class="w-4 h-4"></i> Exportar Excel
        </button>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>Mes</th>
            <th>Nombre y Apellido</th>
            <th>Cargo</th>
            <th>Razón</th>
            <th>Fecha Registro</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
}

function saveDesvinculacion() {
  const mes    = document.getElementById('dvMes').value;
  const nombre = document.getElementById('dvNombre').value.trim();
  const cargo  = document.getElementById('dvCargo').value.trim();
  const razon  = document.getElementById('dvRazon').value;

  if (!mes)    return showToast('⚠️ Selecciona el mes');
  if (!nombre) return showToast('⚠️ El nombre es obligatorio');
  if (!cargo)  return showToast('⚠️ El cargo es obligatorio');
  if (!razon)  return showToast('⚠️ Selecciona una razón');

  const now    = new Date();
  const meses  = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const fecha  = `${now.getDate()} ${meses[now.getMonth()]} ${now.getFullYear()}`;

  const arr = getDesvinculaciones();
  arr.unshift({ mes, nombre, cargo, razon, fecha });
  saveDesvinculaciones(arr);

  showToast('✅ Desvinculación registrada');
  switchAdminTab('desvinculaciones');
}

function deleteDesvinculacion(idx) {
  if (!confirm('¿Eliminar este registro?')) return;
  const arr = getDesvinculaciones();
  arr.splice(idx, 1);
  saveDesvinculaciones(arr);
  showToast('🗑️ Registro eliminado');
  switchAdminTab('desvinculaciones');
}

function exportDesvinculacionesXLS() {
  const registros = getDesvinculaciones();
  if (!registros.length) return showToast('⚠️ No hay registros para exportar');

  // Generar CSV con separador de tabulación → Excel lo reconoce directamente
  let csv = 'Mes\tNombre y Apellido\tCargo\tRazón\tFecha Registro\n';
  registros.forEach(r => {
    csv += `${r.mes}\t${r.nombre}\t${r.cargo}\t${r.razon}\t${r.fecha || ''}\n`;
  });

  const blob = new Blob(['\ufeff' + csv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `desvinculaciones_promesecal_${new Date().getFullYear()}.xls`;
  a.click();
  showToast('✅ Archivo Excel descargado');
}

// ─────────────────────────────────────────────
// TAB: DIRECTORIO (solo IT)
// ─────────────────────────────────────────────

function buildAdminDirectorio() {
  return `
    <div class="card p-6 mb-6">
      <h3 class="font-bold text-lg mb-4 text-[#0f4c5c]"><i data-lucide="users" class="inline w-5 h-5 mr-1"></i> Control Rápido de Directorio</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <input id="adExt"    type="text" placeholder="Ext." class="input-field">
        <input id="adNombre" type="text" placeholder="Nombre completo" class="input-field">
        <input id="adCargo"  type="text" placeholder="Cargo" class="input-field">
        <input id="adDepto"  type="text" placeholder="Departamento" class="input-field">
      </div>
      <button onclick="saveDirAdmin()" class="btn-primary">Añadir al directorio</button>
    </div>
    <div class="card overflow-x-auto max-h-96">
      <table class="data-table">
        <thead class="sticky top-0 shadow-sm"><tr><th>Ext</th><th>Nombre Completo</th><th>Acción</th></tr></thead>
        <tbody>
          ${directorio.slice(0, 50).map(d => `
            <tr>
              <td class="font-mono text-[#0f4c5c] font-bold">${d.extension}</td>
              <td class="truncate max-w-[200px] text-sm">${d.nombre}</td>
              <td><button onclick="deleteDirAdmin(${d.id})" class="text-red-500 font-bold hover:underline text-xs uppercase">Borrar</button></td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

function saveDirAdmin() {
  const e = document.getElementById('adExt').value;
  const n = document.getElementById('adNombre').value;
  if (!e || !n) return showToast('Nombre y Extensión son obligatorios');
  directorio.unshift({ id: Date.now(), extension: e, nombre: n, cargo: document.getElementById('adCargo').value, departamento: document.getElementById('adDepto').value, correo: '' });
  saveData(); switchAdminTab('directorio'); showToast('Contacto guardado');
}

function deleteDirAdmin(id) {
  directorio = directorio.filter(d => d.id !== id);
  saveData(); switchAdminTab('directorio'); showToast('Contacto borrado');
}

// ─────────────────────────────────────────────
// TAB: PORTAL LINKS (solo IT)
// ─────────────────────────────────────────────

function buildAdminPortales() {
  return `<div class="card p-10 text-center">
    <i data-lucide="grid" class="w-12 h-12 text-gray-300 mx-auto mb-4"></i>
    <h3 class="font-bold text-gray-600">Configuración de Links</h3>
    <p class="text-sm mt-2 text-gray-400">Módulo gestionado desde Base de Datos</p>
  </div>`;
}
