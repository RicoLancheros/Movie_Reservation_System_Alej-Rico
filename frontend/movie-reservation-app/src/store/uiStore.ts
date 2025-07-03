import { create } from 'zustand';
import type { ToastType, ToastProps } from '../components/ui/Toast';

interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface UIState {
  authModalOpen: boolean;
  authModalTab: 'login' | 'register';
  toasts: ToastMessage[];
  isLoading: boolean;
  loadingMessage: string;
}

interface UIActions {
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  setAuthModalTab: (tab: 'login' | 'register') => void;
  
  // Toast actions
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // Utility toast methods
  showSuccess: (title: string, message?: string, duration?: number) => void;
  showError: (title: string, message?: string, duration?: number) => void;
  showWarning: (title: string, message?: string, duration?: number) => void;
  showInfo: (title: string, message?: string, duration?: number) => void;
  
  // Loading actions
  setLoading: (isLoading: boolean, message?: string) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set, get) => ({
  // State
  authModalOpen: false,
  authModalTab: 'login',
  toasts: [],
  isLoading: false,
  loadingMessage: '',

  // Actions
  openAuthModal: (tab = 'login') => set({ 
    authModalOpen: true, 
    authModalTab: tab 
  }),
  
  closeAuthModal: () => set({ authModalOpen: false }),
  
  setAuthModalTab: (tab) => set({ authModalTab: tab }),

  // Toast actions
  addToast: (toast) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    set((state) => ({
      toasts: [...state.toasts, newToast]
    }));
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter(toast => toast.id !== id)
    }));
  },

  clearToasts: () => {
    set({ toasts: [] });
  },

  // Utility methods
  showSuccess: (title, message, duration = 5000) => {
    get().addToast({ type: 'success', title, message, duration });
  },

  showError: (title, message, duration = 7000) => {
    get().addToast({ type: 'error', title, message, duration });
  },

  showWarning: (title, message, duration = 6000) => {
    get().addToast({ type: 'warning', title, message, duration });
  },

  showInfo: (title, message, duration = 5000) => {
    get().addToast({ type: 'info', title, message, duration });
  },

  // Loading actions
  setLoading: (isLoading, message = 'Cargando...') => {
    set({ isLoading, loadingMessage: message });
  },
}));

// Hook personalizado para mostrar notificaciones comunes del sistema
export const useNotifications = () => {
  const { showSuccess, showError, showWarning, showInfo } = useUIStore();

  return {
    // Success notifications
    notifySuccess: (message: string) => showSuccess('¡Éxito!', message),
    notifyReservationSuccess: () => showSuccess('¡Reserva confirmada!', 'Tu reserva se ha procesado exitosamente'),
    notifyLoginSuccess: (username: string) => showSuccess('¡Bienvenido!', `Hola, ${username}`),
    notifyLogoutSuccess: () => showSuccess('Sesión cerrada', 'Has cerrado sesión exitosamente'),
    
    // Error notifications
    notifyError: (message: string) => showError('Error', message),
    notifyNetworkError: () => showError('Error de conexión', 'No se pudo conectar con el servidor. Verifica tu conexión.'),
    notifyValidationError: (field: string) => showError('Error de validación', `El campo "${field}" es requerido o inválido`),
    notifyAuthError: () => showError('Error de autenticación', 'Credenciales inválidas. Por favor, verifica tu usuario y contraseña.'),
    
    // Warning notifications
    notifyWarning: (message: string) => showWarning('Atención', message),
    notifySeatsUnavailable: () => showWarning('Asientos no disponibles', 'Algunos asientos seleccionados ya no están disponibles'),
    notifyMaxSeatsReached: () => showWarning('Límite alcanzado', 'Máximo 8 asientos por reserva'),
    
    // Info notifications
    notifyInfo: (message: string) => showInfo('Información', message),
    notifyFeatureComingSoon: () => showInfo('Próximamente', 'Esta funcionalidad estará disponible pronto'),
    notifySavingChanges: () => showInfo('Guardando cambios', 'Los cambios se están guardando...'),
  };
}; 