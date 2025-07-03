# 🎬 Sistema de Reservas de Películas - Instrucciones

## 📁 Archivos de Control del Sistema

Este proyecto utiliza una **arquitectura híbrida** con servicios Go + Java y incluye scripts `.bat` y `.sh` para facilitar la gestión del sistema completo:

### 🚀 **start.bat/.sh** (RECOMENDADO)
**¿Qué hace?**
- Verifica que Docker Desktop esté ejecutándose
- Inicia todos los servicios backend en Docker
- Construye y ejecuta microservicios híbridos Go + Java
- Inicia el frontend React con Vite
- Proporciona todas las URLs importantes

**¿Cuándo usarlo?**
- Para iniciar todo el sistema desde cero
- Primera vez que uses el proyecto
- Cuando quieras tener todo funcionando rápidamente

---

### 🔨 **start-backend.bat/.sh**
**¿Qué hace?**
- Inicia únicamente los servicios backend
- Construye imágenes Docker de servicios Go
- Levanta servicios Java con Spring Boot
- Configura bases de datos MongoDB y MySQL
- Configura API Gateway con Traefik

**¿Cuándo usarlo?**
- Si solo quieres desarrollar en el backend
- Si ya tienes el frontend ejecutándose
- Para debugging específico de microservicios

---

### 🎯 **start-frontend.bat**
**¿Qué hace?**
- Inicia únicamente el frontend React
- Ejecuta con Vite en modo desarrollo
- Habilita hot reload automático
- Verifica conexión con servicios backend

**¿Cuándo usarlo?**
- Si solo quieres desarrollar el frontend
- Si ya tienes el backend ejecutándose
- Para desarrollo rápido con hot reload

---

### 🛑 **stop.bat/.sh**
**¿Qué hace?**
- Detiene todos los contenedores Docker
- Cierra servicios backend y frontend
- Libera todos los puertos ocupados
- Limpia procesos en segundo plano

**¿Cuándo usarlo?**
- Para detener completamente el sistema
- Si los puertos quedan ocupados
- Antes de cerrar tu PC

---

## 🏗️ **Arquitectura del Sistema**

### **Backend Híbrido (Docker)**
```
🌐 Traefik API Gateway (Puerto 80/8080)
    ↓
🐹 Go Services:
    📥 User Service (Puerto 8081) - Autenticación JWT
    🎬 Movie Service (Puerto 8083) - Catálogo de películas
    ↓
☕ Java Services:
    ⏰ Showtime Service (Puerto 8084) - Gestión de horarios
    🎫 Reservation Service (Puerto 8082) - Sistema de reservas
    ↓
🗄️ Databases:
    📊 MySQL (Puerto 3307) - Datos relacionales
    🍃 MongoDB Cluster (Puertos 27018-27020) - Datos NoSQL
```

### **Frontend React (Local)**
```
⚛️ React 18 + TypeScript (Puerto 5174)
    📦 Zustand State Management
    🎨 Tailwind CSS
    ⚡ Vite Build Tool
```

---

## 🔧 **Requisitos Previos**

Antes de usar estos archivos, asegúrate de tener instalado:

- ✅ **Docker Desktop** (para backend en contenedores)
- ✅ **Node.js 18+** (para frontend React)
- ✅ **npm** (incluido con Node.js)
- ✅ **Git** (para clonar el proyecto)

**Opcional:**
- **Go 1.21+** (solo si quieres modificar servicios Go)
- **Java 17+** (solo si quieres modificar servicios Java)

---

## 📋 **Instrucciones de Uso**

### 🎯 **Para usar por primera vez:**

1. **Clona el proyecto** en tu PC
2. **Abre Docker Desktop** y asegúrate que esté ejecutándose
3. **Ejecuta el comando de inicio:**
   ```bash
   # Windows
   start.bat
   
   # Linux/Mac
   ./start.sh
   ```
4. **Espera 3-5 minutos** a que todo se inicie
5. **Ve a** http://localhost:5174
6. **Prueba el login** con:
   - **Admin**: `admin` / `password`
   - **Usuario**: `user` / `password`

### 🔄 **Para uso diario:**

**Iniciar sistema completo:**
```bash
start.bat     # Windows
./start.sh    # Linux/Mac
```

**Solo backend:**
```bash
start-backend.bat     # Windows
./start-backend.sh    # Linux/Mac
```

**Solo frontend:**
```bash
start-frontend.bat    # Windows
cd frontend/movie-reservation-app && npm run dev  # Linux/Mac
```

**Detener sistema:**
```bash
stop.bat      # Windows
./stop.sh     # Linux/Mac
```

---

## 🌐 **URLs del Sistema**

Una vez iniciado el sistema:

| Servicio | URL | Tecnología | Descripción |
|----------|-----|------------|-------------|
| **🎬 Frontend Principal** | http://localhost:5174 | React + Vite | Aplicación web principal |
| **🌐 API Gateway** | http://localhost:80 | Traefik | Proxy reverso |
| **📊 Traefik Dashboard** | http://localhost:8080 | Traefik | Monitor de servicios |
| **👤 User Service** | http://localhost:8081 | **Go + Gin** | API de autenticación |
| **🎭 Movie Service** | http://localhost:8083 | **Go + Gin** | API de películas |
| **⏰ Showtime Service** | http://localhost:8084 | Java + Spring | API de funciones |
| **🎫 Reservation Service** | http://localhost:8082 | Java + Spring | API de reservas |

---

## 🎮 **Funcionalidades del Sistema**

