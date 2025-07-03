# 🎬 Movie Reservation System - CineReserva

Sistema completo de reservación de cine con **arquitectura híbrida de microservicios** (Go + Java) y frontend React moderno.

## 🏗️ **Arquitectura del Sistema**

### **Backend Híbrido (Docker)**
- **🐹 Servicios Go**: user-service-go (8081), movie-service-go (8083)
- **☕ Servicios Java**: showtime-service (8084), reservation-service (8082)  
- **🗄️ Bases de datos**: MySQL (3307), 3x MongoDB (27018-27020)
- **🌐 API Gateway**: Traefik (80/8080)

### **Frontend React (Local)**
- **⚛️ React + TypeScript**: Desarrollo local en puerto 5174
- **⚡ Vite**: Build tool ultrarrápido con hot reload
- **🎨 Tailwind CSS**: Diseño moderno y responsivo
- **📦 Zustand**: State management eficiente

## 🚀 **Inicio Rápido**

### **1. Iniciar Backend**
```bash
# Windows
start-backend.bat

# Linux/Mac  
./start-backend.sh
```

### **2. Iniciar Frontend** 
```bash
# Windows
start-frontend.bat

# Linux/Mac
cd frontend/movie-reservation-app
npm install
npm run dev
```

### **3. Acceder al Sistema**
- **Frontend**: http://localhost:5174
- **API Gateway**: http://localhost:80
- **Traefik Dashboard**: http://localhost:8080

## 📋 **Scripts Disponibles**

### **Backend**
- `start-backend.bat/.sh` - Inicia todos los servicios backend
- `stop.bat/.sh` - Detiene todos los servicios
- `docker-compose logs [servicio]` - Ver logs específicos

### **Frontend**
- `start-frontend.bat` - Inicia frontend local (Windows)
- `npm run dev` - Comando directo de desarrollo
- `npm run build` - Construir para producción

## 🔧 **Servicios y Puertos**

| Servicio | Puerto | URL | Tecnología | Estado |
|----------|--------|-----|------------|--------|
| Frontend | 5174 | http://localhost:5174 | React + Vite | 🟢 Local |
| User Service | 8081 | http://localhost:8081 | **Go + Gin** | 🐳 Docker |
| Movie Service | 8083 | http://localhost:8083 | **Go + Gin** | 🐳 Docker |
| Showtime Service | 8084 | http://localhost:8084 | Java + Spring | 🐳 Docker |  
| Reservation Service | 8082 | http://localhost:8082 | Java + Spring | 🐳 Docker |
| MySQL | 3307 | localhost:3307 | Database | 🐳 Docker |
| MongoDB 1 | 27018 | localhost:27018 | Database | 🐳 Docker |
| MongoDB 2 | 27019 | localhost:27019 | Database | 🐳 Docker |
| MongoDB 3 | 27020 | localhost:27020 | Database | 🐳 Docker |
| Traefik | 80/8080 | http://localhost:80 | API Gateway | 🐳 Docker |

## 🧪 **Pruebas de API**

### **User Service (Go)**
```bash
# Obtener usuarios
curl http://localhost:8081/api/users

# Login  
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

### **Movie Service (Go)**
```bash
# Obtener películas
curl http://localhost:8083/api/movies

# Crear película
curl -X POST http://localhost:8083/api/movies \
  -H "Content-Type: application/json" \
  -d '{"title":"Nueva Película","description":"Descripción","genre":"Acción","duration":120}'
