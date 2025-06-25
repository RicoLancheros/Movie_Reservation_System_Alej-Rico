# CineReserva - Frontend 🎬

## Descripción

Frontend para el sistema de reservas de películas **CineReserva**. Una aplicación web moderna construida con React, TypeScript y Tailwind CSS que permite a los usuarios ver películas, seleccionar horarios, reservar asientos y realizar pagos simulados.

## 🚀 Características Implementadas

### ✅ **Funcionalidades Actuales**

- **🏠 Página Principal**: Catálogo de películas con filtros por género y búsqueda
- **🎬 Detalles de Película**: Información completa + selección de horarios
- **🔐 Autenticación Simulada**: Login/registro con validación
- **📱 Interfaz Responsive**: Diseño moderno y adaptable
- **🎨 Selector de Asientos**: Diseño basado en tu imagen de referencia
- **👤 Gestión de Usuario**: Sistema de roles (User/Admin)

### 🚧 **En Desarrollo**

- **🪑 Selección de Asientos Completa**: Funcionalidad interactiva
- **💳 Proceso de Pago**: Simulación de transacciones
- **🎫 Confirmación de Reservas**: Tickets digitales
- **👥 Perfil de Usuario**: Gestión de datos y reservas
- **⚙️ Panel Admin**: CRUD de películas y reportes

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📦 Instalación y Uso

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Instalación
```bash
# Navegar al directorio del frontend
cd frontend/movie-reservation-app

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:5173
```

## 🔐 Autenticación de Demo

Para probar la aplicación, puedes usar estas credenciales o crear tu propio usuario:

### Usuarios Predefinidos:
- **Admin**: `admin` / `password123`
- **Usuario Regular**: `user` / `password123`

### Crear Nuevo Usuario:
- Cualquier username (min 3 caracteres)
- Cualquier email válido
- Cualquier contraseña (min 6 caracteres)

## 🎯 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes base (Button, Input, Modal)
│   ├── AuthModal.tsx   # Modal de autenticación
│   ├── Navbar.tsx      # Barra de navegación
│   └── SeatSelector.tsx # Selector de asientos
├── pages/              # Páginas de la aplicación
│   ├── HomePage.tsx    # Catálogo de películas
│   ├── MovieDetailPage.tsx
│   ├── SeatSelectionPage.tsx
│   ├── PaymentPage.tsx
│   ├── ConfirmationPage.tsx
│   ├── ProfilePage.tsx
│   └── AdminDashboard.tsx
├── store/              # Estado global (Zustand)
│   ├── authStore.ts    # Autenticación
│   ├── movieStore.ts   # Películas
│   ├── reservationStore.ts # Reservas
│   └── uiStore.ts      # UI state
├── types/              # Definiciones TypeScript
│   └── index.ts
└── utils/              # Utilidades
    └── cn.ts           # Class name utility
```

## 🎨 Diseño y Estilo

- **Paleta de Colores**: Azul primario con acentos de cine (dorado, rojo, verde)
- **Tipografía**: Inter font family
- **Iconografía**: Lucide React icons
- **Responsive**: Mobile-first design

## 🔄 Estado de Desarrollo

### Versión Actual: v0.1.0

**✅ Completado:**
- Estructura base del proyecto
- Sistema de autenticación simulada
- Navegación y rutas
- Página principal con catálogo
- Detalles de película
- Componentes UI base

**🚧 Próximos Pasos:**
1. Implementar selector de asientos funcional
2. Crear proceso de pago simulado
3. Desarrollar perfil de usuario
4. Panel de administración
5. Conectar con backend real

## 🤝 Integración con Backend

Una vez que el backend esté completo, se reemplazarán:
- Mock data por llamadas a API reales
- Autenticación simulada por JWT real
- URLs de fetch por endpoints del backend

## 📝 Notas de Desarrollo

- **Datos Mock**: Actualmente usa datos simulados para desarrollo
- **Autenticación**: Sistema de demo que simula login/registro
- **Responsive**: Optimizado para móviles y desktop
- **Accesibilidad**: Preparado para WCAG compliance

## 🎯 Funcionalidades del Selector de Asientos

Basado en tu imagen de referencia:
- ✅ **Pantalla**: Indicador visual en la parte superior
- ✅ **Filas**: Etiquetadas A-H con números laterales
- ✅ **Estados**: Disponible, ocupado, seleccionado, discapacitado
- ✅ **Accesibilidad**: Asientos especiales con ícono
- ✅ **Leyenda**: Estados claramente identificados
- ✅ **Resumen**: Lista de asientos seleccionados

---

**¡El frontend está listo para continuar el desarrollo! 🚀**
