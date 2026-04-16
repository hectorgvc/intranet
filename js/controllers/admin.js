// ---> [ MÓDULO: ADMIN ] <---

function loginAdmin() {
  const pw = document.getElementById('adminPassword').value;
  // Constraint from mandate: dtic2025
  if (pw === 'dtic2025') {
    adminLoggedIn = true;
    document.getElementById('adminLogin').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
    document.getElementById('adminError').classList.add('hidden');
    switchAdminTab('noticias', document.querySelector('.admin-tab')); // Default a noticias hero
  } else {
    document.getElementById('adminError').classList.remove('hidden');
  }
}

function logoutAdmin() {
  adminLoggedIn = false;
  document.getElementById('adminLogin').classList.remove('hidden');
  document.getElementById('adminPanel').classList.add('hidden');
  document.getElementById('adminPassword').value = '';
}

function switchAdminTab(tabId, btn) {
  if(btn) {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
  }
  
  const container = document.getElementById('adminContentContainer');
  window.currentAdminTab = tabId;
  
  if (tabId === 'noticias') container.innerHTML = buildAdminNoticias();
  if (tabId === 'directorio') container.innerHTML = buildAdminDirectorio();
  if (tabId === 'nomenclaturas') container.innerHTML = buildAdminNomenclaturas();
  if (tabId === 'portalesAdmin') container.innerHTML = buildAdminPortales();
  
  if(typeof lucide !== 'undefined') lucide.createIcons();
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
          ${noticias.length === 0 ? '<tr><td colspan="4" class="text-center py-6 text-gray-500 italic">No hay comunicados activos.</td></tr>':''}
        </tbody>
      </table>
    </div>
  `;
}

function saveNoticia() {
  const t = document.getElementById('anTitle').value;
  const a = document.getElementById('anAuthor').value || 'Institucional';
  const i = document.getElementById('anImage').value || `https://ui-avatars.com/api/?name=${a}&background=2a7d7b&color=fff&size=200`;
  
  if(!t) return showToast('⚠️ El título es obligatorio');
  
  const now = new Date();
  const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  
  noticias.unshift({
    id: Date.now(),
    titulo: t, autor: a, imagen: i,
    fecha: `${now.getDate()} ${meses[now.getMonth()]} ${now.getFullYear()}`
  });
  
  if(noticias.length > 5) noticias.pop(); // Max 5 news on dashboard
  saveData(); showToast('✅ Aviso publicado en el Dashboard');
  switchAdminTab('noticias');
}

function deleteNoticia(id) {
  if(!confirm('¿Eliminar esta noticia del dashboard?')) return;
  noticias = noticias.filter(x => x.id !== id);
  saveData(); switchAdminTab('noticias'); showToast('🗑️ Aviso borrado');
}

// ---------------------------
// ADMIN: Fallbacks y Extras (Simplicados)
// ---------------------------
function buildAdminDirectorio() {
  return `
    <div class="card p-6 mb-6">
      <h3 class="font-bold text-lg mb-4 text-[#0f4c5c]"><i data-lucide="users" class="inline w-5 h-5 mr-1"></i> Control Rápido de Directorio</h3>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
        <input id="adExt" type="text" placeholder="Ext." class="input-field">
        <input id="adNombre" type="text" placeholder="Nombre completo" class="input-field">
        <input id="adCargo" type="text" placeholder="Cargo" class="input-field">
        <input id="adDepto" type="text" placeholder="Departamento" class="input-field">
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
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function saveDirAdmin() {
  const e = document.getElementById('adExt').value;
  const n = document.getElementById('adNombre').value;
  if(!e || !n) return showToast('Nombre y Extensión son obligatorios');
  directorio.unshift({
    id: Date.now(), extension: e, nombre: n, 
    cargo: document.getElementById('adCargo').value, 
    departamento: document.getElementById('adDepto').value, correo: ''
  });
  saveData(); switchAdminTab('directorio'); showToast('Contacto guardado');
}

function deleteDirAdmin(id) {
  directorio = directorio.filter(d => d.id !== id);
  saveData(); switchAdminTab('directorio'); showToast('Contacto borrado');
}

function buildAdminNomenclaturas() { return '<div class="card p-10 text-center"><i data-lucide="monitor" class="w-12 h-12 text-gray-300 mx-auto mb-4"></i><h3 class="font-bold text-gray-600">Mantenimiento de nomenclaturas</h3><p class="text-sm mt-2 text-gray-400">Modulo desactivado temporalmente</p></div>'; }
function buildAdminPortales() { return '<div class="card p-10 text-center"><i data-lucide="grid" class="w-12 h-12 text-gray-300 mx-auto mb-4"></i><h3 class="font-bold text-gray-600">Configuración de Links</h3><p class="text-sm mt-2 text-gray-400">Modulo gestionado desde Base de Datos</p></div>'; }