```

## 🔑 **Credenciales por Defecto**

### **Usuarios del Sistema**
- **Admin**: `admin` / `password`
- **Usuario**: `user` / `password`

### **Bases de Datos**
- **MySQL**: `movieuser` / `moviepass`
- **MongoDB**: `admin` / `password`

## 🛠️ **Stack Tecnológico**

### **Backend**
- **🐹 Go 1.21**: Servicios de alta performance
  - **Gin Framework**: Web framework minimalista
  - **MongoDB Driver**: Base de datos NoSQL
  - **BCrypt**: Hashing de contraseñas
  - **CORS**: Configuración cross-origin
- **☕ Java 17**: Servicios empresariales
  - **Spring Boot**: Framework robusto
  - **Spring Data MongoDB**: ORM NoSQL
  - **Validation**: Validación de datos

### **Frontend**
- **⚛️ React 18**: UI Library moderna
- **📘 TypeScript**: Tipado estático
- **⚡ Vite**: Build tool ultrarrápido
- **🎨 Tailwind CSS**: Utility-first CSS
- **📦 Zustand**: State management ligero
- **🏗️ React Hook Form**: Manejo de formularios
- **✅ Zod**: Validación de esquemas

### **Infrastructure**
- **🐳 Docker**: Containerización
- **🌐 Traefik**: API Gateway y Load Balancer
- **🗄️ MongoDB**: Base de datos NoSQL
- **🗄️ MySQL**: Base de datos relacional

## 🏗️ **Estructura del Proyecto**
```
Movie_Reservation_System_Alej-Rico/
├── backend/
│   ├── Microservicios/
│   │   ├── user-service-go/      # 🐹 Go - Autenticación
│   │   ├── movie-service-go/     # 🐹 Go - Catálogo
│   │   ├── showtime-service/     # ☕ Java - Horarios  
│   │   └── reservation-service/  # ☕ Java - Reservas
│   └── traefik/                  # 🌐 API Gateway
├── frontend/
│   └── movie-reservation-app/    # ⚛️ React + Vite
├── docker-compose.yml            # Backend services
├── start-backend.bat/.sh         # Scripts de inicio
└── start-frontend.bat           # Script frontend
```

## 🎯 **Características Principales**

### **✅ Sistema Completo**
- **🔐 Autenticación JWT** (Go)
- **🎬 Catálogo de Películas** (Go + MongoDB)
- **⏰ Gestión de Horarios** (Java + MongoDB)  
- **🪑 Sistema de Reservas Avanzado** (Java + MongoDB)
- **📱 Frontend Responsivo** (React + TypeScript)
- **🌐 API Gateway** (Traefik)

### **🚀 Mejoras Implementadas**
- **⚡ Hot Reload** para desarrollo máximo
- **🖼️ Imágenes Placeholder** locales (sin dependencias externas)
- **🌍 CORS configurado** para todos los servicios
- **💚 Health Checks** automáticos
- **🔄 Sistema Global de Reservas** - asientos persistentes entre usuarios
- **🎨 UI/UX Moderno** con Tailwind CSS
- **📊 Panel de Administración** funcional
- **🪑 Sincronización de Asientos** en tiempo real

### **🔧 Desarrollo**

1. **Backend**: Modificar servicios en `/backend/Microservicios/`
2. **Frontend**: Desarrollar en `/frontend/movie-reservation-app/src/`
3. **Rebuild**: `docker-compose build [servicio]` solo para backend
4. **Hot Reload**: Frontend se actualiza automáticamente

## 🐛 **Solución de Problemas**

### **Backend no inicia**
```bash
docker-compose down -v
docker system prune -f
docker-compose up -d --build
```

### **Frontend con errores**
```bash
cd frontend/movie-reservation-app
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### **Problemas de red/CORS**
```bash
# Verificar servicios
docker-compose ps

# Ver logs específicos
docker-compose logs [nombre-servicio]

# Reiniciar servicio específico
docker-compose restart [nombre-servicio]
```

## 📚 **Documentación Adicional**

- **API Docs**: http://localhost:8080 (Traefik Dashboard)
- **Logs**: `docker-compose logs -f`
- **Monitoreo**: Todos los servicios tienen health checks
- **Testing**: Frontend con Jest + Testing Library

## 🌟 **Próximas Características**

- **🔔 Notificaciones Push** 
- **💳 Gateway de Pago Real**
- **📧 Confirmaciones por Email**
- **📱 App Mobile** (React Native)
- **🤖 Chatbot de Soporte**

---

**Desarrollado por Alej & Rico** 🚀  
*Arquitectura híbrida Go + Java para máxima performance y escalabilidad*