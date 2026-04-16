/* ============================================================
   firma.js — Generador de Firma Corporativa PROMESE/CAL
   Replica el formato exacto de firma.html
   ============================================================ */

function updateFirmaPreview() {
  const nombre  = (document.getElementById('firmaNombre')?.value || '').toUpperCase();
  const cargo   = document.getElementById('firmaCargo')?.value   || '';
  const unidad  = document.getElementById('firmaUnidad')?.value  || '';
  const ext     = document.getElementById('firmaExt')?.value     || '';
  const flota   = document.getElementById('firmaFlota')?.value   || '';
  const correo  = document.getElementById('firmaCorreo')?.value  || '';

  const preview = document.getElementById('firmaPreview');
  if (!preview) return;

  preview.innerHTML = buildFirmaHTML({ nombre, cargo, unidad, ext, flota, correo });
}

function buildFirmaHTML({ nombre, cargo, unidad, ext, flota, correo }) {
  const logoBase64 = _getLogoBase64();

  const nombreHTML  = nombre  || 'NOMBRE COMPLETO';
  const cargoHTML   = cargo   || 'Cargo';
  
  const mostrarUnidad = unidad  ? `<tr><td><span style="color:#2d2d2d;font-family:'Gill Sans MT',sans-serif;font-size:11pt;line-height:1.2;">${unidad}</span></td></tr>` : '';
  const mostrarExt    = ext     ? `<tr><td><span style="color:#2d2d2d;font-family:'Gill Sans MT',sans-serif;font-size:11pt;font-weight:bold;line-height:1.2;">Tel: Ext. ${ext}</span></td></tr>` : '';
  const mostrarFlota  = flota   ? `<tr><td><span style="color:#2d2d2d;font-family:'Gill Sans MT',sans-serif;font-size:11pt;font-weight:bold;line-height:1.2;">Cell: ${flota}</span></td></tr>` : '';
  const mostrarCorreo = correo  ? `<tr><td><a href="mailto:${correo}" style="color:#00788a;font-family:'Gill Sans MT',sans-serif;font-size:11pt;text-decoration:none;line-height:1.2;">${correo}</a></td></tr>` : '';

  return `
<div id="promese-firma-root" style="background-color:#ffffff; margin:0; padding:10px;">
  <table id="promese-main" style="width:650px; border-collapse:collapse; background-color:#ffffff;" cellpadding="0" cellspacing="0">
    <tbody>
      <tr>
        <!-- COLUMNA IZQUIERDA: Datos del empleado -->
        <td id="promese-data" style="border-right:2px solid #e63329; width:340px; padding-right:15px; vertical-align:top;">
          <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr>
              <td>
                <span style="font-family:'Gill Sans MT',sans-serif; font-size:13pt; font-weight:bold; color:#00788a; white-space:nowrap;">
                  ${nombreHTML}
                </span>
              </td>
            </tr>
            <tr>
              <td>
                <span style="font-family:'Gill Sans MT',sans-serif; font-size:11pt; color:#555; font-style:italic;">
                  ${cargoHTML}
                </span>
              </td>
            </tr>
            ${mostrarUnidad}
            <tr><td style="height:8px;"></td></tr>
            ${mostrarExt}
            ${mostrarFlota}
            ${mostrarCorreo}
            <tr><td style="height:10px;"></td></tr>
            <tr>
              <td>
                <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                  <tr>
                    <td><span style="font-family:'Gill Sans MT',sans-serif; font-size:11pt; font-weight:bold; color:#00788a;">www.promesecal.gob.do</span></td>
                  </tr>
                  <tr>
                    <td><span style="font-family:'Gill Sans MT',sans-serif; font-size:11pt; font-weight:bold; color:#00788a;">@promesecalrd</span></td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>

        <!-- COLUMNA DERECHA: Logo -->
        <td style="padding-left:20px; vertical-align:middle; text-align:center; width:280px;">
          <img src="${logoBase64}" alt="PROMESE/CAL" style="display:block; width:100%; max-width:240px; height:auto; margin:0 auto;" />
        </td>
      </tr>

      <!-- FOOTER: Aviso de confidencialidad -->
      <tr>
        <td colspan="2" style="padding-top:15px;">
          <p style="font-family:'Gill Sans MT',sans-serif; font-size:8pt; text-align:justify; color:#666; margin:0; line-height:1.3;">
            "Este mensaje incluyendo sus adjuntos puede contener información confidencial y privilegiada con la intensión de que sea utilizada por las personas u organizaciones a quienes están dirigidas, por lo que su uso es exclusivo para su destinatario. Si usted ha recibido este mensaje por error, favor de eliminarlo e informar al remitente del mensaje a través de un correo de respuesta. Si este es el caso, le notificamos que queda estrictamente prohibida la distribución o reproducción de este e-mail y/o sus anexos".
          </p>
        </td>
      </tr>
    </tbody>
  </table>
</div>`;
}

function copiarFirma() {
  const firmaRoot = document.getElementById('promese-firma-root');
  if (!firmaRoot) {
    showToast('⚠️ Completa los datos primero');
    return;
  }

  /* Copia como HTML enriquecido para que Outlook preserve el formato */
  try {
    const html = firmaRoot.outerHTML;
    const blob = new Blob([html], { type: 'text/html' });
    const data = [new ClipboardItem({ 'text/html': blob })];

    navigator.clipboard.write(data).then(() => {
      showToast('✅ Firma copiada — pégala en Outlook (Ctrl+V)');
    }).catch(() => {
      _fallbackCopy(firmaRoot);
    });
  } catch (e) {
    _fallbackCopy(firmaRoot);
  }
}

function _fallbackCopy(el) {
  const range = document.createRange();
  range.selectNode(el);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  try {
    document.execCommand('copy');
    showToast('✅ Firma copiada — pégala en Outlook (Ctrl+V)');
  } catch (e) {
    showToast('❌ No se pudo copiar automáticamente');
  }
  sel.removeAllRanges();
}

function _getLogoBase64() {
  // Base64 limpia del logo original
  return 'data:image/png;base64,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np6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onp6Onpw==';
}
