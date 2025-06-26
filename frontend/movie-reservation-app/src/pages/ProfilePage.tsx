import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { User, Edit3, Save, X, Ticket, Clock, MapPin, Calendar, CreditCard } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

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
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [isEditing, setIsEditing] = useState(false);
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

  // Mock reservations data - en producción vendría de una API
  useEffect(() => {
    // Simular datos de reservas
    const mockReservations: Reservation[] = [
      {
        id: '1',
        movieTitle: 'Avengers: Endgame',
        date: '2024-01-15',
        time: '19:30',
        seats: ['F8', 'F9'],
        totalPrice: 60000,
        status: 'completed',
        theater: 'Sala VIP 1',
        bookingDate: '2024-01-10'
      },
      {
        id: '2',
        movieTitle: 'Spider-Man: No Way Home',
        date: '2024-01-20',
        time: '21:00',
        seats: ['G5', 'G6', 'G7'],
        totalPrice: 45000,
        status: 'confirmed',
        theater: 'Sala Estándar 3',
        bookingDate: '2024-01-18'
      },
      {
        id: '3',
        movieTitle: 'Dune: Part Two',
        date: '2024-01-12',
        time: '16:00',
        seats: ['D10'],
        totalPrice: 22000,
        status: 'cancelled',
        theater: 'Sala 4DX',
        bookingDate: '2024-01-08'
      }
    ];
    
    setReservations(mockReservations);
  }, []);

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

  const handleSaveProfile = () => {
    // Aquí se haría la llamada a la API para actualizar el perfil
    updateUser({
      ...user!,
      ...formData
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setFormData({
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
    setIsEditing(false);
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
                <Button onClick={handleSaveProfile} className="flex items-center space-x-2 bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4" />
                  <span>Guardar</span>
                </Button>
                <Button onClick={handleCancelEdit} variant="ghost" className="flex items-center space-x-2">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Tu nombre"
                  />
                ) : (
                  <p className="text-gray-900">{user?.firstName || 'No especificado'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                {isEditing ? (
                  <Input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Tu apellido"
                  />
                ) : (
                  <p className="text-gray-900">{user?.lastName || 'No especificado'}</p>
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
                  <p className="text-gray-900">{user?.email}</p>
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
                  <p className="text-gray-900">{user?.phone || 'No especificado'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900">{user?.birthDate || 'No especificado'}</p>
                )}
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preferencias</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notificaciones</label>
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
                    {user?.preferences?.notifications ? 'Activadas' : 'Desactivadas'}
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
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                ) : (
                  <p className="text-gray-900">
                    {user?.preferences?.language === 'es' ? 'Español' : 'English'}
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
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Usuario:</strong> {user?.username}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <strong>Miembro desde:</strong> Enero 2024
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Reservas realizadas:</strong> {reservations.length}
                </p>
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
                    
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        Reservado el {new Date(reservation.bookingDate).toLocaleDateString('es-ES')}
                      </p>
                      {reservation.status === 'confirmed' && (
                        <div className="flex space-x-2">
                          <Button size="sm" variant="ghost">
                            Modificar
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                            Cancelar
                          </Button>
                        </div>
                      )}
                    </div>
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