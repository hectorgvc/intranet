// ---> [ MÓDULO: ENLACES EXTERNOS ] <---

function renderEnlaces() {
  const container = document.getElementById('enlacesContainer');
  if (!container) return;

  const enlacesGobierno = portales.filter(p => p.categoria === 'Aplicaciones Externas (Gobierno)');

  if (enlacesGobierno.length === 0) {
    container.innerHTML = '<p class="text-gray-500 italic">No hay enlaces externos registrados.</p>';
    return;
  }

  container.innerHTML = `
    <div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${enlacesGobierno.map(p => `
          <a href="${p.url}" target="_blank" class="card p-6 hover:shadow-lg transition cursor-pointer group">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-lg bg-[#e0ebeef] flex items-center justify-center text-[#50788A] group-hover:bg-[#50788A] group-hover:text-white transition">
                <i data-lucide="${p.icono}" class="w-6 h-6"></i>
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-[#111] mb-1">${p.nombre}</h4>
                <p class="text-sm text-gray-600">${p.descripcion}</p>
                <span class="text-xs text-[#50788A] font-semibold mt-2 inline-block">ABRIR PORTAL →</span>
              </div>
            </div>
          </a>
        `).join('')}
      </div>
    </div>
  `;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}
