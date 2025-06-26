@echo off
setlocal

REM Obtener el directorio donde está este archivo .bat
set "PROJECT_ROOT=%~dp0"

echo ========================================
echo Iniciando Microservicios para Traefik
echo ========================================
echo Directorio del proyecto: %PROJECT_ROOT%
echo.

echo Iniciando terminales separadas para cada microservicio...
echo.

echo [1/4] Iniciando User Service (Puerto 8081)...
start "User Service - Puerto 8081" cmd /k "cd /d "%PROJECT_ROOT%backend\Microservicios\user-service" && .\gradlew.bat bootRun"

timeout /t 2 /nobreak >nul

echo [2/4] Iniciando Movie Service (Puerto 8082)...
start "Movie Service - Puerto 8082" cmd /k "cd /d "%PROJECT_ROOT%backend\Microservicios\movie-service" && .\gradlew.bat bootRun"

timeout /t 2 /nobreak >nul

echo [3/4] Iniciando Showtime Service (Puerto 8083)...
start "Showtime Service - Puerto 8083" cmd /k "cd /d "%PROJECT_ROOT%backend\Microservicios\showtime-service" && .\gradlew.bat bootRun"

timeout /t 2 /nobreak >nul

echo [4/4] Iniciando Reservation Service (Puerto 8084)...
start "Reservation Service - Puerto 8084" cmd /k "cd /d "%PROJECT_ROOT%backend\Microservicios\reservation-service" && .\gradlew.bat bootRun"

echo.
echo ========================================
echo ✅ Todos los microservicios iniciándose!
echo ========================================
echo.
echo Se han abierto 4 terminales separadas:
echo 🔵 User Service: Puerto 8081        (MySQL)
echo 🟢 Movie Service: Puerto 8082       (MongoDB)  
echo 🟡 Showtime Service: Puerto 8083    (MongoDB)
echo 🟠 Reservation Service: Puerto 8084 (MongoDB)
echo.
echo ⏰ Los servicios tardarán unos momentos en iniciar completamente.
echo.
echo 🔗 URLs de prueba:
echo    - Health checks: http://localhost:808X/actuator/health
echo    - Frontend: http://localhost:5173 (ejecutar por separado)
echo    - Test page: http://localhost:5173/test-services
echo.
echo ⚠️  Para detener los servicios:
echo    - Cierra cada terminal individual, o
echo    - Presiona Ctrl+C en cada terminal
echo.
echo 💡 Asegúrate de que Docker esté ejecutándose para las bases de datos.
echo.

pause