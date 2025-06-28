# Movie Reservation System - CineReserva 🎬

Sistema integral de gestión de reservas de películas desarrollado con arquitectura de microservicios. Combina un backend robusto en Spring Boot con un frontend moderno en React TypeScript, ofreciendo una experiencia completa para la gestión de cines, películas y reservas de asientos.

## 📥 Instalación

### Prerrequisitos
- Node.js 18+ y npm
- Java 17+
- Docker y Docker Compose
- Git

### 1. Clonar el Repositorio
```bash
git clone https://github.com/RicoLancheros/Movie_Reservation_System_Alej-Rico.git
cd Movie_Reservation_System_Alej-Rico
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
- Frontend: http://localhost:5173
- Movie Service: http://localhost:8082/api/movies
- Showtime Service: http://localhost:8083/api/showtimes
- Traefik Dashboard: http://localhost:8080

## 📖 Manual de Usuario

### Acceso al Sistema

#### Usuario Administrador
- **Usuario**: `admin`
- **Contraseña**: `password123`
- **Funcionalidades**:
  - Panel de Administración - Gestión CRUD de películas
  - Crear Películas - Envía datos al Movie Service
  - Editar Películas - Actualiza en base de datos MongoDB
  - Eliminar Películas - Eliminación desde backend

#### Usuario Regular
- **Usuario**: `user`
- **Contraseña**: `password123`
- **Funcionalidades**:
  - Explorar Catálogo - Películas reales desde Movie Service
  - Ver Detalles - Información completa + horarios reales
  - Reservar Asientos - Sistema completo de reservas

### Panel de Administración

El Panel de Administración está completamente conectado al backend:

1. **Acceso**: Login como admin → Panel de Administración
2. **Vista**: Tabla con todas las películas desde MongoDB
3. **Funciones Disponibles**:

   **Crear Película Nueva**:
   - Formulario completo con validaciones
   - Envío directo al Movie Service (POST /api/movies)
   - Actualización automática de la tabla

   **Editar Película Existente**:
   - Carga datos reales desde backend
   - Actualización via PUT /api/movies/{id}
   - Cambios reflejados inmediatamente

   **Eliminar Película**:
   - Confirmación de seguridad
   - Eliminación via DELETE /api/movies/{id}
   - Actualización automática del catálogo

### Proceso de Reserva

#### 1. Explorar Catálogo
- Navegar por películas disponibles
- Filtrar por género o buscar por título
- Ver información básica de cada película

#### 2. Seleccionar Película
- Hacer clic en "Ver Detalles" en cualquier película
- Revisar información completa: sinopsis, director, reparto
- Ver horarios disponibles para los próximos 7 días

#### 3. Elegir Horario
- **Precios Variables**:
  - Lunes a Jueves: $8.000 COP
  - Viernes a Domingo: $12.000 COP
  - Horarios Prime (7:00 PM - 10:00 PM): +$2.000 COP
- Hacer clic en "Reservar" en el horario deseado

#### 4. Seleccionar Asientos
- **Mapa Interactivo**: 8 filas × 12 asientos (96 asientos totales)
- **Códigos de Color**:
  - Verde: Disponible
  - Rojo: Ocupado
  - Azul: Seleccionado
  - Morado: Accesible
- **Limitaciones**: Máximo 8 asientos por reserva
- Ver resumen en tiempo real del precio total

#### 5. Información Personal
- Completar formulario con datos personales
- Información de contacto requerida
- Validaciones automáticas

#### 6. Proceso de Pago
- **Métodos Aceptados**: Visa, MasterCard, American Express
- **Campos Requeridos**:
  - Número de tarjeta (formato automático)
  - Fecha de vencimiento (MM/YY)
  - CVV (3-4 dígitos)
  - Nombre del titular
- **Validaciones**: Formato de tarjeta, fecha válida, CVV correcto

#### 7. Confirmación
- Ticket digital generado automáticamente
- Código de reserva único
- Detalles completos de la reserva
- Opción de descargar o imprimir

### Limitaciones del Sistema
- **Persistencia**: Datos almacenados en localStorage (frontend)
- **Tiempo de Sesión**: Sin límite de tiempo establecido
- **Métodos de Pago**: Solo simulación, no procesamiento real
- **Asientos**: Máximo 8 asientos por transacción

## 🛠 Tecnologías y Librerías

### Frontend
- **React 18** - Biblioteca de UI moderna
- **TypeScript** - Tipado estático para JavaScript
- **Tailwind CSS** - Framework CSS utilitario
- **Zustand** - Gestión de estado ligera
- **React Router** - Navegación SPA
- **Lucide React** - Iconografía moderna
- **Vite** - Build tool ultrarrápido

### Backend
- **Spring Boot 3.0+** - Framework Java empresarial
- **Spring Data MongoDB** - ODM para MongoDB
- **Spring Data JPA** - ORM para bases relacionales
- **Spring Security** - Autenticación y autorización
- **MySQL 8.0** - Base de datos relacional
- **MongoDB** - Base de datos NoSQL
- **Docker Compose** - Orquestación de contenedores
- **Traefik v2.10** - Proxy reverso y load balancer

### Herramientas de Desarrollo
- **Gradle** - Sistema de construcción para Java
- **ESLint** - Linter para JavaScript/TypeScript
- **Prettier** - Formateador de código
- **Vitest** - Framework de testing para Vite
- **Git** - Control de versiones

## 🗂 Historial de Versiones

### V0.0.3 - Sistema de Reservas Frontend Completo
- Implementación completa del panel de administración
- Página de detalles de película con horarios dinámicos
- Sistema de selección de asientos interactivo
- Proceso de pago completo con validaciones
- Página de confirmación con ticket digital
- Actualización del README con documentación profesional

### V0.0.2 - Backend y Bases de Datos
- Configuración de microservicios Spring Boot
- Implementación de bases de datos MongoDB y MySQL
- Sistema de autenticación con Spring Security
- APIs RESTful para todos los servicios
- Configuración de Docker Compose

### V0.0.1 - Estructura Base y Docker
- Configuración inicial del proyecto
- Estructura de microservicios
- Configuración de Docker y docker-compose
- Setup básico de frontend React

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

**Desarrollado por**: Alejandro Rico & Rico Lancheros  
**Versión Actual**: V0.0.3  
**Última Actualización**: Diciembre 2024