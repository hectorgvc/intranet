// ---> [ MÓDULO: DASHBOARD (THE TRUST STYLE) ] <---

// Hero Slider State
let heroSlideIndex = 0;
let heroSlideInterval = null;

const HERO_SLIDES = [
  'assets/hero/fachada-promese.png',
  'assets/hero/farmacia-sample.png'
];

function rotateHeroSlide() {
  const slider = document.querySelector('.hero-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.hero-slide');
  if (slides.length < 2) return;

  // Calcular siguiente slide
  const prevIndex = heroSlideIndex;
  heroSlideIndex = (heroSlideIndex + 1) % HERO_SLIDES.length;

  const prevSlide = slides[prevIndex];
  const nextSlide = slides[heroSlideIndex];

  // Fade Out suave de la imagen actual (0.5s)
  prevSlide.style.transition = 'opacity 0.5s ease-in-out';
  prevSlide.style.opacity = '0';

  // Fade In suave de la imagen nueva (0.5s)
  nextSlide.style.transition = 'opacity 0.5s ease-in-out';
  nextSlide.style.opacity = '1';
}

function startHeroSlider() {
  if (heroSlideInterval) clearInterval(heroSlideInterval);
  heroSlideInterval = setInterval(rotateHeroSlide, 7000);
}

function renderDashboard() {
  const container = document.getElementById('dashboardContent');
  if(!container) return;

  // Render hero dynamic text
  const h = new Date().getHours();
  let saludo = 'Buenas noches';
  if (h >= 5 && h < 12) saludo = 'Buenos días';
  else if (h >= 12 && h < 18) saludo = 'Buenas tardes';
  
  const userName = 'Equipo';

  // Get current date
  const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const now = new Date();

  // KPI calculations
  const totalEmp = directorio.length;
  const totalNot = noticias.length;
  const totalPort = portales.length;
  const timeNow = now.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' });

  // News Generate (máximo últimas 4)
  const latestNews = (noticias || []).slice(0, 4);
  const newsHtml = latestNews.map(n => `
    <div class="news-card">
      <img src="${n.imagen}" alt="News preview" class="news-img">
      <div>
        <h3 class="news-title">${n.titulo}</h3>
        <p class="text-[13px] text-gray-500 mb-2 line-clamp-2">
          ${(() => {
            const raw = (n.detalle && n.detalle.trim())
              ? n.detalle
              : `Novedades y comunicados internos desde el departamento de ${n.autor}.`;
            const plain = toPlainTextFromHtml(raw);
            return plain.length > 180 ? plain.slice(0, 180) + '…' : plain;
          })()}
        </p>
        <div class="news-meta">
          <img src="https://ui-avatars.com/api/?name=${n.autor}&background=random&color=fff" class="news-author-avatar">
          <span>${n.autor}</span>
          <span>·</span>
          <span>${n.fecha}</span>
        </div>
        <button onclick="openNoticiaModal(${n.id})" class="mt-3 text-[#50788A] font-semibold text-sm hover:underline">
          Ver más
        </button>
      </div>
    </div>
  `).join('');

  // HTML Structure matching the image
  container.innerHTML = `
    <div class="hero-banner shadow-lg">
      <div class="hero-content w-full md:w-1/2 text-center md:text-left px-4 md:px-8 flex flex-col justify-center">
        <div class="relative z-10 w-full max-w-sm rounded-full bg-white flex items-center px-4 py-2.5 border border-gray-200 shadow-sm transition hover:shadow-md focus-within:shadow-md focus-within:border-[#50788A] mb-4">
          <i data-lucide="search" class="w-5 h-5 text-gray-400 mr-3"></i>
          <input type="text" placeholder="Buscar portales o contactos..." class="flex-1 bg-transparent border-none outline-none text-sm font-medium text-black placeholder-gray-500" onkeydown="if(event.key==='Enter') navigateTo('directorio')">
        </div>
        <h1 class="text-4xl md:text-5xl font-extrabold mb-1 tracking-tight" style="color: white;">${saludo}, Equipo!</h1>
        <h2 class="text-3xl md:text-4xl font-bold italic mb-3" style="color: #e63329; font-size: 2.25rem;">Intranet Institucional</h2>
        <p class="mb-8" style="font-family: 'Monotype Corsiva', 'Comic Sans MS', cursive; font-size: 18px; font-style: italic; color: white; max-width: 28rem; line-height: 1.6; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">Un espacio creado para conectarnos, informarnos y trabajar mejor.</p>
        <button onclick="openMenuDelDiaPopup()" class="bg-[#00788A] text-white font-bold py-3.5 px-8 rounded-full transition shadow-md hover:shadow-lg hover:bg-[#005a66] text-sm tracking-wide w-full md:w-auto">VER MENÚ DEL DÍA</button>
      </div>
      <div class="hero-slider border-l-8 border-[#005a66] w-full md:w-1/2 h-48 md:h-96">
        <div class="hero-overlay"></div>
        ${HERO_SLIDES.map((src, i) => `
          <div class="hero-slide" style="opacity: ${i === 0 ? '1' : '0'};">
            <img src="${src}" alt="Hero slide ${i + 1}">
          </div>
        `).join('')}
      </div>
    </div>

    <div class="quick-links-band shadow-sm mb-12">
      <div class="ql-item hover:bg-[#3d5f6d]" onclick="window.open('https://mesadeayuda.promesecal.gob.do/front/central.php', '_blank')">
        <div class="ql-circle"><i data-lucide="headphones" class="w-7 h-7 text-white"></i></div>
        <span class="text-[11px] font-bold tracking-widest uppercase mt-1">Mesa de Ayuda</span>
      </div>
      <div class="ql-item hover:bg-[#50788A]" onclick="navigateTo('directorio')">
        <div class="ql-circle"><i data-lucide="users" class="w-6 h-6 text-white"></i></div>
        <span class="text-[11px] font-bold tracking-widest uppercase mt-1">Directorio</span>
      </div>
      <div class="ql-item hover:bg-[#648296]" onclick="window.open('https://outlook.cloud.microsoft/mail/', '_blank')">
        <div class="ql-circle"><i data-lucide="mail" class="w-6 h-6 text-white"></i></div>
        <span class="text-[11px] font-bold tracking-widest uppercase mt-1">Correo</span>
      </div>
      <div class="ql-item hover:bg-[#7a96a8]" onclick="window.open('https://promesecal1.sharepoint.com/Documentos%20compartidos/Forms/AllItems.aspx', '_blank')">
        <div class="ql-circle"><i data-lucide="file-text" class="w-6 h-6 text-white"></i></div>
        <span class="text-[11px] font-bold tracking-widest uppercase mt-1">Documentos</span>
      </div>
    </div>

    <!-- Central Section (News & Events) -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-10 mb-12">
      <div class="xl:col-span-2">
        <h2 class="text-2xl font-extrabold uppercase tracking-tight text-[#111] mb-6">Avisos y Comunicados</h2>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          ${newsHtml || '<p class="text-gray-500 italic">No hay noticias recientes.</p>'}
        </div>
      </div>
      
      <div>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-7 xl:sticky xl:top-24">
          <div class="cal-header text-gray-700">
            <i data-lucide="chevron-left" class="w-5 h-5 cursor-pointer text-gray-400 hover:text-black" onclick="calPrevMonth()"></i>
            <span class="text-[15px] capitalize">${meses[calMonth]} ${calYear}</span>
            <i data-lucide="chevron-right" class="w-5 h-5 cursor-pointer text-gray-400 hover:text-black" onclick="calNextMonth()"></i>
          </div>
          <div class="cal-grid">
            <div class="cal-day-name">D</div><div class="cal-day-name">L</div><div class="cal-day-name">M</div><div class="cal-day-name">M</div><div class="cal-day-name">J</div><div class="cal-day-name">V</div><div class="cal-day-name">S</div>
            ${generateCalendarDays()}
          </div>

          <div class="mt-8 border-t border-gray-100 pt-6">
            ${generateFeriadosList()}
          </div>
        </div>
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpi-band">
      <div class="kpi-card bg-[#50788A] relative group cursor-help">
        <h4>Total Empleados</h4>
        <div class="val">${totalEmp}<small>activos (con acceso PC)</small></div>
        <!-- Tooltip -->
        <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10">
          Usuarios con acceso a equipos y sistemas internos
        </div>
      </div>
      <div class="kpi-card bg-[#3d5f6d]">
        <h4>Noticias Activas</h4>
        <div class="val">${totalNot}<small>activas</small></div>
      </div>
      <div class="kpi-card bg-[#eab308] text-[#111]">
        <h4>Sistemas Conectados</h4>
        <div class="val text-[#111]">${totalPort}<small class="text-[#111]">int.</small></div>
      </div>
      <div class="kpi-card bg-[#648296]">
        <h4>Último Acceso</h4>
        <div class="val">${timeNow}</div>
      </div>
    </div>
  `;

  if(typeof lucide !== 'undefined') lucide.createIcons();
  startHeroSlider();
}

