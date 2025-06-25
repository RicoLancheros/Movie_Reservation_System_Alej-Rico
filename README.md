# Movie Reservation System - CineReserva 🎬

**Versión Actual: V0.0.4 - Integración Backend-Frontend Completa**

Sistema integral de gestión de reservas de películas con arquitectura de microservicios completamente funcional. Backend en Spring Boot integrado con frontend moderno en React TypeScript.

[![Version](https://img.shields.io/badge/version-0.0.4-blue.svg)](https://github.com/tu-usuario/movie-reservation-system)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.0+-6DB33F?logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Manual de Usuario](#-manual-de-usuario)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [APIs del Backend](#-apis-del-backend)
- [Versionado](#-historial-de-versiones)
- [Contribuir](#-contribuir)

## ✨ Características

### 🔗 Integración Completa Backend-Frontend
- 🎭 **Panel Admin Funcional** - CRUD completo de películas conectado al backend
- 🎬 **Catálogo Real** - Datos cargados desde APIs de microservicios
- 🕐 **Horarios Dinámicos** - Showtime Service genera funciones automáticamente
- 🗄️ **Persistencia Real** - Datos almacenados en MongoDB y MySQL
- 🔄 **Estados de Carga** - UX mejorada con loading y manejo de errores

### Frontend React Actualizado
- 🎬 **Catálogo de Películas** - Conectado a Movie Service (puerto 8082)
- 🛡️ **Sistema de Autenticación** - Login seguro con roles
- 🪑 **Selección de Asientos Interactiva** - Mapa visual de sala
- 💳 **Proceso de Pago Simulado** - Formulario completo
- 📱 **Diseño Responsivo** - Optimizado para móviles y desktop
- 🔄 **Gestión de Estado** - Zustand integrado con APIs
- 🎯 **Navegación Funcional** - MovieDetailPage conectado al backend

### Backend Microservicios Completo
- 🎭 **Movie Service** - Gestión completa de películas con MongoDB
- 🕐 **Showtime Service** - Horarios dinámicos con IDs reales
- 🎫 **Reservation Service** - Sistema de reservas funcional
- 👤 **User Service** - Autenticación y usuarios
- 🚪 **API Gateway** - Traefik configurado
- 🐳 **Infraestructura** - Docker Compose completo

## 🛠 Tecnologías

### Frontend
- **React 18** - Biblioteca de UI moderna
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework CSS utilitario
- **Zustand** - Gestión de estado conectada a APIs
- **React Router** - Navegación SPA
- **Lucide React** - Iconografía moderna
- **Vite** - Build tool ultrarrápido

### Backend
- **Spring Boot 3.0+** - Framework Java
- **Spring Data MongoDB** - Base NoSQL para películas
- **Spring Data JPA** - Base relacional para usuarios
- **MySQL 8.0** - Base de datos de usuarios
- **MongoDB** - Base de datos de películas y horarios
- **Docker Compose** - Orquestación de contenedores
- **Traefik v2.10** - Proxy reverso y load balancer

## 📥 Instalación

### Prerrequisitos
- **Node.js 18+** y npm
- **Java 17+**
- **Docker** y Docker Compose
- **Git**

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/movie-reservation-system.git
cd movie-reservation-system
```

### 2. Configurar Backend (Microservicios)
```bash
cd backend

# Iniciar bases de datos con Docker
docker-compose up -d

# Verificar que los servicios estén corriendo
docker-compose ps

# Construir todos los microservicios
cd Microservicios/movie-service
./gradlew clean build -x test

cd ../showtime-service  
./gradlew clean build -x test

cd ../reservation-service
./gradlew clean build -x test

cd ../user-service
./gradlew clean build -x test
```

### 3. Ejecutar Microservicios
```bash
# En terminales separadas, ejecutar cada servicio:

# Terminal 1 - Movie Service (Puerto 8082)
cd backend/Microservicios/movie-service
./gradlew bootRun

# Terminal 2 - Showtime Service (Puerto 8083)
cd backend/Microservicios/showtime-service
./gradlew bootRun

# Terminal 3 - Reservation Service (Puerto 8084)
cd backend/Microservicios/reservation-service
./gradlew bootRun

# Terminal 4 - User Service (Puerto 8081)
cd backend/Microservicios/user-service
./gradlew bootRun
```

### 4. Configurar Frontend
```bash
cd frontend/movie-reservation-app

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### 5. Verificar Instalación
- **Frontend**: http://localhost:5173
- **Movie Service**: http://localhost:8082/api/movies
- **Showtime Service**: http://localhost:8083/api/showtimes
- **Traefik Dashboard**: http://localhost:8080

## 📖 Manual de Usuario

### 🚪 Acceso al Sistema

#### 👨‍💼 Usuario Administrador
- **Usuario**: `admin`
- **Contraseña**: `password123`
- **Funcionalidades**:
  - ✅ **Panel de Administración** - Gestión CRUD de películas
  - ✅ **Crear Películas** - Envía datos al Movie Service
  - ✅ **Editar Películas** - Actualiza en base de datos MongoDB
  - ✅ **Eliminar Películas** - Eliminación desde backend

#### 👤 Usuario Regular
- **Usuario**: `user`
- **Contraseña**: `password123`
- **Funcionalidades**:
  - ✅ **Explorar Catálogo** - Películas reales desde Movie Service
  - ✅ **Ver Detalles** - Información completa + horarios reales
  - ✅ **Reservar Asientos** - Sistema completo de reservas

### 🎬 Panel de Administración (CRUD Completo)

#### ✨ Nueva Funcionalidad: Gestión Real de Películas

El Panel de Administración ahora está **completamente conectado al backend**:

1. **Acceso**: Login como admin → Panel de Administración
2. **Vista**: Tabla con todas las películas desde MongoDB
3. **Funciones Disponibles**:

   **🆕 Crear Película Nueva**:
   - Formulario completo con validaciones
   - Envío directo al Movie Service (POST /api/movies)
   - Actualización automática de la tabla

   **✏️ Editar Película Existente**:
   - Carga datos reales desde backend
   - Actualización via PUT /api/movies/{id}
   - Cambios reflejados inmediatamente

   **🗑️ Eliminar Película**:
   - Confirmación de seguridad
   - Eliminación via DELETE /api/movies/{id}
   - Actualización automática del catálogo

### 🎭 Exploración de Películas (Datos Reales)

#### Catálogo Principal
- **10 Películas Reales** cargadas desde Movie Service
- **Datos Completos**: Títulos, descripciones, imágenes, reparto
- **Filtros Funcionales**: Por género y búsqueda de título
- **Performance**: Loading states y manejo de errores

#### Página de Detalles
- **Información Completa**: Director, fecha de estreno, reparto
- **Horarios Reales**: Conectados al Showtime Service
- **Navegación Funcional**: Ya no muestra "película no encontrada"
- **Integración**: Datos sincronizados entre microservicios

## 🔌 APIs del Backend

### Movie Service (Puerto 8082)
```bash
GET    /api/movies                 # Todas las películas
GET    /api/movies/{id}            # Película por ID
GET    /api/movies/search?genre=   # Filtrar por género
GET    /api/movies/search?title=   # Buscar por título
POST   /api/movies                 # Crear película
PUT    /api/movies/{id}            # Actualizar película
DELETE /api/movies/{id}            # Eliminar película
```

### Showtime Service (Puerto 8083)
```bash
GET    /api/showtimes                    # Todos los horarios
GET    /api/showtimes/movie/{movieId}    # Horarios por película
GET    /api/showtimes/date/{date}        # Horarios por fecha
POST   /api/showtimes                    # Crear horario
PUT    /api/showtimes/{id}/reserve-seats # Reservar asientos
```

### Reservation Service (Puerto 8084)
```bash
GET    /api/reservations           # Todas las reservas
POST   /api/reservations           # Crear reserva
GET    /api/reservations/user/{id} # Reservas por usuario
```

## 🏗 Arquitectura del Sistema

### Microservicios Backend
```
backend/
├── movie-service/         # MongoDB (Puerto 27018) - Gestión de películas
├── showtime-service/      # MongoDB (Puerto 27019) - Horarios y salas  
├── reservation-service/   # MongoDB (Puerto 27020) - Reservas
├── user-service/          # MySQL (Puerto 3306) - Usuarios y autenticación
└── traefik/              # API Gateway (Puerto 8080)
```

### Integración Frontend-Backend
```
Frontend (React)
    ↓ HTTP Calls
Movie Store (Zustand)
    ↓ fetch()
Movie Service API
    ↓ MongoDB
Películas Persistentes
```

## 📚 Historial de Versiones

### 🆕 V0.0.4 - Integración Backend-Frontend Completa
**Fecha**: Junio 2025
- ✅ **Panel Admin Conectado**: CRUD completo de películas con backend
- ✅ **Navegación Funcional**: MovieDetailPage conectado a APIs
- ✅ **Datos Reales**: HomePage carga desde Movie Service
- ✅ **Horarios Dinámicos**: Showtime Service con IDs reales de películas
- ✅ **Selector de Asientos Fijo**: Asientos se marcan en azul correctamente
- ✅ **Estados de Carga**: Loading states y manejo de errores
- ✅ **Limpieza de Código**: Eliminado localStorage del admin y navegación
- ✅ **Sincronización**: IDs de películas conectados entre microservicios

### V0.0.3 - Sistema de Reservas Frontend Completo
**Fecha**: Diciembre 2024
- ✅ Frontend React completo con TypeScript
- ✅ Sistema de autenticación con roles
- ✅ Selección de asientos interactiva
- ✅ Proceso de pago simulado
- ✅ Diseño responsivo con Tailwind CSS

### V0.0.2 - Configuración Backend y Base de Datos
**Fecha**: Noviembre 2024
- ✅ Configuración de bases de datos MySQL y MongoDB
- ✅ Microservicios Spring Boot
- ✅ Spring Security básico

### V0.0.1 - Estructura Base del Proyecto
**Fecha**: Octubre 2024
- ✅ Estructura inicial del proyecto
- ✅ Configuración Docker Compose

## 🚀 Próximas Funcionalidades

- 🔐 **Autenticación Backend**: Conectar login con User Service
- 🎫 **Reservas Funcionales**: Integrar Reservation Service
- 📧 **Sistema de Notificaciones**: Emails de confirmación
- 👤 **Perfil de Usuario**: Historial de reservas
- 📊 **Dashboard de Reportes**: Analytics para administradores
- 🎯 **Sistema de Descuentos**: Promociones y códigos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'V0.0.X - Descripción del cambio'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autores

- **Alejandro Rico** - *Desarrollo Full Stack* - [@tu-github](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- Proyecto basado en [Movie Reservation System](https://roadmap.sh/projects/movie-reservation-system)
- Iconos por [Lucide](https://lucide.dev/)
- Inspiración de UI por [Tailwind CSS](https://tailwindcss.com/)

---

⭐ **¡Si te gusta este proyecto, dale una estrella!** ⭐ 