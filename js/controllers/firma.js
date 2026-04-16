/* ============================================================
   firma.js — Generador de Firma Corporativa PROMESE/CAL
   Replica el formato EXACTO de firma.html (formato institucional oficial)
   ============================================================ */

function updateFirmaPreview() {
  const nombre  = (document.getElementById('firmaNombre')?.value || '').trim();
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
  const LOGO   = _getLogo();
  const ICONS  = _getSocialIcons();

  // Valores con placeholders visuales para el preview
  const nombreHTML  = nombre  || 'Nombre Apellido';
  const cargoHTML   = cargo   || 'Cargo';
  const unidadHTML  = unidad  || 'Unidad Organizativa del Titular';
  const extHTML     = ext     ? ext : 'XXXX';
  const flotaHTML   = flota   ? flota : '(809) 123-4567';
  const correoHTML  = correo  ? correo : 'apellido.nombre@promesecal.gob.do';

  const nombreColor = nombre  ? '#00788a' : '#aaa';
  const cargoStyle  = cargo   ? 'font-weight:bold;' : 'color:#aaa;';

  return `<div id="promese-firma-root" style="background:#fff;padding:8px 0;max-width:100%;">
<table id="promese-main" style="width:620px;border-collapse:collapse;background:#fff;" cellpadding="0" cellspacing="0">
<tbody>
<tr>
  <!-- DATOS -->
  <td id="promese-data" style="border-right:2px solid red;width:360px;vertical-align:top;padding-right:10px;">
    <span style="font-family:'Gill Sans MT',sans-serif;font-size:13pt;font-weight:bold;color:${nombreColor};">${nombreHTML}</span><br/>
    <span style="font-family:'Gill Sans MT',sans-serif;font-size:11pt;${cargoStyle}">${cargoHTML}</span><br/>
    <span style="font-family:'Gill Sans MT',sans-serif;font-size:11pt;">${unidadHTML}</span><br/>
    <br/>
    <span style="font-family:'Gill Sans MT',sans-serif;font-size:11pt;">Tel.: (809) 518-1313 Ext. ${extHTML}</span><br/>
    <span style="font-family:'Gill Sans MT',sans-serif;font-size:11pt;">Flota: ${flotaHTML}</span><br/>
    <br/>
    <a href="mailto:${correoHTML}" style="font-family:'Gill Sans MT',sans-serif;font-size:11pt;color:black;text-decoration:underline;">${correoHTML}</a><br/>
    <a href="https://www.promesecal.gob.do" style="font-family:'Gill Sans MT',sans-serif;font-size:11pt;color:black;text-decoration:underline;">www.promesecal.gob.do</a><br/>
    <table cellpadding="0" cellspacing="0" style="margin-top:6px;">
      <tr>
        <td style="padding-right:4px;"><a href="https://www.facebook.com/PromeseCalRD" target="_blank"><img src="${ICONS.fb}" alt="facebook" style="display:block;" /></a></td>
        <td style="padding-right:4px;"><a href="https://www.instagram.com/promesecalrd" target="_blank"><img src="${ICONS.ig}" alt="instagram" style="display:block;" /></a></td>
        <td style="padding-right:4px;"><a href="https://www.youtube.com/promesecalrd" target="_blank"><img src="${ICONS.yt}" alt="youtube" style="display:block;" /></a></td>
        <td style="padding-right:4px;"><a href="https://twitter.com/promesecalrd" target="_blank"><img src="${ICONS.tw}" alt="twitter" style="display:block;" /></a></td>
        <td style="padding-right:10px;"><a href="https://www.linkedin.com/company/promesecalrd" target="_blank"><img src="${ICONS.li}" alt="linkedin" style="display:block;" /></a></td>
        <td><span style="font-family:'Gill Sans MT',sans-serif;font-size:11pt;font-weight:bold;color:#00788a;margin-left:20px;">@promesecalrd</span></td>
      </tr>
    </table>
  </td>
  <!-- LOGO -->
  <td style="padding-left:15px;vertical-align:middle;text-align:center;width:240px;">
    <img src="${LOGO}" alt="PROMESE/CAL" style="display:block;width:220px;height:auto;margin:0 auto;" />
  </td>
</tr>
<!-- FOOTER -->
<tr>
  <td colspan="2" style="padding-top:12px;">
    <p style="font-family:'Gill Sans MT',sans-serif;font-size:8pt;text-align:justify;color:#333;margin:0;line-height:1.3;">
      &ldquo;Este mensaje incluyendo sus adjuntos puede contener información confidencial y privilegiada con la intensión de que sea utilizada por las personas u organizaciones a quienes están dirigidas, por lo que su uso es exclusivo para su destinatario. Si usted ha recibido este mensaje por error, favor de eliminarlo e informar al remitente del mensaje a través de un correo de respuesta. Si este es el caso, le notificamos que queda estrictamente prohibida la distribución o reproducción de este e-mail y/o sus anexos&rdquo;.
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

  // Intento 1: Clipboard API moderna (Chrome/Edge)
  try {
    const html = firmaRoot.outerHTML;
    const blob = new Blob([html], { type: 'text/html' });
    const data = [new ClipboardItem({ 'text/html': blob })];
    navigator.clipboard.write(data).then(() => {
      showToast('✅ Firma copiada — pégala en Outlook (Ctrl+V)');
    }).catch(() => {
      _fallbackCopy(firmaRoot);
    });
    return;
  } catch (e) {
    // fallthrough
  }

  // Intento 2: execCommand legacy (Firefox / navegadores más antiguos)
  _fallbackCopy(firmaRoot);
}

function _fallbackCopy(el) {
  const range = document.createRange();
  range.selectNode(el);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  try {
    const ok = document.execCommand('copy');
    if (ok) {
      showToast('✅ Firma copiada — pégala en Outlook (Ctrl+V)');
    } else {
      showToast('❌ No se pudo copiar. Selecciona manualmente y copia.');
    }
  } catch (e) {
    showToast('❌ No se pudo copiar automáticamente');
  }
  sel.removeAllRanges();
}

function _getSocialIcons() {
  return {
    fb: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAaCAYAAACkVDyJAAAAAXNSR0ICQMB9xQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUATWljcm9zb2Z0IE9mZmljZX/tNXEAAAI8SURBVEjHxZbNS1RhFMbP+zEYJULtbZkLmXAZrYSgf8FEnKJAtDZtSyFHKIoULcuisQhcSNtcGlLbFu6n0HuFdJeQotZM8HTPzDjOe733njul9MIzDPe+c36cM+eL8vk8JekcUcuype4vVj9eNWrhu1VATfydnxWtHuc7fFeyF/tikeiMZym/a5SHBkiSdozyfUtj/NumgMua+kuZGJAhgGJUu/Mro/zPmnKpgGWr78R6YVTV8PksMHoPePvmQFd6AE3OfbaVCNyzelSEjQwD5TIOnZkZx8t6mAObkcBvlm4n/kdsLNuJ2PNsOhLIYtsOsGipo2TVngh89NCFbG4CS0tVDQ0CKhrItlcCRh1YMvqdmIUMnC24wOmnkUkTCQ0YFeAC0dnfVpVFGOvJlAt8cD81kBlBubTTV023EmGceRcvAAMDwKePLvDDInDjOnBzCOjKHsrSsIoBi9aNnhe944SQztWc6CWzaMOonyIwHMqo09sjAplFqZJl5C7ge8D2tgvZ+gF4q8DaGnD5kghkyUAu+FMngNZW4PVsqNifB+9OAqfbgIyu3pWAYkhZqpaFDGg8E+MHGWpk7yohFZOmMbQvX7jAqclUYXSSRiyLIwRWyoKLUSz8IwDWC7+p1vYPwHpr44+VavPePS4g23aaN8tPM57+EuiHx9O+dpIGMBuem3OBhVciMHYAiysGN+ZrOXet6OtNbNjiirGvYAHq50UodkwJI6mpJeq/rIlxi7Bn1PvwIszPmlmE/wCjVBQ4CHvSAAAAAABJRU5ErkJggg==",
    ig: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0ICQMB9xQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUATWljcm9zb2Z0IE9mZmljZX/tNXEAAAHeSURBVEjHvVZNSwMxEJ3dbbU/Qy+2qIj0p+ixh4J4KlWsrVIQCqX/QsW/Yu8ehB5k8bOCYs/ePKzxTZLWbTa77rbSwzAkM++9zWSSDXW7XYozQZQTLu2IHHW+Pedd5BwxNjWmjowT5ZN44siXQdAA2V2YOMGQR8eMSyWC5C2ABinJTRswPlEECdtIHM0oMLYR81hFECj/g0BYqDwlglp6CPiW5D6ST2CtIEfNwKUDbHSNPY95XsU5L4L1mfdXxKV6JMmltowVaAVERW2lkPF4nU1ztC0cdSnC7Sc858FIuNYlPPyzNHnnCXmnKt9YEfOCn8QS7UbBKEuBViPznvMCf689BNwrXeoPYDYlzsSAn7+2ZxFpqZJM5j4xrhqduI/5W+G5l/BfGG8oXISrR+ZJ1oGmqrkcB6htRRJ77gXKc8Ne78NeCLOmcJHVv5GtzoFsBL0Sz3meCEyBtRDiWqQku8/CZxXhNg2Vy9dkQ+MLh3qz/ZBILbVIzErOZ18JajbHnlRkXGGKCXsyc3dV1fwEU4rtrozn5BX2KL0Zk/lx58R+4vupT7z+qMQTP+fdVeS45jiLvbuy3MIMkm3KPustvJD/ycL+jAv7xxuvlaOMr5VG6tdK2neXuinSvbt+AHIVPbC47sh+AAAAAElFTkSuQmCC",
    yt: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0ICQMB9xQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUATWljcm9zb2Z0IE9mZmljZX/tNXEAAAF4SURBVEjHvVa9SgNBEP5uTUTwCYRUagqxFmyFNLbp9C3SWoiHkAfwLSQEBYs8RYoIwZew0cbikqzf7qHcz+zmYtYtPg7uZr5vZm52ZpGmKXzQwIlu4UbvYKRbiS7BvuM32qzjcQsoXJJsWiN3Y2p8GgsxujYjfaDjYgORHyytLzm8QnmZNsrCnV2lnEWRhAavAUQsVoaLnHWhvFw6KMhZEmLn9IKL/AI9K8T0dpnmvGKQEU+6rR7ZSX0aX3ihcEX7kfXJfYtcc6NhhE7rUaj7defCeSzoW+OjhinboPJhxXdHfxXK6JtzlMo3MEJjoa5dOVocM7p9f0boCnxjCG35+QV0HCRD2rzxee4ZWQe0ea/yQuiUiSfa24IdfzzOZLvkJZbQpInQx5al6xgOQShaM9TbO9uivfUeDuX2Dn9g7+QD6x5Bz2asLBWuG4ygvh1XvhEUbahGXROFxTcLKDQTF58diAFXeeZa5YEuJ4tGl5Oo163/ukB+A50Pi7/FIomCAAAAAElFTkSuQmCC",
    tw: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0ICQMB9xQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUATWljcm9zb2Z0IE9mZmljZX/tNXEAAAHVSURBVEjHvZaxSwMxFMZfcndaqI6iLiKtf4H/gDgVRHATBMXBqZsOgm520LGDgoNjRwerFEFcSifH0lERQRc3wakoSvySXqXXS3JpKTd80F5y3+/l5eVdqFQqkU2CKCd82hMeVYXPRFR0o8aI8kk+ZgCnFZjV4+ZG1eU7ziBEN40oywMA+ldZlh5WkMjQDCa3hof8qyW9tCBEMYUJzRFAumpKzxjo16OzEUKUpGcEhLwWRg3p2bOCAmF5Ph40BjT4gcERqmxLKeCXImBveH7bGYvMbYARSFBea+bRqfD5Pn5/xVLi07GmWucAX8b4Y8wLDJm2oj5qvhumdUl47Ll3NW2iWcPZ28T4uyZ9RULkNUN65JLHwmgnVIp8JrvDA/5ntaCAvRqyUyPLPtzDcD6ptfSkTm7Bh8nPDAp4xRUSpm3DVkC2FX3j5XVEOukE8vj5sCCpO4AyiRCfFjC3bQeZi0HqEybbySBWtQbcKQZTeUfK80QeOj2E7zi8X7QcWJwdj1ewT6v9nTissizGL5w6iTqwiFTbgjz2gkgOoEXM4dC4Eqc1PDvEnCfHdtVpQU5NVfaxroZtqql+JlL98KX2KU/1cpLqdctygbzSnPjr8AKZS/L5A5m3rVk2xkFvAAAAAElFTkSuQmCC",
    li: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAAAAXNSR0ICQMB9xQAAAAlwSFlzAAAOxAAADsQBlSsOGwAAABl0RVh0U29mdHdhcmUATWljcm9zb2Z0IE9mZmljZX/tNXEAAAJPSURBVEjHvZbPTxNBFMdnuyUxevHAhXgwJmo0Mb1AGuHmD0I8+QOIiQRCEOJNpcaLF22Ag7GAZ+PZ5SBSFRPqAe4knErhz7C0pd1ud/t8+7adLbsz/Q2Hb9p978377OybeTMsGo2yeoIgC6HeoX5DUIGTsm3kCzXKUw8wiMnW/cmlwlg21DQIGDsPPYE1HFhuAVJVmcZijrogggSVRBsArxJeWC3kAgZs8WCFAdpctQ7bsnP6QWpA40Eq6lwPlIbvQunBCJR7Lzq2VmGY8wQIi3gbHSaH4Az0xQX4B0DKf/3S7qxMO3cNSIlzZ8D5VLndXQ461r61C7IVJxAmCPmcWB/r1k3I7WxD7tdPsC71OS9gS6lIraiZOiLD/mwRidOfRPUDzMEwGE8eUU3lMBZhwh2Pb1x6/BCy+0nUPhSWY2TTX7+EzEEKMqkU6G/fQCEWg6NiEdL4ebN7e2CMjzkw1d9BmGw2xuwMr1Fu4wfZCp8+0nPaKkMaAfQfdZTP81/rymXhzOSg6SkabOt4TXNASwtOQl2HbDIJxsQzMEZHIXN4iGCDfIXPK5VZsc5BlPDDe16n4vwrN3Zzs8sg3GdVkPF03I1d/y4DCRZDM6ClRRc0OdEARItBsLy7D4qIN2y3QfaG9bWgKujFnLu8/zgFzq8uu/1vdcUF1W6FvwkvKC5uqtTvFLBuXIPi3HNS6f4dspnhfm4zwwNko9jrV93Y4XuOXdRUfceErAUxSW+T2b3HhPDg61zig+/MjnLP5UTr4HKiNbycnOl167QukP8BzJCuEzZ6OWMAAAAASUVORK5CYII="
  };
}

function _getLogo() {
  return "data:image/png;base64,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";
}