function calPrevMonth() {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderDashboard();
}

function calNextMonth() {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderDashboard();
}

function generateCalendarDays() {
  let html = '';
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const today = new Date();

  for(let i=0; i<firstDay; i++) html += '<div></div>';
  for(let i=1; i<=daysInMonth; i++) {
    const isToday = i === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear();
    const feriado = getFeriado(calYear, calMonth, i);

    const className = `cal-day ${isToday ? 'active' : ''} ${feriado ? 'feriado' : ''}`.trim();
    const tooltip = feriado ? `title="${feriado.nombre}"` : '';

    html += `<div class="${className}" ${tooltip}>${i}</div>`;
  }
  return html;
}

function sanitizeNewsHtml(html) {
  const raw = String(html || '');
  const doc = new DOMParser().parseFromString(raw, 'text/html');

  const container = document.createElement('template');
  container.innerHTML = doc.body ? doc.body.innerHTML : raw;

  const allowed = new Set([
    'P', 'BR', 'STRONG', 'EM', 'UL', 'OL', 'LI', 'A',
    'H1', 'H2', 'H3', 'H4', 'BLOCKQUOTE', 'IMG'
  ]);

  const all = container.content.querySelectorAll('*');

  all.forEach(el => {
    if (!allowed.has(el.tagName)) {
      const txt = document.createTextNode(el.textContent || '');
      el.replaceWith(txt);
      return;
    }

    [...el.attributes].forEach(attr => {
      const name = attr.name.toLowerCase();
      const value = String(attr.value || '');

      if (name.startsWith('on')) {
        el.removeAttribute(attr.name);
        return;
      }

      if (name === 'style') {
        el.removeAttribute('style');
        return;
      }

      if (el.tagName === 'A') {
        if (name === 'href') {
          const safe = /^https?:\/\//i.test(value) || value.startsWith('mailto:') || value.startsWith('#');
          if (!safe || /^javascript:/i.test(value)) el.removeAttribute('href');
        } else if (!['href', 'target', 'rel'].includes(name)) {
          el.removeAttribute(attr.name);
        }
        return;
      }

      if (el.tagName === 'IMG') {
        if (name === 'src') {
          const safeImg = /^https?:\/\//i.test(value) || value.startsWith('data:image/');
          if (!safeImg || /^javascript:/i.test(value)) el.removeAttribute('src');
        } else if (name !== 'alt') {
          el.removeAttribute(attr.name);
        }
        return;
      }

      // Para el resto, no permitir atributos
      el.removeAttribute(attr.name);
    });

    if (el.tagName === 'A') {
      if (!el.getAttribute('target')) el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    }

    if (el.tagName === 'IMG' && !el.getAttribute('alt')) {
      el.setAttribute('alt', 'Imagen de noticia');
    }
  });

  return container.innerHTML;
}

function toPlainTextFromHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = sanitizeNewsHtml(html);
  return (div.textContent || div.innerText || '').replace(/\s+/g, ' ').trim();
}

function openNoticiaModal(id) {
  const n = (noticias || []).find(x => x.id === id);
  if (!n) return showToast('⚠️ Noticia no encontrada');

  const old = document.getElementById('noticiaModal');
  if (old) old.remove();

  const detalle = (n.detalle && n.detalle.trim())
    ? sanitizeNewsHtml(n.detalle)
    : `Novedades y comunicados internos desde el departamento de ${n.autor}.`;

  const modal = document.createElement('div');
  modal.id = 'noticiaModal';
  modal.style.position = 'fixed';
  modal.style.inset = '0';
  modal.style.background = 'rgba(0,0,0,.65)';
  modal.style.zIndex = '1000';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.padding = '20px';

  modal.innerHTML = `
    <div style="background:#fff;border-radius:12px;max-width:920px;width:100%;max-height:90vh;overflow:auto;position:relative;padding:16px;">
      <button onclick="document.getElementById('noticiaModal').remove()" style="position:absolute;top:10px;right:10px;border:none;background:#e5e7eb;border-radius:999px;width:32px;height:32px;font-weight:700;cursor:pointer;">✕</button>
      <img src="${n.imagen}" alt="${n.titulo}" style="width:100%;height:auto;max-height:320px;object-fit:cover;border-radius:8px;border:1px solid #e5e7eb;margin-bottom:12px;" />
      <h3 style="font-size:20px;font-weight:800;margin:0 0 8px 0;color:#50788A;">${n.titulo}</h3>
      <p style="font-size:13px;color:#6b7280;margin:0 0 14px 0;">${n.autor} · ${n.fecha}</p>
      <div class="news-rich-content" style="font-size:15px;line-height:1.7;color:#111;">${detalle}</div>
    </div>
  `;

  modal.addEventListener('click', function (e) {
    if (e.target === modal) modal.remove();
  });

  document.body.appendChild(modal);
}

