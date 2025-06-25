# Movie Reservation System - CineReserva 🎬

**Versión Actual: V0.0.3 - Sistema de Reservas Frontend Completo**

Sistema integral de gestión de reservas de películas desarrollado con arquitectura de microservicios. Incluye backend en Spring Boot y frontend moderno en React con TypeScript.

[![Version](https://img.shields.io/badge/version-0.0.3-blue.svg)](https://github.com/tu-usuario/movie-reservation-system)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.0+-6DB33F?logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Manual de Usuario](#-manual-de-usuario)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Versionado](#-historial-de-versiones)
- [Contribuir](#-contribuir)

## ✨ Características

### Frontend React
- 🎬 **Catálogo de Películas** - Navegación intuitiva con filtros avanzados
- 🛡️ **Sistema de Autenticación** - Login seguro con roles de usuario y administrador
- 🪑 **Selección de Asientos Interactiva** - Mapa visual de sala de cine
- 💳 **Proceso de Pago Simulado** - Formulario completo con validaciones
- 📱 **Diseño Responsivo** - Optimizado para móviles y desktop
- ⚡ **Interfaz Moderna** - UI/UX con Tailwind CSS
- 🔄 **Gestión de Estado** - Zustand para estado global
- 💾 **Persistencia Local** - LocalStorage para datos temporales

### Backend Microservicios
- 🏗️ **Arquitectura de Microservicios** - Servicios independientes y escalables
- 🔐 **Spring Security** - Autenticación y autorización robusta
- 🗄️ **Bases de Datos Múltiples** - MySQL y MongoDB
- 🐳 **Dockerización** - Contenedores para fácil despliegue
- 🚪 **API Gateway** - Traefik como proxy reverso

## 🛠 Tecnologías

### Frontend
- **React 18** - Biblioteca de UI moderna
- **TypeScript** - Tipado estático para mejor desarrollo
- **Tailwind CSS** - Framework de CSS utilitario
- **Zustand** - Gestión de estado minimalista
- **React Router** - Navegación SPA
- **Lucide React** - Iconografía moderna
- **Vite** - Build tool ultrarrápido

### Backend
- **Spring Boot 3.0+** - Framework de aplicaciones Java
- **Spring Security** - Seguridad y autenticación
- **Spring Data JPA** - Abstracción de base de datos
- **MySQL** - Base de datos relacional
- **MongoDB** - Base de datos NoSQL
- **Docker** - Contenedorización
- **Traefik** - Proxy reverso y load balancer

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

### 2. Configurar Backend
```bash
# Iniciar servicios con Docker
docker-compose up -d

# Verificar que los servicios estén corriendo
docker-compose ps
```

### 3. Configurar Frontend
```bash
cd frontend/movie-reservation-app

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### 4. Acceder a la Aplicación
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8080

## 📖 Manual de Usuario

### 🚪 Acceso al Sistema

La aplicación cuenta con dos tipos de usuarios predefinidos:

#### 👨‍💼 Usuario Administrador
- **Usuario**: `admin`
- **Contraseña**: `password123`
- **Permisos**: Gestión completa de películas, visualización de reservas

#### 👤 Usuario Regular
- **Usuario**: `user`
- **Contraseña**: `password123`
- **Permisos**: Navegación, reserva de asientos

### 🎬 Gestión de Películas (Solo Administradores)

#### Agregar Nueva Película
1. Inicia sesión como administrador
2. Ve al **Panel de Administración** desde el menú
3. Haz clic en **"Agregar Película"**
4. Completa el formulario:
   - **Título**: Nombre de la película
   - **Descripción**: Sinopsis detallada
   - **Género**: Selecciona de la lista predefinida
   - **Duración**: En minutos
   - **Rating**: Clasificación (G, PG, PG-13, R, NC-17)
   - **Director**: Nombre del director
   - **Reparto**: Actores separados por comas
   - **URL del Póster**: Enlace a imagen (opcional)
5. Haz clic en **"Crear Película"**

#### Editar Película Existente
1. En el Panel de Administración, localiza la película
2. Haz clic en el icono **✏️ Editar**
3. Modifica los campos necesarios
4. Haz clic en **"Actualizar Película"**

#### Eliminar Película
1. En el Panel de Administración, localiza la película
2. Haz clic en el icono **🗑️ Eliminar**
3. Confirma la eliminación

### 🎫 Proceso de Reserva (Usuarios Autenticados)

#### Paso 1: Explorar Catálogo
1. Navega por la página principal
2. Usa los **filtros por género** o la **barra de búsqueda**
3. Haz clic en **"Ver Detalles"** de la película deseada

#### Paso 2: Seleccionar Horario
1. En la página de detalles, revisa la información de la película
2. Selecciona una **fecha** (disponible hasta 7 días adelante)
3. Elige un **horario** de los disponibles
4. Observa el precio y disponibilidad de asientos
5. Haz clic en **"Seleccionar Asientos"**

> **💡 Precios Dinámicos**: Los precios varían según:
> - **Día de semana** vs **fin de semana** (+$3.000)
> - **Horarios prime** (20:00, 22:30) (+$2.000)

#### Paso 3: Elegir Asientos
1. Visualiza el **mapa de la sala** con la pantalla al frente
2. Haz clic en los asientos disponibles (verdes)
3. Los asientos seleccionados se marcan en azul
4. Revisa el **resumen de reserva** en el panel lateral
5. Haz clic en **"Continuar al Pago"**

> **🎯 Tipos de Asientos**:
> - 🟢 **Verde**: Disponible
> - 🔴 **Rojo**: Ocupado
> - 🔵 **Azul**: Seleccionado
> - 🟣 **Morado**: Accesible (para personas con discapacidad)

#### Paso 4: Realizar Pago
1. Completa la **información personal**:
   - Nombre completo
   - Email (para recibir confirmación)
   - Teléfono de contacto

2. Ingresa los **datos de la tarjeta**:
   - Número de tarjeta (16 dígitos)
   - Fecha de expiración (MM/AA)
   - Código CVV (3-4 dígitos)

3. Revisa el **resumen de compra**
4. Haz clic en **"Completar Pago"**

> **🔒 Seguridad**: Todos los datos están protegidos y el pago es simulado

#### Paso 5: Confirmación
1. Espera el procesamiento (3 segundos)
2. Recibe tu **ticket digital**
3. Guarda o imprime la confirmación

### 🔍 Navegación y Filtros

#### Búsqueda de Películas
- **Búsqueda por título**: Escribe en la barra de búsqueda
- **Filtro por género**: Haz clic en los botones de género
- **Limpiar filtros**: Botón para mostrar todas las películas

#### Estados de Disponibilidad
- 🟢 **Disponible**: Más del 50% de asientos libres
- 🟡 **Pocas entradas**: 20-50% de asientos libres
- 🔴 **Últimas entradas**: Menos del 20% de asientos libres

### ⚠️ Limitaciones y Consideraciones

- **Máximo 8 asientos** por reserva
- **Tiempo límite**: 15 minutos para completar la reserva
- **Horarios**: Generados dinámicamente para 7 días
- **Persistencia**: Los datos se almacenan localmente (no permanentes)
- **Pagos**: Simulados para propósitos de demostración

## 🏗 Arquitectura del Sistema

### Microservicios Backend
```
backend/
├── user-service/          # Gestión de usuarios y autenticación
├── movie-service/         # Catálogo de películas
├── showtime-service/      # Horarios y funciones
├── reservation-service/   # Reservas y asientos
└── traefik/              # API Gateway
```

### Estructura Frontend
```
frontend/movie-reservation-app/
├── src/
│   ├── components/        # Componentes reutilizables
│   ├── pages/            # Páginas de la aplicación
│   ├── store/            # Gestión de estado (Zustand)
│   ├── types/            # Definiciones de TypeScript
│   └── utils/            # Utilidades
└── public/               # Archivos estáticos
```

## 📚 Historial de Versiones

### V0.0.3 - Sistema de Reservas Frontend Completo ✨
**Fecha**: Diciembre 2024
- ✅ Frontend React completo con TypeScript
- ✅ Sistema de autenticación con roles
- ✅ Panel de administración para gestión de películas
- ✅ Catálogo con filtros y búsqueda
- ✅ Selección de asientos interactiva
- ✅ Proceso de pago simulado
- ✅ Horarios dinámicos con precios variables
- ✅ Diseño responsivo con Tailwind CSS

### V0.0.2 - Configuración Backend y Base de Datos
**Fecha**: Noviembre 2024
- ✅ Configuración de bases de datos MySQL y MongoDB
- ✅ Entidades User y Role definidas
- ✅ Repositorios JPA implementados
- ✅ UserService y UserController
- ✅ Spring Security básico
- ✅ Modularización de microservicios

### V0.0.1 - Estructura Base del Proyecto
**Fecha**: Octubre 2024
- ✅ Estructura inicial del proyecto
- ✅ Configuración Docker Compose
- ✅ Servicios Spring Boot creados
- ✅ Configuración Traefik
- ✅ Bases de datos containerizadas

## 🚀 Próximas Funcionalidades

- 📧 **Sistema de Notificaciones** - Emails de confirmación
- 👤 **Perfil de Usuario** - Historial de reservas
- 📊 **Dashboard de Reportes** - Analytics para administradores
- 🔗 **Integración Backend-Frontend** - API REST completa
- 💾 **Base de Datos Persistente** - Migración desde localStorage
- 🎯 **Sistema de Descuentos** - Promociones y códigos

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
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