import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, Edit3, Save, X, Ticket, Clock, MapPin, Calendar, CreditCard } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useNotifications } from '../store/uiStore';

interface Reservation {
  id: string;
  movieTitle: string;
  date: string;
  time: string;
  seats: string[];
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  theater: string;
  bookingDate: string;
}

export function ProfilePage() {
  const [searchParams] = useSearchParams();
  const { user, updateUser } = useAuthStore();
  const { notifySuccess, notifyError, notifyWarning } = useNotifications();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  
  // Form data for editing profile
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    birthDate: user?.birthDate || '',
    preferences: {
      favoriteGenres: user?.preferences?.favoriteGenres || [],
      notifications: user?.preferences?.notifications ?? true,
      language: user?.preferences?.language || 'es'
    }
  });

  // Cargar reservas del usuario actual
  useEffect(() => {
    if (user?.id) {
      // Cargar reservas reales del localStorage para el usuario actual
      const userReservationsKey = `user_reservations_${user.id}`;
      const userReservations = JSON.parse(localStorage.getItem(userReservationsKey) || '[]');
      
      // Convertir a formato de ProfilePage
      const formattedReservations: Reservation[] = userReservations.map((reservation: any) => ({
        id: reservation.id,
        movieTitle: reservation.movie?.title || 'Película desconocida',
        date: reservation.showtime?.date || new Date().toISOString().split('T')[0],
        time: reservation.showtime?.time || '00:00',
        seats: reservation.seatIds || [],
        totalPrice: reservation.totalPrice || 0,
        status: reservation.status || 'confirmed',
        theater: `Sala ${reservation.showtime?.hallId || '1'}`,
        bookingDate: reservation.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0]
      }));
      
      console.log('📋 Reservas cargadas para usuario:', user.id);
      console.log('🎬 Total de reservas:', formattedReservations.length);
      setReservations(formattedReservations);
    } else {
      // Si no hay usuario, mostrar reservas vacías
      setReservations([]);
    }
  }, [user]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (formData.firstName.trim().length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    if (formData.lastName.trim().length < 2) {
      errors.push('El apellido debe tener al menos 2 caracteres');
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('El email no tiene un formato válido');
    }

    if (formData.phone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phone)) {
      errors.push('El teléfono no tiene un formato válido');
    }

    if (formData.birthDate) {
      const birthDate = new Date(formData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 13) {
        errors.push('Debes tener al menos 13 años');
      } else if (age > 120) {
        errors.push('Fecha de nacimiento inválida');
      }
    }

    return errors;
  };

  const handleSaveProfile = async () => {
    const validationErrors = validateForm();
    
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => notifyError(error));
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simular llamada a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUserData = {
        ...user!,
        ...formData,
        preferences: {
          ...user?.preferences,
          ...formData.preferences
        }
      };

      // Actualizar en el store
      await updateUser(updatedUserData);
      
      setIsEditing(false);
      notifySuccess('Perfil actualizado correctamente', 'Tus cambios han sido guardados');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      notifyError('Error al actualizar el perfil', 'Inténtalo de nuevo más tarde');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        birthDate: user.birthDate || '',
        preferences: {
          favoriteGenres: user.preferences?.favoriteGenres || [],
          notifications: user.preferences?.notifications ?? true,
          language: user.preferences?.language || 'es'
        }
      });
    }
    setIsEditing(false);
    notifyWarning('Edición cancelada', 'Los cambios no han sido guardados');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Confirmada';
      case 'completed': return 'Completada';
      case 'cancelled': return 'Cancelada';
      default: return 'Desconocido';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Debes estar autenticado para ver tu perfil</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
        <p className="text-gray-600">Gestiona tu información personal y revisa tus reservas</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <User className="h-4 w-4 inline mr-2" />
            Información Personal
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'reservations'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Ticket className="h-4 w-4 inline mr-2" />
            Mis Reservas ({reservations.filter(r => r.status !== 'cancelled').length})
          </button>
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Información Personal</h2>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="flex items-center space-x-2">
                <Edit3 className="h-4 w-4" />
                <span>Editar</span>
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  onClick={handleSaveProfile} 
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  <Save className="h-4 w-4" />
                  <span>{isSubmitting ? 'Guardando...' : 'Guardar'}</span>
                </Button>
                <Button 
                  onClick={handleCancelEdit} 
                  variant="ghost" 
                  className="flex items-center space-x-2"
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                  <span>Cancelar</span>
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Datos Básicos</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Tu nombre"
                    required
                  />
                ) : (
                  <p className="text-gray-900">{user.firstName || 'No especificado'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido <span className="text-red-500">*</span>
                </label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Tu apellido"
                    required
                  />
                ) : (
                  <p className="text-gray-900">{user.lastName || 'No especificado'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                {isEditing ? (
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="tu@email.com"
                  />
                ) : (
                  <p className="text-gray-900">{user.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                {isEditing ? (
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+57 300 123 4567"
                  />
                ) : (
                  <p className="text-gray-900">{user.phone || 'No especificado'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                ) : (
                  <p className="text-gray-900">
                    {user.birthDate ? new Date(user.birthDate).toLocaleDateString('es-ES') : 'No especificado'}
                  </p>
                )}
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preferencias</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notificaciones</label>
                {isEditing ? (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.preferences.notifications}
                      onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Recibir notificaciones por email</span>
                  </label>
                ) : (
                  <p className="text-gray-900">
                    {user.preferences?.notifications ? '✅ Activadas' : '❌ Desactivadas'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Idioma</label>
                {isEditing ? (
                  <select
                    value={formData.preferences.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="es">🇪🇸 Español</option>
                    <option value="en">🇺🇸 English</option>
                  </select>
                ) : (
                  <p className="text-gray-900">
                    {user.preferences?.language === 'es' ? '🇪🇸 Español' : '🇺🇸 English'}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Géneros Favoritos</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Acción', 'Comedia', 'Drama', 'Terror', 'Ciencia Ficción', 'Romance'].map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Información de la Cuenta</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Usuario:</strong> {user.username}</p>
                  <p><strong>Tipo de cuenta:</strong> {user.roles?.[0]?.name === 'ROLE_ADMIN' ? '👑 Administrador' : '👤 Usuario'}</p>
                  <p><strong>Reservas realizadas:</strong> {reservations.length}</p>
                  <p><strong>Estado:</strong> <span className="text-green-600 font-medium">✅ Activa</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reservations Tab */}
      {activeTab === 'reservations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Mis Reservas</h2>
            
            {reservations.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes reservas</h3>
                <p className="text-gray-500 mb-4">¡Es hora de reservar tu primera película!</p>
                <Button onClick={() => window.location.href = '/'}>
                  Explorar Películas
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div key={reservation.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{reservation.movieTitle}</h3>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                          {getStatusText(reservation.status)}
                        </div>
                      </div>
                      <p className="text-lg font-bold text-primary-600">{formatPrice(reservation.totalPrice)}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date(reservation.date).toLocaleDateString('es-ES', { 
                          weekday: 'short', 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{reservation.time}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{reservation.theater}</span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Ticket className="h-4 w-4 mr-2" />
                        <span>Asientos: {reservation.seats.join(', ')}</span>
                      </div>
                    </div>
                    
                    {reservation.status === 'confirmed' && (
                      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                        <Button
                          variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => notifyWarning('Función no disponible', 'La cancelación de reservas estará disponible próximamente')}
                        >
                          Cancelar Reserva
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 