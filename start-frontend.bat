@echo off
echo ========================================
echo   INICIANDO FRONTEND CINERESERVA LOCAL
echo ========================================
echo.

cd frontend\movie-reservation-app

echo [1/3] Verificando dependencias...
if not exist "node_modules" (
    echo Instalando dependencias de Node.js...
    npm install
) else (
    echo Dependencias ya instaladas.
)

echo.
echo [2/3] Verificando conexion con backend...
curl -s http://localhost:8081/api/auth/health > nul
if %errorlevel% neq 0 (
    echo WARNING: Backend no detectado en localhost:8081
    echo Asegurate de ejecutar start-backend.bat primero
    echo.
)

echo [3/3] Iniciando servidor de desarrollo...
echo.
echo ========================================
echo   FRONTEND DISPONIBLE EN:
echo   http://localhost:3000
echo ========================================
echo.
echo Presiona Ctrl+C para detener
npm run dev 