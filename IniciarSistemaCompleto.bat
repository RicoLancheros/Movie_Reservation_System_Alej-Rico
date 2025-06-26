@echo off
setlocal

REM Obtener el directorio donde está este archivo .bat
set "PROJECT_ROOT=%~dp0"

echo ========================================
echo 🚀 INICIANDO SISTEMA COMPLETO
echo ========================================
echo Directorio del proyecto: %PROJECT_ROOT%
echo.

echo 🔧 Verificando dependencias...

REM Verificar si Docker está ejecutándose
docker version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker no está ejecutándose. Por favor inicia Docker Desktop.
    echo    Las bases de datos requieren Docker para funcionar.
    pause
    exit /b 1
)
echo ✅ Docker está ejecutándose

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js no está instalado. Por favor instala Node.js.
    pause
    exit /b 1
)
echo ✅ Node.js está disponible

echo.
echo 🗃️  [1/6] Iniciando bases de datos (Docker Compose)...
cd /d "%PROJECT_ROOT%backend"
if exist "docker-compose.yml" (
    docker-compose up -d
    if %errorlevel% neq 0 (
        echo ❌ Error iniciando bases de datos
        pause
        exit /b %errorlevel%
    )
    echo ✅ Bases de datos iniciadas
) else (
    echo ⚠️  docker-compose.yml no encontrado, continuando...
)

echo.
echo ⏰ Esperando 10 segundos para que las bases de datos se inicializen...
timeout /t 10 /nobreak >nul

echo.
echo 🔵 [2/6] Iniciando User Service (Puerto 8081)...
start "User Service - Puerto 8081" cmd /k "cd /d "%PROJECT_ROOT%backend\Microservicios\user-service" && echo Iniciando User Service... && .\gradlew.bat bootRun"

timeout /t 3 /nobreak >nul

echo 🟢 [3/6] Iniciando Movie Service (Puerto 8082)...
start "Movie Service - Puerto 8082" cmd /k "cd /d "%PROJECT_ROOT%backend\Microservicios\movie-service" && echo Iniciando Movie Service... && .\gradlew.bat bootRun"

timeout /t 3 /nobreak >nul

echo 🟡 [4/6] Iniciando Showtime Service (Puerto 8083)...
start "Showtime Service - Puerto 8083" cmd /k "cd /d "%PROJECT_ROOT%backend\Microservicios\showtime-service" && echo Iniciando Showtime Service... && .\gradlew.bat bootRun"

timeout /t 3 /nobreak >nul

echo 🟠 [5/6] Iniciando Reservation Service (Puerto 8084)...
start "Reservation Service - Puerto 8084" cmd /k "cd /d "%PROJECT_ROOT%backend\Microservicios\reservation-service" && echo Iniciando Reservation Service... && .\gradlew.bat bootRun"

timeout /t 5 /nobreak >nul

echo 🌐 [6/6] Iniciando Frontend React (Puerto 5173)...
cd /d "%PROJECT_ROOT%frontend\movie-reservation-app"
if not exist "package.json" (
    echo ❌ No se encontró package.json en frontend
    echo    Verifica que la carpeta frontend/movie-reservation-app existe
    pause
    exit /b 1
)

REM Verificar si node_modules existe, si no, instalar dependencias
if not exist "node_modules" (
    echo 📦 Instalando dependencias del frontend...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Error instalando dependencias
        pause
        exit /b %errorlevel%
    )
)

start "Frontend React - Puerto 5173" cmd /k "cd /d "%PROJECT_ROOT%frontend\movie-reservation-app" && echo Iniciando Frontend React... && npm run dev"

echo.
echo ========================================
echo ✅ SISTEMA COMPLETO INICIÁNDOSE
echo ========================================
echo.
echo 🔗 URLs del sistema:
echo    🌐 Frontend:     http://localhost:5173
echo    🔍 Test Page:    http://localhost:5173/test-services
echo    👤 User API:     http://localhost:8081/actuator/health
echo    🎬 Movie API:    http://localhost:8082/actuator/health
echo    🎭 Showtime API: http://localhost:8083/actuator/health
echo    🎫 Reserva API:  http://localhost:8084/actuator/health
echo.
echo 📊 Se han abierto 5 terminales:
echo    🔵 User Service (MySQL)
echo    🟢 Movie Service (MongoDB)
echo    🟡 Showtime Service (MongoDB)
echo    🟠 Reservation Service (MongoDB)
echo    🌐 Frontend React
echo.
echo ⏰ Los servicios tardarán 1-3 minutos en estar completamente listos.
echo.
echo 🎯 Para empezar:
echo    1. Espera 2-3 minutos
echo    2. Ve a http://localhost:5173/test-services
echo    3. Haz clic en "🚀 Probar Todos los Servicios"
echo    4. Si todo está verde, ¡ya puedes usar el sistema!
echo.
echo ⚠️  Para detener todo:
echo    - Cierra todas las terminales abiertas
echo    - Ejecuta: docker-compose down (en backend/)
echo.

pause 