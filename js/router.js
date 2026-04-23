// =====================================================================
// 3. ENRUTADOR SPA (Router y manejo de Layout)
// =====================================================================

function navigateTo(view, linkEl) {
  event && event.preventDefault();
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
  document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
  if (linkEl) linkEl.classList.add('active');
  else {
    const defaultEl = document.querySelector(`[data-view="${view}"]`);
    if(defaultEl) defaultEl.classList.add('active');
  }
  
  // Close mobile sidebar if present
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if(sidebar) sidebar.classList.remove('open');
  if(overlay) overlay.classList.remove('active');

  // Lifecycle
  if (view === 'directorio') renderDirectorio();
  if (view === 'portales') renderPortales();
  if (view === 'inicio') renderDashboard();
  if (view === 'firma') updateFirmaPreview();
  if (view === 'admin') renderAdmin();
  if (view === 'enlaces') renderEnlaces();
  if (view === 'capacitaciones') renderCapacitaciones();
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  if(sidebar) sidebar.classList.toggle('open');
  if(overlay) overlay.classList.toggle('active');
}
