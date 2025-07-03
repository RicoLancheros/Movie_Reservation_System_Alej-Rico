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

// URL base del User Service Go
const USER_SERVICE_URL = 'http://localhost:8081/api';

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
        
        try {
          // Validaciones básicas
          if (!credentials.username || credentials.username.trim().length < 3) {
            throw new Error('Usuario debe tener al menos 3 caracteres');
          }
          if (!credentials.password || credentials.password.length < 6) {
            throw new Error('Contraseña debe tener al menos 6 caracteres');
          }

          // Llamada al User Service Go
          const response = await fetch(`${USER_SERVICE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: credentials.username.trim(),
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Error de autenticación');
          }

          const data: AuthResponse = await response.json();
          
          // Convertir el formato del usuario del backend al formato del frontend
          const user: User = {
            id: data.user.id.toString(),
            username: data.user.username,
            email: data.user.email,
            firstName: data.user.firstName || '',
            lastName: data.user.lastName || '',
            phone: '',
            birthDate: '',
            preferences: {
              notifications: true,
              language: 'es' as const,
              favoriteGenres: []
            },
            roles: [{ id: '2', name: 'ROLE_USER' as const }] // Por defecto usuario normal
          };

          // Si el usuario es admin, agregar rol de admin
          if (data.user.username === 'admin') {
            user.roles = [
              { id: '1', name: 'ROLE_ADMIN' as const },
              { id: '2', name: 'ROLE_USER' as const }
            ];
          }
          
          set({
            user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });

          console.log(`✅ Login exitoso para ${user.firstName || user.username}`);
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
        
        try {
          // Validaciones básicas
          if (!userData.username || userData.username.trim().length < 3) {
            throw new Error('Usuario debe tener al menos 3 caracteres');
          }
          if (!userData.password || userData.password.length < 6) {
            throw new Error('Contraseña debe tener al menos 6 caracteres');
          }
          if (!userData.email || !userData.email.includes('@') || !userData.email.includes('.')) {
            throw new Error('Email inválido');
          }

          // Llamada al User Service Go
          const response = await fetch(`${USER_SERVICE_URL}/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: userData.username.trim(),
              email: userData.email.trim(),
              password: userData.password,
              firstName: userData.firstName?.trim() || null,
              lastName: userData.lastName?.trim() || null,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Error al registrar usuario');
          }

          const data: AuthResponse = await response.json();
          
          // Convertir el formato del usuario del backend al formato del frontend
          const user: User = {
            id: data.user.id.toString(),
            username: data.user.username,
            email: data.user.email,
            firstName: data.user.firstName || '',
            lastName: data.user.lastName || '',
            phone: '',
            birthDate: '',
            preferences: {
              notifications: true,
              language: 'es' as const,
              favoriteGenres: []
            },
            roles: [{ id: '2', name: 'ROLE_USER' as const }]
          };
          
          set({
            user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
          });

          console.log(`✅ Registro exitoso para ${user.firstName || user.username}`);
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al registrar usuario',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
        console.log('✅ Logout exitoso');
      },

      setUser: (user) => set({ user }),
      
      updateUser: async (userData) => {
        const { user, token } = get();
        if (!user || !token) {
          throw new Error('Usuario no autenticado');
        }

        set({ isLoading: true, error: null });
        
        try {
          // Por ahora, actualizar localmente (el backend no tiene endpoint de actualización implementado)
          const updatedUser = { ...user, ...userData };
          set({ user: updatedUser, isLoading: false });
          console.log('✅ Usuario actualizado localmente');
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Error al actualizar usuario',
            isLoading: false,
          });
          throw error;
        }
      },

      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
      
      isAdmin: () => {
        const { user } = get();
        return user?.roles?.some(role => role.name === 'ROLE_ADMIN') || false;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
); 