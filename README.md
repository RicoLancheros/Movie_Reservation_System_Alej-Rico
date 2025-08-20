# Movie Reservation System - CineReserva (☞ﾟヮﾟ)☞

Roadmap URL proyect: https://roadmap.sh/projects/movie-reservation-system <3

Sistema de reservación de cine con arquitectura de microservicios híbrida (Go + Java) y frontend React.

## Tecnologías Implementadas

### Backend
- **Go 1.21**: Servicios de autenticación y catálogo (Gin Framework, MongoDB Driver, BCrypt)
- **Java 17**: Servicios de horarios y reservas (Spring Boot, Spring Data MongoDB)
- **Docker**: Containerización de servicios
- **Traefik**: API Gateway y Load Balancer
- **MySQL**: Base de datos relacional (puerto 3307)
- **MongoDB**: Bases de datos NoSQL (puertos 27018-27020)

### Frontend
- **React 18** con TypeScript
- **Vite**: Build tool
- **Tailwind CSS**: Framework de estilos
- **Zustand**: State management
- **React Hook Form** y **Zod**: Manejo y validación de formularios

## Despliegue del Aplicativo

### Prerequisitos
- Docker y Docker Compose instalados
- Node.js 16+ y npm instalados
- Puertos disponibles: 80, 5174, 8080-8084, 3307, 27018-27020

### Paso 1: Clonar el Repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
cd Movie_Reservation_System_Alej-Rico
```

### Paso 2: Iniciar Backend
```bash
# Windows
start-backend.bat

# Linux/Mac
chmod +x start-backend.sh
./start-backend.sh
```

### Paso 3: Iniciar Frontend
```bash
# Windows
start-frontend.bat

# Linux/Mac
cd frontend/movie-reservation-app
npm install
npm run dev
```

### Paso 4: Verificar el Despliegue
- **Aplicación Web**: http://localhost:5174
- **API Gateway**: http://localhost:80
- **Traefik Dashboard**: http://localhost:8080

## Arquitectura del Sistema

### Microservicios

| Servicio | Puerto | Tecnología | Función |
|----------|--------|------------|---------|
| user-service-go | 8081 | Go + Gin | Autenticación y gestión de usuarios |
| movie-service-go | 8083 | Go + Gin | Catálogo de películas |
| showtime-service | 8084 | Java + Spring | Gestión de horarios |
| reservation-service | 8082 | Java + Spring | Sistema de reservas |

### Bases de Datos
- **MySQL** (puerto 3307): Datos relacionales
- **MongoDB** (puertos 27018-27020): Datos no relacionales distribuidos

## Estructura del Proyecto

```
Movie_Reservation_System_Alej-Rico/
├── backend/
│   ├── Microservicios/
│   │   ├── user-service-go/
│   │   ├── movie-service-go/
│   │   ├── showtime-service/
│   │   └── reservation-service/
│   └── traefik/
├── frontend/
│   └── movie-reservation-app/
├── docker-compose.yml
├── start-backend.bat/.sh
└── start-frontend.bat
```

## Credenciales por Defecto

### Usuarios del Sistema
- Admin: `admin` / `password`
- Usuario: `user` / `password`

### Bases de Datos
- MySQL: `movieuser` / `moviepass`
- MongoDB: `admin` / `password`

## API Endpoints Principales

### User Service
```bash
GET  /api/users                 # Obtener usuarios
POST /api/auth/login           # Autenticación
POST /api/auth/register        # Registro de usuarios
```

### Movie Service
```bash
GET  /api/movies               # Listar películas
POST /api/movies               # Crear película
GET  /api/movies/{id}          # Obtener película específica
PUT  /api/movies/{id}          # Actualizar película
DELETE /api/movies/{id}        # Eliminar película
```

### Showtime Service
```bash
GET  /api/showtimes            # Listar horarios
POST /api/showtimes            # Crear horario
GET  /api/showtimes/movie/{id} # Horarios por película
```

### Reservation Service
```bash
GET  /api/reservations         # Listar reservas
POST /api/reservations         # Crear reserva
GET  /api/reservations/{id}    # Obtener reserva específica
```

## Configuración de Desarrollo

### Backend
1. Los servicios Go se encuentran en `/backend/Microservicios/[servicio]-go/`
2. Los servicios Java están en `/backend/Microservicios/[servicio]/`
3. Para reconstruir un servicio específico:
   ```bash
   docker-compose build [nombre-servicio]
   docker-compose up -d [nombre-servicio]
   ```

### Frontend
1. El código fuente está en `/frontend/movie-reservation-app/src/`
2. El servidor de desarrollo incluye hot reload automático
3. Para producción:
   ```bash
   npm run build
   ```

## Comandos Útiles

### Gestión de Servicios
```bash
# Detener todos los servicios
docker-compose down

# Ver logs de un servicio específico
docker-compose logs -f [nombre-servicio]

# Reiniciar un servicio
docker-compose restart [nombre-servicio]

# Limpiar contenedores y volúmenes
docker-compose down -v
docker system prune -f
```

### Desarrollo Frontend
```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build de producción
npm run build

# Preview de producción
npm run preview
```

## Solución de Problemas

### El backend no inicia correctamente
```bash
docker-compose down -v
docker system prune -f
docker-compose up -d --build
```

### Errores en el frontend
```bash
cd frontend/movie-reservation-app
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Problemas de conectividad entre servicios
1. Verificar que todos los servicios estén ejecutándose: `docker-compose ps`
2. Revisar logs del servicio afectado: `docker-compose logs [servicio]`
3. Verificar configuración de CORS en los servicios backend

## Características Principales

- Sistema de autenticación JWT
- Catálogo de películas con gestión completa CRUD
- Sistema de horarios y funciones
- Reserva de asientos con sincronización en tiempo real
- Panel de administración
- API Gateway con balanceo de carga
- Health checks automáticos para todos los servicios

## Requisitos del Sistema

- Docker Desktop 4.0+
- Node.js 16+
- 4GB RAM mínimo
- 10GB espacio en disco disponible

## Autores

Alejandro Rico Lancheros Dev <3
