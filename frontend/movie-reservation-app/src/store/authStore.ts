import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginRequest, RegisterRequest } from '../types';

// Definiendo AuthResponse aquí para evitar problemas de importación
interface AuthResponse {
  token: string;
  user: User;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: { username: string; password: string }) => Promise<void>;
  register: (userData: { username: string; email: string; password: string; firstName?: string; lastName?: string }) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  isAdmin: () => boolean;
}

type AuthStore = AuthState & AuthActions;

// Base de datos mock de usuarios con contraseñas específicas
const mockUsersDatabase = [
  {
    username: 'admin',
    password: 'admin123', // Contraseña específica para admin
    user: {
      id: '1',
      username: 'admin',
      email: 'admin@cinereserva.com',
      firstName: 'Administrador',
      lastName: 'Sistema',
      phone: '+57 301 234 5678',
      birthDate: '1985-05-15',
      preferences: {
        notifications: true,
        language: 'es' as const,
        favoriteGenres: ['Acción', 'Sci-Fi', 'Thriller']
      },
      roles: [
        { id: '1', name: 'ROLE_ADMIN' as const },
        { id: '2', name: 'ROLE_USER' as const }
      ]
    }
  },
  {
    username: 'usuario',
    password: 'usuario123', // Contraseña específica para usuario normal
    user: {
      id: '2',
      username: 'usuario',
      email: 'usuario@email.com',
      firstName: 'Juan',
      lastName: 'Pérez',
      phone: '+57 310 987 6543',
      birthDate: '1992-08-20',
      preferences: {
        notifications: true,
        language: 'es' as const,
        favoriteGenres: ['Drama', 'Romance', 'Comedia']
      },
      roles: [{ id: '2', name: 'ROLE_USER' as const }]
    }
  },
  {
    username: 'maria.garcia',
    password: 'maria2024', // Usuario adicional
    user: {
      id: '3',
      username: 'maria.garcia',
      email: 'maria.garcia@email.com',
      firstName: 'María',
      lastName: 'García',
      phone: '+57 320 456 7890',
      birthDate: '1990-03-22',
      preferences: {
        notifications: true,
        language: 'es' as const,
        favoriteGenres: ['Comedia', 'Drama', 'Musical']
      },
      roles: [{ id: '2', name: 'ROLE_USER' as const }]
    }
  },
  {
    username: 'carlos.rodriguez',
    password: 'carlos456', // Usuario adicional
    user: {
      id: '4',
      username: 'carlos.rodriguez',
      email: 'carlos.rodriguez@email.com',
      firstName: 'Carlos',
      lastName: 'Rodríguez',
      phone: '+57 315 123 4567',
      birthDate: '1988-11-10',
      preferences: {
        notifications: false,
        language: 'es' as const,
        favoriteGenres: ['Acción', 'Aventura', 'Sci-Fi']
      },
      roles: [{ id: '2', name: 'ROLE_USER' as const }]
    }
  }
];

// Lista de usuarios públicos (sin contraseñas para mostrar en UI)
const mockUsers = mockUsersDatabase.map(entry => entry.user);

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          // Validaciones básicas
          if (!credentials.username || credentials.username.trim().length < 3) {
            throw new Error('Usuario debe tener al menos 3 caracteres');
          }
          if (!credentials.password || credentials.password.length < 6) {
            throw new Error('Contraseña debe tener al menos 6 caracteres');
          }

          // Buscar usuario en la base de datos mock
          const userEntry = mockUsersDatabase.find(entry => 
            entry.username === credentials.username.trim()
          );
          
          if (!userEntry) {
            throw new Error('Usuario no encontrado. Usuarios disponibles: admin, usuario, maria.garcia, carlos.rodriguez');
          }

          // Verificar contraseña
          if (userEntry.password !== credentials.password) {
            throw new Error('Contraseña incorrecta');
          }

          const token = `auth-token-${Date.now()}-${userEntry.user.id}`;
          
          set({
            user: userEntry.user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          console.log(`✅ Login exitoso para ${userEntry.user.firstName} ${userEntry.user.lastName}`);
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error de autenticación',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
          // Validaciones mejoradas
          if (!userData.username || userData.username.trim().length < 3) {
            throw new Error('Usuario debe tener al menos 3 caracteres');
          }
          if (!userData.password || userData.password.length < 6) {
            throw new Error('Contraseña debe tener al menos 6 caracteres');
          }
          if (!userData.email || !userData.email.includes('@') || !userData.email.includes('.')) {
            throw new Error('Email inválido');
          }

          // Check if username already exists
          const existingUser = mockUsersDatabase.find(entry => 
            entry.username === userData.username.trim()
          );
          if (existingUser) {
            throw new Error('El usuario ya existe. Prueba con otro nombre de usuario.');
          }

          // Check if email already exists
          const existingEmail = mockUsersDatabase.find(entry => 
            entry.user.email === userData.email.trim()
          );
          if (existingEmail) {
            throw new Error('El email ya está registrado. Prueba con otro email.');
          }

          // Create new user
          const newUser: User = {
            id: Date.now().toString(),
            username: userData.username.trim(),
            email: userData.email.trim(),
            firstName: userData.firstName?.trim() || 'Usuario',
            lastName: userData.lastName?.trim() || 'Nuevo',
            phone: '',
            birthDate: '',
            preferences: {
              notifications: true,
              language: 'es' as const,
              favoriteGenres: []
            },
            roles: [{ id: '2', name: 'ROLE_USER' as const }]
          };

          // Add to mock database (in real app this would be sent to server)
          const newEntry = {
            username: newUser.username,
            password: userData.password,
            user: newUser
          };
          mockUsersDatabase.push(newEntry);

          const token = `auth-token-${Date.now()}-${newUser.id}`;
          
          set({
            user: newUser,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          console.log(`✅ Registro exitoso para ${newUser.firstName} ${newUser.lastName}`);
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error en el registro',
            isLoading: false,
          });
          throw error;
        }
      },

      updateUser: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const { user } = get();
          if (!user) {
            throw new Error('No hay usuario autenticado');
          }

          // Validar email si se está actualizando
          if (userData.email && (!userData.email.includes('@') || !userData.email.includes('.'))) {
            throw new Error('Email inválido');
          }

          // Merge the updated data
          const updatedUser: User = {
            ...user,
            ...userData,
            preferences: {
              ...user.preferences,
              ...userData.preferences
            }
          };

          // Update in mock database too
          const userEntry = mockUsersDatabase.find(entry => entry.user.id === user.id);
          if (userEntry) {
            userEntry.user = updatedUser;
          }

          set({
            user: updatedUser,
            isLoading: false,
          });

          console.log('✅ Perfil actualizado exitosamente');
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al actualizar perfil',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        // Limpiar reservas globales del store al hacer logout
        const reservationStore = JSON.parse(localStorage.getItem('reservation-store') || '{}');
        if (reservationStore.state) {
          reservationStore.state.reservations = [];
          reservationStore.state.selectedSeats = [];
          reservationStore.state.totalPrice = 0;
          reservationStore.state.currentShowtimeId = null;
          localStorage.setItem('reservation-store', JSON.stringify(reservationStore));
        }
        
        set({ 
          user: null, 
          isAuthenticated: false, 
          error: null 
        });
        console.log('👋 Usuario desconectado y reservas limpiadas');
      },

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token, isAuthenticated: !!token }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      isAdmin: () => {
        const { user } = get();
        return user?.roles.some(role => role.name === 'ROLE_ADMIN') || false;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 