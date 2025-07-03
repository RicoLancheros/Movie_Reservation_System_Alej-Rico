import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { useAuthStore } from '../store/authStore';
import { useNotifications } from '../store/uiStore';
import { Mail, Lock, User } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const registerSchema = z.object({
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const { login, register: registerUser, isLoading, clearError } = useAuthStore();
  const { notifyLoginSuccess, notifyAuthError, notifySuccess, notifyError } = useNotifications();

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const handleLogin = async (data: LoginForm) => {
    try {
      const result = await login(data);
      if (result?.user) {
        notifyLoginSuccess(result.user.username);
        onClose();
        loginForm.reset();
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('credenciales') || error.message.includes('inválido')) {
          notifyAuthError();
        } else {
          notifyError(error.message);
        }
      } else {
        notifyAuthError();
      }
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    try {
      const { confirmPassword, ...registerData } = data;
      const result = await registerUser(registerData);
      if (result?.user) {
        notifySuccess(`¡Bienvenido ${result.user.username}!`, 'Tu cuenta se ha creado exitosamente');
        onClose();
        registerForm.reset();
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('existe') || error.message.includes('duplicado')) {
          notifyError('Error de registro', 'El usuario o email ya existe');
        } else if (error.message.includes('email')) {
          notifyError('Email inválido', 'Por favor verifica el formato del email');
        } else {
          notifyError(error.message);
        }
      } else {
        notifyError('Error al crear cuenta', 'Ocurrió un error inesperado');
      }
    }
  };

  const handleClose = () => {
    onClose();
    clearError();
    loginForm.reset();
    registerForm.reset();
  };

  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose}
      size="md"
    >
      <div className="w-full max-w-md mx-auto">
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button
            className={`flex-1 py-2 text-center font-medium transition-colors ${
              activeTab === 'login'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('login')}
          >
            Iniciar Sesión
          </button>
          <button
            className={`flex-1 py-2 text-center font-medium transition-colors ${
              activeTab === 'register'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('register')}
          >
            Registrarse
          </button>
        </div>

        {/* Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
            <Input
              label="Usuario"
              icon={<User />}
              {...loginForm.register('username')}
              error={loginForm.formState.errors.username?.message}
            />
            
            <Input
              label="Contraseña"
              type="password"
              icon={<Lock />}
              {...loginForm.register('password')}
              error={loginForm.formState.errors.password?.message}
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Iniciar Sesión
            </Button>
          </form>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nombre"
                {...registerForm.register('firstName')}
                error={registerForm.formState.errors.firstName?.message}
              />
              <Input
                label="Apellido"
                {...registerForm.register('lastName')}
                error={registerForm.formState.errors.lastName?.message}
              />
            </div>

            <Input
              label="Usuario"
              icon={<User />}
              {...registerForm.register('username')}
              error={registerForm.formState.errors.username?.message}
            />

            <Input
              label="Email"
              type="email"
              icon={<Mail />}
              {...registerForm.register('email')}
              error={registerForm.formState.errors.email?.message}
            />

            <Input
              label="Contraseña"
              type="password"
              icon={<Lock />}
              {...registerForm.register('password')}
              error={registerForm.formState.errors.password?.message}
            />

            <Input
              label="Confirmar Contraseña"
              type="password"
              icon={<Lock />}
              {...registerForm.register('confirmPassword')}
              error={registerForm.formState.errors.confirmPassword?.message}
            />

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              Registrarse
            </Button>
          </form>
        )}

        {/* Testing Credentials */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="text-blue-800 text-sm">
            <strong className="block mb-2">🔑 Usuarios de Prueba Disponibles:</strong>
            <div className="space-y-1 text-xs font-mono">
              <div className="flex justify-between">
                <span>Usuario: <strong>admin</strong></span>
                <span>Contraseña: <strong>password</strong></span>
              </div>
              <div className="flex justify-between">
                <span>Usuario: <strong>user</strong></span>
                <span>Contraseña: <strong>password</strong></span>
              </div>
            </div>
            <p className="text-xs mt-2 text-blue-600">
              💡 Usa estas credenciales para probar el sistema
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// Global Auth Modal Controller
export function AuthModalController() {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState<'login' | 'register'>('login');

  // You can expose methods to open the modal from anywhere
  // For now, we'll use the navbar buttons directly
  
  return (
    <AuthModal 
      isOpen={isOpen} 
      onClose={() => setIsOpen(false)}
      defaultTab={defaultTab}
    />
  );
} 