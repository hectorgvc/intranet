// ---> [ MÓDULO: NOMENCLATURAS ] <---

function getFilteredNomenclaturas() {
  const search = document.getElementById('nomSearch')?.value?.toLowerCase() || '';
  const dept = document.getElementById('nomDeptFilter')?.value || '';
  return nomenclaturas.filter(n => {
    const matchSearch = !search || Object.values(n).some(v => String(v).toLowerCase().includes(search));
    const matchDept = !dept || n.departamento === dept;
    return matchSearch && matchDept;
  });
}

function renderNomenclaturas() {
  const filtered = getFilteredNomenclaturas();
  const perPage = 25;
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  if (nomPage > totalPages) nomPage = totalPages;
  const start = (nomPage - 1) * perPage;
  const pageData = filtered.slice(start, start + perPage);

  const tbody = document.getElementById('nomenclaturaBody');
  if(!tbody) return;

  tbody.innerHTML = pageData.length ? pageData.map(n => `
    <tr>
      <td><span class="inline-block bg-teal-50 text-teal px-2 py-0.5 rounded text-xs font-medium">${n.departamento}</span></td>
      <td class="font-mono text-sm font-medium">${n.nomenclatura}</td>
      <td>${n.usuario === 'Sin usuario' ? '<span class="text-gray-400 italic">Sin usuario</span>' : n.usuario}</td>
    </tr>
  `).join('') : '<tr><td colspan="3" class="text-center text-gray-400 py-8">No se encontraron registros</td></tr>';

  const pag = document.getElementById('nomenclaturaPagination');
  if(pag) {
    pag.innerHTML = `
      <span class="text-sm text-gray-500">${filtered.length} registros | Página ${nomPage} de ${totalPages}</span>
      <div class="flex gap-1">${renderPaginationButtons(nomPage, totalPages, 'nomPage', 'renderNomenclaturas')}</div>
    `;
  }

  populateDeptFilter('nomDeptFilter', nomenclaturas.map(n => n.departamento));
}

function exportNomenclaturaCSV() {
  const filtered = getFilteredNomenclaturas();
  let csv = 'Departamento,Nomenclatura,Usuario Asignado\n';
  filtered.forEach(n => { csv += `"${n.departamento}","${n.nomenclatura}","${n.usuario}"\n`; });
  downloadCSV(csv, 'nomenclaturas_promesecal.csv');
}
