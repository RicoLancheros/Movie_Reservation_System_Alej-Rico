@echo off
echo ==========================================
echo   INICIANDO CINERESERVA - SISTEMA COMPLETO
echo ==========================================
echo.

echo 🐳 Construyendo y iniciando todos los servicios...
docker-compose up --build -d

echo.
echo ⏳ Esperando a que los servicios se inicialicen...
timeout /t 30 /nobreak

echo.
echo 🔍 Verificando estado de los servicios...
docker-compose ps

echo.
echo ==========================================
echo   CINERESERVA INICIADO EXITOSAMENTE
echo ==========================================
echo.
echo 🌐 Accesos disponibles:
echo    Frontend:           http://localhost:3000
echo    API Gateway:        http://localhost:80
echo    Traefik Dashboard:  http://localhost:8080
echo.
echo 🔧 APIs directas:
echo    User Service:       http://localhost:8081
echo    Movie Service:      http://localhost:8083
echo    Showtime Service:   http://localhost:8084
echo    Reservation Service: http://localhost:8082
echo.
echo 👤 Credenciales de prueba:
echo    Usuario: admin / Contraseña: password
echo    Usuario: user  / Contraseña: password
echo.
echo 📋 Comandos útiles:
echo    Ver logs:     docker-compose logs [servicio]
echo    Detener:      docker-compose down
echo    Reconstruir:  docker-compose up --build
echo ==========================================
echo.
echo Presiona cualquier tecla para abrir el navegador...
pause
start http://localhost:3000 