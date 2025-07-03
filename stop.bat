@echo off
echo ==========================================
echo   DETENIENDO CINERESERVA
echo ==========================================
echo.

echo 🛑 Deteniendo todos los servicios...
docker-compose down

echo.
echo 🧹 ¿Deseas eliminar también los volúmenes de datos? (y/N)
set /p response=
if /i "%response%"=="y" (
    echo 🗑️  Eliminando volúmenes...
    docker-compose down -v
    echo ✅ Volúmenes eliminados
)

echo.
echo ✅ CineReserva detenido exitosamente
echo ==========================================
pause 