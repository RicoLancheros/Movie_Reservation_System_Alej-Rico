#!/bin/bash

echo "=========================================="
echo "  DETENIENDO CINERESERVA"
echo "=========================================="
echo ""

echo "🛑 Deteniendo todos los servicios..."
docker-compose down

echo ""
echo "🧹 ¿Deseas eliminar también los volúmenes de datos? (y/N)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "🗑️  Eliminando volúmenes..."
    docker-compose down -v
    echo "✅ Volúmenes eliminados"
fi

echo ""
echo "✅ CineReserva detenido exitosamente"
echo "==========================================" 