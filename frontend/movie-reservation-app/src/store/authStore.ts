import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

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
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  isAdmin: () => boolean;
}

type AuthStore = AuthState & AuthActions;

// Mock users for demonstration
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@cinereserva.com',
    firstName: 'Admin',
    lastName: 'User',
    roles: [{ id: '1', name: 'ROLE_ADMIN' as const }]
  },
  {
    id: '2',
    username: 'user',
    email: 'user@example.com',
    firstName: 'Regular',
    lastName: 'User',
    roles: [{ id: '2', name: 'ROLE_USER' as const }]
  }
];

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
          // Check if user exists (for demo, any username with min 3 chars and password with min 6 chars)
          if (credentials.username.length < 3) {
            throw new Error('Usuario debe tener al menos 3 caracteres');
          }
          if (credentials.password.length < 6) {
            throw new Error('Contraseña debe tener al menos 6 caracteres');
          }

          // Find user or create a default one
          let user = mockUsers.find(u => u.username === credentials.username);
          
          if (!user) {
            // Create a new user for demo
            user = {
              id: Date.now().toString(),
              username: credentials.username,
              email: `${credentials.username}@example.com`,
              firstName: credentials.username,
              lastName: 'Demo',
              roles: [{ id: '2', name: 'ROLE_USER' as const }]
            };
          }

          const token = `demo-token-${Date.now()}`;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Login failed',
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
          // Basic validation
          if (userData.username.length < 3) {
            throw new Error('Usuario debe tener al menos 3 caracteres');
          }
          if (userData.password.length < 6) {
            throw new Error('Contraseña debe tener al menos 6 caracteres');
          }
          if (!userData.email.includes('@')) {
            throw new Error('Email inválido');
          }

          // Check if user already exists
          const existingUser = mockUsers.find(u => u.username === userData.username);
          if (existingUser) {
            throw new Error('El usuario ya existe');
          }

          // Create new user
          const newUser: User = {
            id: Date.now().toString(),
            username: userData.username,
            email: userData.email,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            roles: [{ id: '2', name: 'ROLE_USER' as const }]
          };

          const token = `demo-token-${Date.now()}`;
          
          set({
            user: newUser,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Registration failed',
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