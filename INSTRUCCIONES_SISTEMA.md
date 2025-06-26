# 🎬 Sistema de Reservas de Películas - Instrucciones

## 📁 Archivos de Control del Sistema

Este proyecto incluye varios archivos `.bat` para facilitar la gestión del sistema completo:

### 🚀 **IniciarSistemaCompleto.bat** (RECOMENDADO)
**¿Qué hace?**
- Verifica que Docker y Node.js estén instalados
- Inicia las bases de datos con Docker Compose
- Inicia los 4 microservicios Java en terminales separadas
- Inicia el frontend React
- Proporciona todas las URLs importantes

**¿Cuándo usarlo?**
- Para iniciar todo el sistema desde cero
- Primera vez que uses el proyecto
- Cuando quieras tener todo funcionando rápidamente

---

### 🔨 **ConstruirMicroServicios.bat**
**¿Qué hace?**
- Compila los 4 microservicios Java
- Verifica que no haya errores de compilación
- Genera los archivos JAR necesarios

**¿Cuándo usarlo?**
- Después de hacer cambios en el código Java
- Antes de iniciar los servicios por primera vez
- Si hay errores de compilación

---

### 🎯 **IniciarMicroServicios.bat**
**¿Qué hace?**
- Inicia solo los 4 microservicios backend
- Abre una terminal separada para cada servicio
- No incluye frontend ni bases de datos

**¿Cuándo usarlo?**
- Si solo quieres probar el backend
- Si ya tienes las bases de datos corriendo
- Para desarrollo específico de microservicios

---

### 🛑 **DetenerSistema.bat**
**¿Qué hace?**
- Cierra todos los procesos Java (microservicios)
- Cierra el frontend React
- Detiene las bases de datos Docker
- Libera todos los puertos
- Cierra las terminales abiertas

**¿Cuándo usarlo?**
- Para detener completamente el sistema
- Si los puertos quedan ocupados
- Antes de cerrar tu PC

---

## 🔧 Requisitos Previos

Antes de usar estos archivos, asegúrate de tener instalado:

- ✅ **Java 17 o superior**
- ✅ **Node.js 16 o superior**
- ✅ **Docker Desktop** (para las bases de datos)
- ✅ **Git** (para clonar el proyecto)

## 📋 Instrucciones de Uso

### 🎯 Para usar por primera vez:

1. **Clona el proyecto** en tu PC
2. **Abre Docker Desktop** y asegúrate que esté ejecutándose
3. **Haz doble clic** en `IniciarSistemaCompleto.bat`
4. **Espera 2-3 minutos** a que todo se inicie
5. **Ve a** http://localhost:5173/test-services
6. **Haz clic** en "🚀 Probar Todos los Servicios"
7. **Si todo está verde**, ¡ya puedes usar el sistema!

### 🔄 Para uso diario:

**Iniciar:**
```
IniciarSistemaCompleto.bat
```

**Detener:**
```
DetenerSistema.bat
```

### 🐛 Si hay problemas de compilación:

```
ConstruirMicroServicios.bat
```

## 🌐 URLs Importantes

Una vez iniciado el sistema:

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend Principal** | http://localhost:5173 | Aplicación web principal |
| **Página de Testing** | http://localhost:5173/test-services | Para verificar servicios |
| **User Service** | http://localhost:8081/actuator/health | API de usuarios |
| **Movie Service** | http://localhost:8082/actuator/health | API de películas |
| **Showtime Service** | http://localhost:8083/actuator/health | API de funciones |
| **Reservation Service** | http://localhost:8084/actuator/health | API de reservas |

## 🎮 Funcionalidades del Sistema

### 👤 Para Usuarios:
- ✅ Ver catálogo de películas
- ✅ Ver funciones disponibles
- ✅ Registro e inicio de sesión
- ✅ Navegación intuitiva

### ⚙️ Para Administradores:
- ✅ Crear/editar/eliminar películas
- ✅ Crear/editar/eliminar funciones
- ✅ Precios automáticos por sala:
  - **VIP:** $30,000 COP
  - **Estándar:** $15,000 COP
  - **IMAX:** $20,000 COP
  - **4DX:** $22,000 COP
- ✅ Dashboard con estadísticas

### 🔍 Para Testing:
- ✅ Verificación de estado de servicios
- ✅ Tests de conectividad
- ✅ Monitoreo de rendimiento

## 🚨 Solución de Problemas

### ❌ "Docker no está ejecutándose"
- Abre Docker Desktop
- Espera a que aparezca "Docker Desktop is running"
- Vuelve a ejecutar el archivo .bat

### ❌ "Error en puerto 8081/8082/8083/8084"
- Ejecuta `DetenerSistema.bat`
- Espera 30 segundos
- Vuelve a ejecutar `IniciarSistemaCompleto.bat`

### ❌ "Frontend no carga"
- Verifica que Node.js esté instalado: `node --version`
- Ve a la terminal del frontend y verifica errores
- Ejecuta `npm install` en `frontend/movie-reservation-app/`

### ❌ "Servicios no responden"
- Espera 2-3 minutos después del inicio
- Ve a http://localhost:5173/test-services
- Si siguen en rojo, revisa las terminales Java

## 📊 Arquitectura del Sistema

```
🌐 Frontend (React + TypeScript)
    ↓
🔀 Traefik (Proxy Reverso)
    ↓
🎯 Microservicios:
    🔵 User Service (MySQL)
    🟢 Movie Service (MongoDB)
    🟡 Showtime Service (MongoDB)
    🟠 Reservation Service (MongoDB)
```

## 💡 Consejos

- ✅ **Usa `IniciarSistemaCompleto.bat`** para la mayoría de casos
- ✅ **Siempre detén con `DetenerSistema.bat`** antes de cerrar tu PC
- ✅ **La página de testing** es tu mejor amiga para verificar que todo funciona
- ✅ **Espera 2-3 minutos** después del inicio antes de probar
- ✅ **Revisa las terminales Java** si algo no funciona

---

¡Disfruta desarrollando con tu sistema de reservas de películas! 🎬🍿 