// ---> [ MÓDULO: PORTALES ] <---

function renderPortales() {
  const container = document.getElementById('portalesContainer');
  if(!container) return;

  // Agrupar por categoria formal indicada en los requerimientos
  const categories = [...new Set(portales.filter(p => p.categoria !== 'Aplicaciones Externas (Gobierno)').map(p => p.categoria))];

  container.innerHTML = categories.map(cat => {
    const items = portales.filter(p => p.categoria === cat && p.categoria !== 'Aplicaciones Externas (Gobierno)');
    return `
      <div class="mb-10 last:mb-0">
        <h3 class="text-[17px] font-bold text-[#0f4c5c] mb-6 tracking-wide flex items-center gap-2">
          <div class="w-2 h-6 bg-[#e63329] rounded-sm"></div> ${cat}
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          ${items.map(p => `
            <div class="card p-5 flex flex-col hover:shadow-lg transition cursor-pointer border border-[#eaeaea] group bg-white" onclick="${p.url && !p.url.includes('internal:') ? `window.open('${p.url}','_blank')` : "navigateTo('directorio')"}">
              <div class="flex items-center gap-3.5 mb-3.5">
                <div class="w-11 h-11 rounded-lg bg-[#f0f7f7] flex items-center justify-center flex-shrink-0 group-hover:bg-[#2a7d7b] transition-colors">
                  <i data-lucide="${p.icono || 'link'}" class="w-[22px] h-[22px] text-[#2a7d7b] group-hover:text-white transition-colors"></i>
                </div>
                <h4 class="font-bold text-[14px] leading-tight text-[#111]">${p.nombre}</h4>
              </div>
              <p class="text-gray-500 text-[13px] mb-4 flex-1 line-clamp-2 leading-relaxed">${p.descripcion}</p>
              <div class="text-[#e63329] font-bold text-xs mt-auto flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                <i data-lucide="external-link" class="w-3.5 h-3.5 border border-transparent group-hover:border-b-[#e63329]"></i> ABRIR PORTAL
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
  
  if(typeof lucide !== 'undefined') lucide.createIcons();
}
