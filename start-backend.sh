#!/bin/bash

echo "========================================="
echo "  INICIANDO SISTEMA CINERESERVA - BACKEND"
echo "========================================="
echo

echo "[1/3] Deteniendo servicios previos..."
docker-compose down

echo
echo "[2/3] Construyendo servicios backend..."
docker-compose build

echo
echo "[3/3] Iniciando servicios backend..."
docker-compose up -d

echo
echo "========================================="
echo "  BACKEND INICIADO CORRECTAMENTE"
echo "========================================="
echo
echo "- MySQL:          http://localhost:3307"
echo "- MongoDB 1:      http://localhost:27018"  
echo "- MongoDB 2:      http://localhost:27019"
echo "- MongoDB 3:      http://localhost:27020"
echo "- User Service:   http://localhost:8081"
echo "- Movie Service:  http://localhost:8083"
echo "- Showtime Serv:  http://localhost:8084"
echo "- Reserv Service: http://localhost:8082"
echo "- Traefik:        http://localhost:8080"
echo
echo "Para iniciar el frontend:"
echo "  cd frontend/movie-reservation-app"
echo "  npm install"
echo "  npm run dev"
echo
echo "Presiona Enter para ver los logs..."
read
docker-compose logs -f 