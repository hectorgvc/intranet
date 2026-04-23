// ---> [ MÓDULO: CAPACITACIONES ] <---

function renderCapacitaciones() {
  const container = document.getElementById('capacitacionesContainer');
  if (!container) return;

  container.innerHTML = capacitaciones.map(cap => `
    <div class="card overflow-hidden hover:shadow-lg transition cursor-pointer group" onclick="openCapacitacionModal(${cap.id})">
      <!-- Thumbnail -->
      <div class="relative w-full h-40 bg-gray-900 flex items-center justify-center overflow-hidden">
        <img src="https://img.youtube.com/vi/${cap.videoId}/maxresdefault.jpg" alt="${cap.titulo}" class="w-full h-full object-cover group-hover:scale-105 transition">
        <div class="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition flex items-center justify-center">
          <i data-lucide="play-circle" class="w-12 h-12 text-white"></i>
        </div>
      </div>

      <!-- Content -->
      <div class="p-5">
        <h3 class="font-bold text-[#50788A] mb-2 line-clamp-2">${cap.titulo}</h3>
        <p class="text-sm text-gray-600 mb-3 line-clamp-2">${cap.descripcion}</p>

        <!-- Meta -->
        <div class="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-200">
          <span>${cap.duracion}</span>
          <span>${cap.fecha}</span>
        </div>
      </div>
    </div>
  `).join('');

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function openCapacitacionModal(id) {
  const cap = capacitaciones.find(c => c.id === id);
  if (!cap) return;

  const old = document.getElementById('capacitacionModal');
  if (old) old.remove();

  const modal = document.createElement('div');
  modal.id = 'capacitacionModal';
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);display:flex;align-items:center;justify-content:center;z-index:100;padding:20px;';
  modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

  modal.innerHTML = `
    <div style="background:#fff;border-radius:12px;max-width:900px;width:100%;max-height:90vh;overflow:auto;position:relative;padding:0;">
      <button onclick="document.getElementById('capacitacionModal').remove()" style="position:absolute;top:10px;right:10px;border:none;background:#e5e7eb;border-radius:999px;width:32px;height:32px;font-weight:700;cursor:pointer;z-index:10;">✕</button>

      <!-- Video Container -->
      <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;background:#000;">
        <iframe
          style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;"
          src="https://www.youtube.com/embed/${cap.videoId}"
          allowfullscreen
          loading="lazy">
        </iframe>
      </div>

      <!-- Info -->
      <div style="padding:24px;">
        <h2 style="font-size:20px;font-weight:700;margin:0 0 8px 0;color:#50788A;">${cap.titulo}</h2>
        <p style="font-size:13px;color:#6b7280;margin:0 0 14px 0;">${cap.autor} · ${cap.fecha} · ${cap.duracion}</p>
        <p style="font-size:15px;line-height:1.6;color:#333;margin:0;">${cap.descripcion}</p>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}