### 👤 **Para Usuarios:**
- ✅ Ver catálogo de películas con filtros
- ✅ Seleccionar horarios disponibles  
- ✅ **Sistema de asientos avanzado** (persistencia global)
- ✅ Proceso de pago simulado
- ✅ Historial de reservas
- ✅ Registro e inicio de sesión
- ✅ Perfil de usuario editable

### ⚙️ **Para Administradores:**
- ✅ **Panel de administración completo**
- ✅ CRUD de películas con imágenes
- ✅ CRUD de funciones/horarios
- ✅ **Precios automáticos por tipo de sala:**
  - **VIP:** $35,000 COP
  - **Estándar:** $25,000 COP
  - **IMAX:** $30,000 COP
  - **4DX:** $32,000 COP
- ✅ Estadísticas y métricas
- ✅ Gestión de salas y capacidades

### 🚀 **Características Técnicas:**
- ✅ **Arquitectura híbrida Go + Java**
- ✅ **Sistema global de reservas** - asientos sincronizados
- ✅ Hot reload en desarrollo
- ✅ CORS configurado para todos los servicios
- ✅ Health checks automáticos
- ✅ Imágenes placeholder locales
- ✅ State management con Zustand
- ✅ UI moderna con Tailwind CSS

---

## 🧪 **Pruebas del Sistema**

### **Verificar Servicios Backend:**
```bash
# User Service (Go)
curl http://localhost:8081/health

# Movie Service (Go)  
curl http://localhost:8083/api/movies

# Showtime Service (Java)
curl http://localhost:8084/actuator/health

# Reservation Service (Java)
curl http://localhost:8082/actuator/health
```

### **Credenciales de Prueba:**
- **👑 Admin**: `admin` / `password`
- **👤 Usuario**: `user` / `password`

---

## 🚨 **Solución de Problemas**

### ❌ **"Docker no está ejecutándose"**
```bash
# 1. Abre Docker Desktop
# 2. Espera a que aparezca "Docker Desktop is running"
# 3. Vuelve a ejecutar start.bat/start.sh
```

### ❌ **"Puertos ocupados (8081/8082/8083/8084)"**
```bash
# Detener todos los servicios
stop.bat        # Windows
./stop.sh       # Linux/Mac

# Esperar 30 segundos y reiniciar
start.bat       # Windows
./start.sh      # Linux/Mac
```

### ❌ **"Frontend no carga en localhost:5174"**
```bash
# Verificar Node.js
node --version

# Reinstalar dependencias
cd frontend/movie-reservation-app
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### ❌ **"Servicios backend no responden"**
```bash
# 1. Espera 3-5 minutos después del inicio
# 2. Verifica Docker containers:
docker ps

# 3. Ver logs específicos:
docker logs [container-name]

# 4. Si persiste, reconstruir:
docker-compose down -v
docker-compose up --build -d
```

### ❌ **"Error CORS en el frontend"**
```bash
# Los servicios Go ya tienen CORS configurado
# Si persiste, verifica que todos los servicios estén ejecutándose:
curl http://localhost:8081/health
curl http://localhost:8083/api/movies
```

---

## 📊 **Arquitectura Detallada**

```
┌─────────────────────────────────────────────────────────┐
│                    🎬 CINERESERVA                      │
├─────────────────────────────────────────────────────────┤
│  Frontend (React + TypeScript + Tailwind)              │
│  🌐 http://localhost:5174                               │
├─────────────────────────────────────────────────────────┤
│  🌐 Traefik API Gateway (Ports 80/8080)                │
├─────────────┬─────────────┬─────────────┬───────────────┤
│ 🐹 Go Services              │ ☕ Java Services         │
├─────────────┼─────────────┼─────────────┼───────────────┤
│ 👤 User     │ 🎬 Movie    │ ⏰ Showtime │ 🎫 Reservation│
│ Service     │ Service     │ Service     │ Service       │
│ Port 8081   │ Port 8083   │ Port 8084   │ Port 8082     │
│ (Auth JWT)  │ (Catalog)   │ (Schedule)  │ (Bookings)    │
├─────────────┴─────────────┼─────────────┴───────────────┤
│ 🗄️ MySQL (Port 3307)      │ 🍃 MongoDB Cluster         │
│ (User data)               │ (Movies, Showtimes, Reserv) │
│                           │ Ports 27018-27020          │
└───────────────────────────┴─────────────────────────────┘
```

---

## 💡 **Consejos de Desarrollo**

### **✅ Mejores Prácticas:**
- Usa `start.bat/start.sh` para iniciar todo el sistema
- **Siempre detén con `stop.bat/stop.sh`** antes de cerrar tu PC
- El frontend tiene **hot reload** - los cambios se reflejan automáticamente
- Para backend, reconstruye con `docker-compose build [service]`
- Los logs están disponibles con `docker logs [container]`

### **🔧 Desarrollo por Componente:**
- **Frontend solo**: `start-frontend.bat`
- **Backend solo**: `start-backend.bat/.sh`
- **Servicios específicos**: `docker-compose up [service-name]`

### **📊 Monitoring:**
- **Traefik Dashboard**: http://localhost:8080
- **Logs en tiempo real**: `docker-compose logs -f`
- **Estado de containers**: `docker ps`

---

## 🌟 **Próximas Características**

- 🔔 **Notificaciones Push**
- 💳 **Gateway de Pago Real** (Stripe/PayU)
- 📧 **Confirmaciones por Email**
- 📱 **App Mobile** (React Native)
- 🤖 **Chatbot de Soporte**
- 📈 **Analytics Avanzados**
- 🎯 **Sistema de Recomendaciones**

---

**¡Disfruta desarrollando con tu sistema híbrido de reservas de películas!** 🎬🍿

*Arquitectura Go + Java para máxima performance y escalabilidad* 🚀 