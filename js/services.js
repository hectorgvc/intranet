// =====================================================================
// 2. SERVICIOS Y UTILIDADES (Helpers Compartidos)
// =====================================================================

function showToast(msg) {
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function downloadCSV(csv, filename) {
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  showToast('✅ Archivo CSV descargado');
}

function populateDeptFilter(selectId, departments) {
  const sel = document.getElementById(selectId);
  if(!sel) return;
  const current = sel.value;
  
  // Normalizar: Trim y Capitalize para evitar duplicados por inconsistencias en AD
  const normalized = departments
    .filter(d => !!d)
    .map(d => d.trim());
  
  const unique = [...new Set(normalized)].sort((a,b) => a.localeCompare(b));
  
  const opts = '<option value="">Todos los departamentos</option>' + 
    unique.map(d => `<option value="${d}" ${d.toLowerCase() === current.toLowerCase() ? 'selected' : ''}>${d}</option>`).join('');
  sel.innerHTML = opts;
}

function renderPaginationButtons(currentPage, totalPages, pageVar, renderFunc) {
  let html = '';
  html += `<button class="page-btn" onclick="${pageVar}=1;${renderFunc}()" ${currentPage===1?'disabled':''}>&laquo;</button>`;
  html += `<button class="page-btn" onclick="${pageVar}=${currentPage-1};${renderFunc}()" ${currentPage===1?'disabled':''}>&lsaquo;</button>`;
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  for (let i = start; i <= end; i++) {
    html += `<button class="page-btn ${i===currentPage?'active':''}" onclick="${pageVar}=${i};${renderFunc}()">${i}</button>`;
  }
  html += `<button class="page-btn" onclick="${pageVar}=${currentPage+1};${renderFunc}()" ${currentPage===totalPages?'disabled':''}>&rsaquo;</button>`;
  html += `<button class="page-btn" onclick="${pageVar}=${totalPages};${renderFunc}()" ${currentPage===totalPages?'disabled':''}>&raquo;</button>`;
  return html;
}

/**
 * Carga los feriados desde un archivo JSON externo.
 */
async function loadFeriados() {
  try {
    const response = await fetch('js/data/feriados.json');
    if (response.ok) {
      feriados = await response.json();
      console.log('✅ Feriados cargados:', feriados.length);
    }
  } catch (e) {
    console.error('❌ Error cargando feriados:', e);
  }
}

/**
 * Verifica si una fecha específica es feriado.
 * @param {number} year - Año (YYYY)
 * @param {number} month - Mes (0-11)
 * @param {number} day - Día (1-31)
 * @returns {object|null} - Retorna el objeto del feriado o null si no lo es.
 */
function getFeriado(year, month, day) {
  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  return feriados.find(f => f.fecha === dateStr) || null;
}
