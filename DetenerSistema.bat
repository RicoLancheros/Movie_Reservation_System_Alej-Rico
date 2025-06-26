@echo off
setlocal

REM Obtener el directorio donde está este archivo .bat
set "PROJECT_ROOT=%~dp0"

echo ========================================
echo 🛑 DETENIENDO SISTEMA COMPLETO
echo ========================================
echo.

echo 🔍 Buscando y cerrando procesos Java (microservicios)...

REM Cerrar procesos Java que corresponden a los microservicios
for /f "tokens=2" %%i in ('tasklist /fi "imagename eq java.exe" /fo csv ^| findstr /i "8081\|8082\|8083\|8084"') do (
    echo Cerrando proceso Java %%i...
    taskkill /pid %%i /f >nul 2>&1
)

REM Método alternativo: cerrar por puerto
echo 🔌 Liberando puertos 8081-8084...
for %%p in (8081 8082 8083 8084) do (
    for /f "tokens=5" %%a in ('netstat -aon ^| findstr :%%p') do (
        echo Liberando puerto %%p (PID: %%a)...
        taskkill /pid %%a /f >nul 2>&1
    )
)

echo 🌐 Cerrando procesos Node.js (frontend)...
REM Cerrar procesos de Node.js en puerto 5173
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do (
    echo Cerrando frontend (PID: %%a)...
    taskkill /pid %%a /f >nul 2>&1
)

echo 🗃️  Deteniendo bases de datos (Docker Compose)...
cd /d "%PROJECT_ROOT%backend"
if exist "docker-compose.yml" (
    docker-compose down
    if %errorlevel% neq 0 (
        echo ⚠️  Error deteniendo Docker Compose, pero continuando...
    ) else (
        echo ✅ Bases de datos detenidas
    )
) else (
    echo ⚠️  docker-compose.yml no encontrado
)

echo.
echo 🧹 Limpiando terminales abiertas...
REM Cerrar ventanas de CMD con títulos específicos
taskkill /fi "WINDOWTITLE eq User Service*" /f >nul 2>&1
taskkill /fi "WINDOWTITLE eq Movie Service*" /f >nul 2>&1
taskkill /fi "WINDOWTITLE eq Showtime Service*" /f >nul 2>&1
taskkill /fi "WINDOWTITLE eq Reservation Service*" /f >nul 2>&1
taskkill /fi "WINDOWTITLE eq Frontend React*" /f >nul 2>&1

echo.
echo ========================================
echo ✅ SISTEMA DETENIDO COMPLETAMENTE
echo ========================================
echo.
echo 📊 Acciones realizadas:
echo    🔵 Procesos Java (microservicios) cerrados
echo    🌐 Frontend React cerrado
echo    🗃️  Bases de datos Docker detenidas
echo    🧹 Terminales cerradas
echo.
echo 🔍 Verificando puertos liberados...
echo.

REM Verificar que los puertos estén liberados
set "PORTS_BUSY="
for %%p in (8081 8082 8083 8084 5173) do (
    netstat -an | findstr :%%p >nul 2>&1
    if not errorlevel 1 (
        set "PORTS_BUSY=!PORTS_BUSY! %%p"
        echo ⚠️  Puerto %%p aún ocupado
    ) else (
        echo ✅ Puerto %%p liberado
    )
)

if defined PORTS_BUSY (
    echo.
    echo ⚠️  Algunos puertos siguen ocupados. Si es necesario, reinicia tu PC.
) else (
    echo.
    echo ✅ Todos los puertos han sido liberados correctamente.
)

echo.
echo 💡 El sistema está completamente detenido.
echo    Puedes usar IniciarSistemaCompleto.bat para volver a iniciarlo.
echo.

pause 