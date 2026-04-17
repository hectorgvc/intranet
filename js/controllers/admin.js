// ---> [ MÓDULO: ADMIN ] <---

// Roles: 'it' = acceso total | 'rrhh' = Noticias + Menú del Día + Desvinculaciones
function loginAdmin() {
  const pw = document.getElementById('adminPassword').value.trim();
  let role = null;

  if (pw === ADMIN_PASSWORDS.it) role = 'it';
  if (pw === ADMIN_PASSWORDS.rrhh) role = 'rrhh';

  if (role) {
    adminLoggedIn = true;
    adminRole = role;

    document.getElementById('adminLogin').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
    document.getElementById('adminError').classList.add('hidden');

    _buildAdminTabs();
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

function _buildAdminTabs() {
  const tabBar = document.querySelector('#adminPanel .flex.items-center');
  if (!tabBar) return;

  const tabsDiv = tabBar.querySelector('.flex');
  if (!tabsDiv) return;

  tabsDiv.innerHTML = '';

  const tabsIT = [
    { id: 'noticias', label: 'Noticias (Hero)' },
    { id: 'menuDelDia', label: 'Menú del Día' },
    { id: 'desvinculaciones', label: 'Desvinculaciones' },
    { id: 'portalesAdmin', label: 'Portal Links' }
  ];

  const tabsRRHH = [
    { id: 'noticias', label: 'Noticias (Hero)' },
    { id: 'menuDelDia', label: 'Menú del Día' },
    { id: 'desvinculaciones', label: 'Desvinculaciones' }
  ];

  const tabs = adminRole === 'it' ? tabsIT : tabsRRHH;

  tabs.forEach((t, i) => {
    const btn = document.createElement('button');
    btn.className = 'admin-tab' + (i === 0 ? ' active' : '');
    btn.textContent = t.label;
    btn.setAttribute('data-tab', t.id);
    btn.onclick = function () { switchAdminTab(t.id, this); };
    tabsDiv.appendChild(btn);
  });

  const badge = document.createElement('span');
  badge.className = 'ml-3 role-badge ' + (adminRole === 'it' ? 'role-badge-it' : 'role-badge-rrhh');
  badge.innerHTML = `
    <i data-lucide="${adminRole === 'it' ? 'shield-check' : 'users'}" class="w-4 h-4"></i>
    <span>${adminRole === 'it' ? 'IT Admin' : 'RRHH'}</span>
  `;
  tabsDiv.appendChild(badge);
}

function switchAdminTab(tabId, btn) {
  if (btn) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
  }

  const container = document.getElementById('adminContentContainer');
  window.currentAdminTab = tabId;

  if (tabId === 'noticias') container.innerHTML = buildAdminNoticias();
  if (tabId === 'menuDelDia') container.innerHTML = buildAdminMenuDelDia();
  if (tabId === 'desvinculaciones') container.innerHTML = buildAdminDesvinculaciones();
  if (tabId === 'portalesAdmin') container.innerHTML = buildAdminPortales();

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// ---------------------------
// ADMIN: Noticias (Hero Dashboard)
// ---------------------------
function buildAdminNoticias() {
  return `
    <div class="card p-6 mb-6 shadow-sm border border-gray-200">
      <h3 class="font-bold text-lg mb-4 text-[#0f4c5c] flex items-center gap-2"><i data-lucide="megaphone" class="w-5 h-5"></i> Agregar Nuevo Comunicado</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input id="anTitle" type="text" placeholder="Título del aviso" class="input-field md:col-span-2">
        <input id="anAuthor" type="text" placeholder="Autor / Departamento (Ej. RRHH)" class="input-field">
        <input id="anImage" type="text" placeholder="URL de la imagen (Opcional)" class="input-field">
      </div>
      <button onclick="saveNoticia()" class="btn-primary w-full md:w-auto">Publicar Comunicado</button>
    </div>
    <div class="card overflow-x-auto border-gray-200">
      <table class="data-table">
        <thead><tr><th>Título</th><th>Autor</th><th>Fecha Publicación</th><th>Acciones</th></tr></thead>
        <tbody>
          ${noticias.map(n => `
            <tr>
              <td class="font-bold text-[#111] max-w-[200px] truncate" title="${n.titulo}">${n.titulo}</td>
              <td class="text-sm font-medium text-gray-600">${n.autor}</td>
              <td class="text-sm border-l-0">${n.fecha}</td>
              <td><button onclick="deleteNoticia(${n.id})" class="text-[#e63329] border border-[#e63329] rounded px-3 py-1 hover:bg-red-50 text-xs font-bold uppercase transition">Eliminar</button></td>
            </tr>
          `).join('')}
          ${noticias.length === 0 ? '<tr><td colspan="4" class="text-center py-6 text-gray-500 italic">No hay comunicados activos.</td></tr>' : ''}
        </tbody>
      </table>
    </div>
  `;
}

function saveNoticia() {
  const t = document.getElementById('anTitle').value.trim();
  const a = document.getElementById('anAuthor').value.trim() || 'Institucional';
  const i = document.getElementById('anImage').value.trim() || `https://ui-avatars.com/api/?name=${a}&background=2a7d7b&color=fff&size=200`;

  if (!t) return showToast('⚠️ El título es obligatorio');

  const now = new Date();
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  noticias.unshift({
    id: Date.now(),
    titulo: t, autor: a, imagen: i,
    fecha: `${now.getDate()} ${meses[now.getMonth()]} ${now.getFullYear()}`
  });

  if (noticias.length > 5) noticias.pop();
  saveData();
  showToast('✅ Aviso publicado en el Dashboard');
  switchAdminTab('noticias');
}

function deleteNoticia(id) {
  if (!confirm('¿Eliminar esta noticia del dashboard?')) return;
  noticias = noticias.filter(x => x.id !== id);
  saveData();
  switchAdminTab('noticias');
  showToast('🗑️ Aviso borrado');
}

// ---------------------------
// ADMIN: Menú del Día
// ---------------------------
function buildAdminMenuDelDia() {
  const menu = getMenuDelDia();
  return `
    <div class="card p-6 mb-6 shadow-sm border border-gray-200">
      <h3 class="font-bold text-lg mb-4 text-[#0f4c5c] flex items-center gap-2"><i data-lucide="utensils" class="w-5 h-5"></i> Menú del Día</h3>
      <p class="text-sm text-gray-500 mb-4">Sube una imagen para que el botón "VER MENÚ DEL DÍA" del inicio la muestre en un popup.</p>
      <div class="flex flex-col md:flex-row gap-3">
        <input id="menuDelDiaFile" type="file" accept="image/*" class="input-field">
        <button onclick="guardarMenuDelDia()" class="btn-primary">Guardar Imagen</button>
        <button onclick="eliminarMenuDelDia()" class="btn-outline">Eliminar</button>
      </div>
    </div>

    <div class="card p-6 border border-gray-200">
      <h4 class="font-bold text-[#111] mb-3">Vista previa</h4>
      ${menu && menu.src
        ? `<img src="${menu.src}" alt="Menú del Día" class="max-h-[420px] w-auto rounded-lg border border-gray-200">`
        : `<p class="text-sm text-gray-500 italic">No hay imagen configurada.</p>`}
    </div>
  `;
}

function guardarMenuDelDia() {
  const input = document.getElementById('menuDelDiaFile');
  const file = input?.files?.[0];
  if (!file) return showToast('⚠️ Selecciona una imagen');

  const reader = new FileReader();
  reader.onload = function (e) {
    saveMenuDelDia({
      src: e.target.result,
      name: file.name,
      updatedAt: new Date().toISOString()
    });
    showToast('✅ Menú del día actualizado');
    switchAdminTab('menuDelDia');
  };
  reader.readAsDataURL(file);
}

function eliminarMenuDelDia() {
  if (!confirm('¿Quitar la imagen del menú del día?')) return;
  clearMenuDelDia();
  showToast('🗑️ Imagen eliminada');
  switchAdminTab('menuDelDia');
}

// ---------------------------
// ADMIN: Desvinculaciones
// ---------------------------
function buildAdminDesvinculaciones() {
  let registros = getDesvinculaciones().map(r => ({
    ...r,
    estado: (r.estado === 'procesado_ad') ? 'procesado_ad' : 'pendiente_ad'
  }));

  registros = registros.sort((a, b) => {
    if (a.estado !== b.estado) return a.estado === 'pendiente_ad' ? -1 : 1;
    return 0;
  });

  const total = registros.length;
  const pendientes = registros.filter(r => r.estado === 'pendiente_ad').length;
  const procesados = total - pendientes;
  const porcentaje = total ? Math.round((procesados / total) * 100) : 0;

  const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const rows = registros.map((r, idx) => `
    <tr>
      <td>${r.mes || ''}</td>
      <td class="font-medium text-[#111]">${r.nombre || ''}</td>
      <td>${r.cargo || ''}</td>
      <td>${r.razon || ''}</td>
      <td>
        <span class="status-chip ${r.estado === 'procesado_ad' ? 'status-procesado' : 'status-pendiente'}">
          ${r.estado === 'procesado_ad' ? 'Procesado AD' : 'Pendiente AD'}
        </span>
      </td>
      <td>${r.fecha || ''}</td>
      <td class="space-y-2">
        ${r.estado === 'pendiente_ad'
          ? `<button onclick="setEstadoDesvinculacion(${idx}, 'procesado_ad')" class="btn-outline text-xs">Marcar Procesado</button>`
          : `<button onclick="setEstadoDesvinculacion(${idx}, 'pendiente_ad')" class="btn-outline text-xs">Volver a Pendiente</button>`
        }
        <button onclick="deleteDesvinculacion(${idx})" class="text-[#e63329] border border-[#e63329] rounded px-3 py-1 hover:bg-red-50 text-xs font-bold uppercase transition">Eliminar</button>
      </td>
    </tr>
  `).join('');

  return `
    <div class="card p-6 mb-6 shadow-sm border border-gray-200">
      <h3 class="font-bold text-lg mb-4 text-[#0f4c5c] flex items-center gap-2"><i data-lucide="user-minus" class="w-5 h-5"></i> Registrar Desvinculación</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <select id="desvMes" class="input-field">
          <option value="">Mes</option>
          ${MESES.map(m => `<option value="${m}">${m}</option>`).join('')}
        </select>
        <input id="desvNombre" type="text" placeholder="Nombre y Apellido" class="input-field">
        <input id="desvCargo" type="text" placeholder="Cargo" class="input-field">
        <input id="desvRazon" type="text" placeholder="Razón" class="input-field">
      </div>
      <div class="flex flex-wrap gap-3">
        <button onclick="saveDesvinculacion()" class="btn-primary">Guardar</button>
        <button onclick="exportDesvinculacionesXLS()" class="btn-outline">Exportar Excel</button>
        <label class="btn-outline cursor-pointer">
          Importar CSV/TSV
          <input id="desvImportFile" type="file" accept=".csv,.tsv,.txt" class="hidden" onchange="importDesvinculaciones(this)">
        </label>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
      <div class="card p-4 stats-card">
        <div class="stats-label">Total</div>
        <div class="stats-value">${total}</div>
      </div>
      <div class="card p-4 stats-card">
        <div class="stats-label">Pendientes AD</div>
        <div class="stats-value text-[#b91c1c]">${pendientes}</div>
      </div>
      <div class="card p-4 stats-card">
        <div class="stats-label">Procesados AD</div>
        <div class="stats-value text-[#166534]">${procesados}</div>
      </div>
      <div class="card p-4 stats-card">
        <div class="stats-label">% Procesado</div>
        <div class="stats-value">${porcentaje}%</div>
      </div>
    </div>

    <div class="card overflow-x-auto border-gray-200">
      <table class="data-table">
        <thead>
          <tr><th>Mes</th><th>Nombre y Apellido</th><th>Cargo</th><th>Razón</th><th>Estado</th><th>Fecha Registro</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          ${rows || '<tr><td colspan="7" class="text-center py-6 text-gray-500 italic">No hay registros.</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
}

function saveDesvinculacion() {
  const mes = document.getElementById('desvMes').value.trim();
  const nombre = document.getElementById('desvNombre').value.trim();
  const cargo = document.getElementById('desvCargo').value.trim();
  const razon = document.getElementById('desvRazon').value.trim();

  if (!mes || !nombre || !cargo || !razon) {
    return showToast('⚠️ Completa todos los campos');
  }

  const fecha = new Date().toLocaleString('es-DO');
  const arr = getDesvinculaciones();
  arr.unshift({ mes, nombre, cargo, razon, fecha, estado: 'pendiente_ad' });
  saveDesvinculaciones(arr);

  showToast('✅ Registro guardado');
  switchAdminTab('desvinculaciones');
}

function setEstadoDesvinculacion(idx, estado) {
  const arr = getDesvinculaciones().map(r => ({
    ...r,
    estado: (r.estado === 'procesado_ad') ? 'procesado_ad' : 'pendiente_ad'
  }));

  const sorted = arr.sort((a, b) => {
    if (a.estado !== b.estado) return a.estado === 'pendiente_ad' ? -1 : 1;
    return 0;
  });

  if (!sorted[idx]) return;
  sorted[idx].estado = estado === 'procesado_ad' ? 'procesado_ad' : 'pendiente_ad';

  saveDesvinculaciones(sorted);
  showToast('✅ Estado actualizado');
  switchAdminTab('desvinculaciones');
}

function deleteDesvinculacion(idx) {
  if (!confirm('¿Eliminar este registro?')) return;
  const arr = getDesvinculaciones().map(r => ({
    ...r,
    estado: (r.estado === 'procesado_ad') ? 'procesado_ad' : 'pendiente_ad'
  }));
  const sorted = arr.sort((a, b) => {
    if (a.estado !== b.estado) return a.estado === 'pendiente_ad' ? -1 : 1;
    return 0;
  });
  sorted.splice(idx, 1);
  saveDesvinculaciones(sorted);
  showToast('🗑️ Registro eliminado');
  switchAdminTab('desvinculaciones');
}

function exportDesvinculacionesXLS() {
  const registros = getDesvinculaciones();
  if (!registros.length) return showToast('⚠️ No hay registros para exportar');

  let csv = 'Mes\tNombre y Apellido\tCargo\tRazón\tEstado\tFecha Registro\n';
  registros.forEach(r => {
    const estadoTxt = r.estado === 'procesado_ad' ? 'Procesado AD' : 'Pendiente AD';
    csv += `${r.mes || ''}\t${r.nombre || ''}\t${r.cargo || ''}\t${r.razon || ''}\t${estadoTxt}\t${r.fecha || ''}\n`;
  });

  const blob = new Blob([csv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `desvinculaciones_${new Date().toISOString().slice(0, 10)}.xls`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('✅ Archivo Excel descargado');
}

function importDesvinculaciones(input) {
  const file = input?.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const text = String(e.target.result || '').trim();
    if (!text) return showToast('⚠️ Archivo vacío');

    const lines = text.split(/\r?\n/).filter(Boolean);
    if (!lines.length) return showToast('⚠️ Archivo sin filas');

    const first = lines[0];
    const sep = first.includes('\t') ? '\t' : ',';
    const start = /mes/i.test(first) ? 1 : 0;

    const arr = getDesvinculaciones();
    let added = 0;

    for (let i = start; i < lines.length; i++) {
      const cols = lines[i].split(sep).map(v => v.trim());
      if (cols.length < 4) continue;

      let mes = '';
      let nombre = '';
      let cargo = '';
      let razon = '';
      let estado = 'pendiente_ad';
      let fecha = '';

      if (cols.length >= 6) {
        mes = cols[0];
        nombre = cols[1];
        cargo = cols[2];
        razon = cols[3];
        const rawEstado = (cols[4] || '').toLowerCase();
        estado = rawEstado.includes('proces') ? 'procesado_ad' : 'pendiente_ad';
        fecha = cols[5];
      } else {
        mes = cols[0];
        nombre = cols[1];
        cargo = cols[2];
        razon = cols[3];
        fecha = cols[4];
      }

      if (!mes || !nombre || !cargo || !razon) continue;

      arr.push({
        mes,
        nombre,
        cargo,
        razon,
        estado,
        fecha: fecha || new Date().toLocaleString('es-DO')
      });
      added++;
    }

    saveDesvinculaciones(arr);
    showToast(`✅ Importación completada: ${added} registros`);
    switchAdminTab('desvinculaciones');
  };

  reader.readAsText(file);
}

// ---------------------------
// ADMIN: Fallback de Portales
// ---------------------------
function buildAdminPortales() {
  return '<div class="card p-10 text-center"><i data-lucide="grid" class="w-12 h-12 text-gray-300 mx-auto mb-4"></i><h3 class="font-bold text-gray-600">Configuración de Links</h3><p class="text-sm mt-2 text-gray-400">Módulo gestionado desde Base de Datos</p></div>';
}
