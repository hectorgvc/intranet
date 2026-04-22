// ---> [ MÓDULO: DIRECTORIO ] <---

function getFilteredDirectorio() {
  const search = document.getElementById('dirSearch')?.value?.trim()?.toLowerCase() || '';
  const dept = document.getElementById('dirDeptFilter')?.value?.trim() || '';

  return directorio.filter(d => {
    // Solo mostrar usuarios con teléfono y extensión válidos
    if (!d.telefono?.trim() || !d.extension?.trim()) return false;

    const dDept = String(d.departamento || '').trim();
    const matchSearch = !search || Object.values(d).some(v => String(v).toLowerCase().includes(search));
    const matchDept = !dept || dDept.toLowerCase() === dept.toLowerCase();
    return matchSearch && matchDept;
  });
}

function renderDirectorio() {
  const filtered = getFilteredDirectorio();
  const perPage = 25; // Requerimiento estricto: Paginación de 25
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  if (dirPage > totalPages) dirPage = totalPages;
  const start = (dirPage - 1) * perPage;
  const pageData = filtered.slice(start, start + perPage);

  const tbody = document.getElementById('directorioBody');
  if(!tbody) return;
  
  tbody.innerHTML = pageData.length ? pageData.map(d => `
    <tr>
      <td class="font-mono text-[13px] font-bold text-[#0f4c5c]">${d.extension}</td>
      <td class="font-bold text-[#111] text-[14px]">${d.nombre}</td>
      <td class="text-gray-600 text-[13px] font-medium">${d.cargo}</td>
      <td><span class="inline-block bg-[#f0f7f7] text-[#2a7d7b] px-2.5 py-1 rounded-[4px] text-[11px] font-bold tracking-wider uppercase">${d.departamento}</span></td>
      <td class="text-gray-600 text-[13px] font-mono">${d.telefono || '-'}</td>
      <td><a href="mailto:${d.correo}" class="text-[#2a7d7b] hover:text-[#e63329] hover:underline font-medium">${d.correo}</a></td>
    </tr>
  `).join('') : '<tr><td colspan="6" class="text-center text-gray-500 py-10 italic">No se encontraron colaboradores en el directorio</td></tr>';

  const pag = document.getElementById('directorioPagination');
  if(pag) {
    pag.innerHTML = `
      <span class="text-[13px] text-gray-500 font-semibold uppercase tracking-wide">${filtered.length} Registros | Pág. ${dirPage} de ${totalPages}</span>
      <div class="flex gap-1.5">${renderPaginationButtons(dirPage, totalPages, 'dirPage', 'renderDirectorio')}</div>
    `;
  }
  populateDeptFilter('dirDeptFilter', directorio.map(d => d.departamento));
}

function exportDirectorioCSV() {
  const filtered = getFilteredDirectorio();
  let csv = 'Extension,Nombre,Cargo,Departamento,Telefono,Correo\n';
  filtered.forEach(d => { csv += `"${d.extension}","${d.nombre}","${d.cargo}","${d.departamento}","${d.telefono}","${d.correo}"\n`; });
  downloadCSV(csv, 'directorio_promesecal.csv');
}
