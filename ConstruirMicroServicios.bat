@echo off
setlocal

REM Obtener el directorio donde está este archivo .bat
set "PROJECT_ROOT=%~dp0"

echo ========================================
echo Construyendo Microservicios para Traefik
echo ========================================
echo Directorio del proyecto: %PROJECT_ROOT%
echo.

echo [1/4] Construyendo movie-service...
cd /d "%PROJECT_ROOT%backend\Microservicios\movie-service"
if not exist "gradlew.bat" (
    echo Error: No se encontró gradlew.bat en movie-service
    pause
    exit /b 1
)
call .\gradlew.bat clean build -x test
if %errorlevel% neq 0 (
    echo Error: Fallo en movie-service
    pause
    exit /b %errorlevel%
)
echo movie-service construido exitosamente!

echo.
echo [2/4] Construyendo showtime-service...
cd /d "%PROJECT_ROOT%backend\Microservicios\showtime-service"
if not exist "gradlew.bat" (
    echo Error: No se encontró gradlew.bat en showtime-service
    pause
    exit /b 1
)
call .\gradlew.bat clean build -x test
if %errorlevel% neq 0 (
    echo Error: Fallo en showtime-service
    pause
    exit /b %errorlevel%
)
echo showtime-service construido exitosamente!

echo.
echo [3/4] Construyendo reservation-service...
cd /d "%PROJECT_ROOT%backend\Microservicios\reservation-service"
if not exist "gradlew.bat" (
    echo Error: No se encontró gradlew.bat en reservation-service
    pause
    exit /b 1
)
call .\gradlew.bat clean build -x test
if %errorlevel% neq 0 (
    echo Error: Fallo en reservation-service
    pause
    exit /b %errorlevel%
)
echo reservation-service construido exitosamente!

echo.
echo [4/4] Construyendo user-service...
cd /d "%PROJECT_ROOT%backend\Microservicios\user-service"
if not exist "gradlew.bat" (
    echo Error: No se encontró gradlew.bat en user-service
    pause
    exit /b 1
)
call .\gradlew.bat clean build -x test
if %errorlevel% neq 0 (
    echo Error: Fallo en user-service
    pause
    exit /b %errorlevel%
)
echo user-service construido exitosamente!

echo.
echo ========================================
echo ✅ Todos los microservicios construidos!
echo ========================================
echo.
echo ℹ️  Los servicios están listos para ejecutarse.
echo    Puedes usar IniciarMicroServicios.bat para iniciarlos.
echo.

pause