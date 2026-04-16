INSTRUCCIONES PARA SINCRONIZACIÓN DE LDAP/DIRECTORIO
=================================================

Para actualizar el directorio de la intranet con los datos reales del Active Directory de PROMESE/CAL, sigue estos pasos:

1. Requisitos:
   - Una PC unida al dominio (Domain Joined).
   - Privilegios básicos de lectura en el AD.

2. Cómo ejecutar:
   - Simplemente haz doble clic en el archivo: "actualizar_directorio.bat"
   - O desde la terminal (CMD): .\actualizar_directorio.bat

3. Qué hace el script:
   - Se conecta a promese.promesecal.gob.do:389
   - Filtra usuarios activos que tengan una extensión configurada en su perfil.
   - Extrae: Nombre, Cargo, Departamento, Extensión y Correo.
   - Genera automáticamente el archivo "..\js\ldap_data.js".

4. Automatización:
   - Puedes configurar una "Tarea Programada" (Task Scheduler) en Windows para que este script se ejecute semanalmente (ej. todos los lunes a las 8:00 AM).

Nota: Si por alguna razón el servidor LDAP no está disponible, la intranet seguirá funcionando con los datos estáticos de respaldo definidos en js/state.js.
