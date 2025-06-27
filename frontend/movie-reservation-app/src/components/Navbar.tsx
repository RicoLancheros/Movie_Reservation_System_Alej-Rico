import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, User, LogOut, Settings, Ticket } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { Button } from './ui/Button';

export function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isAdmin } = useAuthStore();
  const { openAuthModal } = useUIStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Función para obtener el nombre a mostrar
  const getDisplayName = () => {
    if (!user) return '';
    
    // Si tiene nombre y apellido, mostrar nombre completo
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    
    // Si solo tiene nombre, mostrarlo
    if (user.firstName) {
      return user.firstName;
    }
    
    // Si no tiene nombre, mostrar username
    return user.username;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Film className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">CineReserva</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Películas
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/profile" 
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Mi Perfil
                </Link>
                
                {isAdmin() && (
                  <Link 
                    to="/admin" 
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
                    <User className="h-5 w-5" />
                    <span className="hidden md:block max-w-32 truncate">{getDisplayName()}</span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-500 border-b">
                        <p className="font-medium truncate">{getDisplayName()}</p>
                        <p className="text-xs truncate">{user?.email}</p>
                      </div>
                      
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Mi Perfil
                      </Link>
                      
                      <Link
                        to="/profile?tab=reservations"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Ticket className="h-4 w-4 mr-2" />
                        Mis Reservas
                      </Link>
                      
                      {isAdmin() && (
                        <Link
                          to="/admin"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Panel Admin
                        </Link>
                      )}
                      
                      <hr className="my-1" />
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  onClick={() => openAuthModal('login')}
                >
                  Iniciar Sesión
                </Button>
                <Button 
                  onClick={() => openAuthModal('register')}
                >
                  Registrarse
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 