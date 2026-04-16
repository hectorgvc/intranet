// =====================================================================
// 5. INICIALIZADOR (Bootstrapper)
// =====================================================================

async function init() {
  await loadFeriados(); // Carga los feriados antes de renderizar
  renderDashboard();
  if(typeof lucide !== 'undefined') lucide.createIcons();

  // Update clock every minute
  setInterval(() => {
    const now = new Date();
    const el = document.getElementById('horaActual');
    if (el) el.textContent = now.toLocaleTimeString('es-DO', { hour: '2-digit', minute: '2-digit' });
  }, 60000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