function openMenuDelDiaPopup() {
  const menu = getMenuDelDia();
  if (!menu || !menu.src) {
    showToast('⚠️ No hay menú del día disponible');
    return;
  }

  const old = document.getElementById('menuDiaModal');
  if (old) old.remove();

  const modal = document.createElement('div');
  modal.id = 'menuDiaModal';
  modal.style.position = 'fixed';
  modal.style.inset = '0';
  modal.style.background = 'rgba(0,0,0,.65)';
  modal.style.zIndex = '1000';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.padding = '20px';

  modal.innerHTML = `
    <div style="background:#fff;border-radius:12px;max-width:900px;width:100%;max-height:90vh;overflow:auto;position:relative;padding:16px;">
      <button onclick="document.getElementById('menuDiaModal').remove()" style="position:absolute;top:10px;right:10px;border:none;background:#e5e7eb;border-radius:999px;width:32px;height:32px;font-weight:700;cursor:pointer;">✕</button>
      <h3 style="font-size:18px;font-weight:700;margin:0 0 10px 0;color:#50788A;">Menú del Día</h3>
      <img src="${menu.src}" alt="Menú del Día" style="width:100%;height:auto;border-radius:8px;border:1px solid #e5e7eb;" />
    </div>
  `;

  modal.addEventListener('click', function (e) {
    if (e.target === modal) modal.remove();
  });

  document.body.appendChild(modal);
}

function generateFeriadosList() {
  // Filter holidays for current calendar month/year
  const monthFeriados = feriados.filter(f => {
    const fDate = new Date(f.fecha);
    return fDate.getFullYear() === calYear && fDate.getMonth() === calMonth;
  });

  const mesesCortos = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

  if (monthFeriados.length === 0) {
    return '<p class="text-sm text-gray-400 italic">Sin feriados este mes.</p>';
  }

  return monthFeriados.map(f => {
    const fDate = new Date(f.fecha);
    const day = fDate.getDate();
    const monthShort = mesesCortos[fDate.getMonth()];
    return `
      <div class="cal-event">
        <div class="cal-event-date text-[#e63329]">
          <div class="cal-event-day">${day}</div>
          <div class="cal-event-month">${monthShort}</div>
        </div>
        <div class="cal-event-info">
          <div class="flex justify-between items-start mb-1.5">
            <div class="cal-event-title text-[14px]">${f.nombre}</div>
            <div class="cal-event-badge bg-[#e63329]">Feriado</div>
          </div>
          <div class="cal-event-time font-medium">Todo el día</div>
        </div>
      </div>
    `;
  }).join('');
}
