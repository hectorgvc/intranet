// ---> [ MÓDULO: DASHBOARD (THE TRUST STYLE) ] <---

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
  const totalEq = nomenclaturas.length;
  const totalPort = portales.length;
  const timeNow = now.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' });

  // News Generate
  const newsHtml = noticias.map(n => `
    <div class="news-card">
      <img src="${n.imagen}" alt="News preview" class="news-img">
      <div>
        <h3 class="news-title">${n.titulo}</h3>
        <p class="text-[13px] text-gray-500 mb-2 line-clamp-2">Novedades y comunicados internos desde el departamento de ${n.autor}.</p>
        <div class="news-meta">
          <img src="https://ui-avatars.com/api/?name=${n.autor}&background=random&color=fff" class="news-author-avatar">
          <span>${n.autor}</span>
          <span>·</span>
          <span>${n.fecha}</span>
        </div>
      </div>
    </div>
  `).join('');

  // HTML Structure matching the image
  container.innerHTML = `
    <div class="hero-banner shadow-lg">
      <div class="hero-content">
        <h1 class="text-5xl font-extrabold mb-3 tracking-tight">${saludo}, ${userName}!</h1>
        <p class="text-lg opacity-90 mb-8 font-medium tracking-wide max-w-lg leading-relaxed">Revisa las novedades de hoy en PROMESE/CAL. Accede a herramientas y gestiona tus recursos de trabajo institucionales.</p>
        <button class="bg-white text-[#0f4c5c] font-bold py-3.5 px-8 rounded-full transition shadow-md hover:shadow-lg hover:bg-gray-50 text-sm tracking-wide">VER NOTICIAS</button>
      </div>
      <div class="hero-bg border-l-8 border-[#0a3541]">
        <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80" alt="Office workers">
      </div>
    </div>

    <div class="quick-links-band shadow-sm mb-12">
      <div class="ql-item hover:bg-[#155b6e]" onclick="window.open('https://mesadeayuda.promesecal.gob.do/front/central.php', '_blank')">
        <div class="ql-circle"><i data-lucide="headphones" class="w-7 h-7 text-white"></i></div>
        <span class="text-[11px] font-bold tracking-widest uppercase mt-1">Mesa de Ayuda</span>
      </div>
      <div class="ql-item hover:bg-[#1a5e72]" onclick="navigateTo('directorio')">
        <div class="ql-circle"><i data-lucide="users" class="w-6 h-6 text-white"></i></div>
        <span class="text-[11px] font-bold tracking-widest uppercase mt-1">Directorio</span>
      </div>
      <div class="ql-item hover:bg-[#267188]" onclick="window.open('https://outlook.cloud.microsoft/mail/', '_blank')">
        <div class="ql-circle"><i data-lucide="mail" class="w-6 h-6 text-white"></i></div>
        <span class="text-[11px] font-bold tracking-widest uppercase mt-1">Correo</span>
      </div>
      <div class="ql-item hover:bg-[#34849e]" onclick="window.open('https://promesecal1.sharepoint.com/Documentos%20compartidos/Forms/AllItems.aspx', '_blank')">
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
      <div class="kpi-card bg-[#0f4c5c]">
        <h4>Total Empleados</h4>
        <div class="val">${totalEmp}<small>activos</small></div>
      </div>
      <div class="kpi-card bg-[#226563]">
        <h4>Equipos IT (Nom.)</h4>
        <div class="val">${totalEq}<small>unds.</small></div>
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
