@echo off
echo ===================================================
echo ACTUALIZANDO DIRECTORIO DESDE LDAP (PROMESE/CAL)
echo ===================================================
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0ldap_sync.ps1"
echo.
echo ===================================================
echo Proceso finalizado. Presione cualquier tecla para salir.
pause > nul
