import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, ArrowLeft } from 'lucide-react';
import type { Movie, Showtime } from '../types';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { useMovieStore } from '../store/movieStore';

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { selectedMovie, showtimes, isLoading, error, fetchMovieById, fetchShowtimes } = useMovieStore();
  
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    if (id) {
      // Cargar película del backend
      fetchMovieById(id);
      // Cargar horarios del backend
      fetchShowtimes(id);
      
      // Establecer fecha inicial (hoy)
      const today = new Date().toISOString().split('T')[0];
      setSelectedDate(today);
    }
  }, [id, fetchMovieById, fetchShowtimes]);

  const handleShowtimeSelect = (showtime: Showtime) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para reservar asientos');
      return;
    }
    // Guardar información del showtime en localStorage para la página de asientos
    localStorage.setItem('selectedShowtime', JSON.stringify(showtime));
    localStorage.setItem('selectedMovie', JSON.stringify(selectedMovie));
    navigate(`/seats/${showtime.id}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (dateString === today.toISOString().split('T')[0]) {
      return 'Hoy';
    } else if (dateString === tomorrow.toISOString().split('T')[0]) {
      return 'Mañana';
    } else {
      return date.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const getAvailabilityStatus = (availableSeats: number, totalSeats: number) => {
    const percentage = (availableSeats / totalSeats) * 100;
    if (percentage > 50) return { text: 'Disponible', color: 'text-green-600' };
    if (percentage > 20) return { text: 'Pocas entradas', color: 'text-yellow-600' };
    return { text: 'Últimas entradas', color: 'text-red-600' };
  };

  // Filtrar showtimes disponibles
  const availableDates = Array.from(new Set(showtimes.map(st => st.date))).sort();
  const filteredShowtimes = showtimes.filter(st => st.date === selectedDate);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando película...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !selectedMovie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500 mb-4">
            {error || "Película no encontrada"}
          </p>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al catálogo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Botón de regreso */}
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')}
        className="mb-6 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al catálogo
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Movie Poster */}
        <div className="lg:col-span-1">
          <img
            src={selectedMovie.posterImage}
            alt={selectedMovie.title}
            className="w-full rounded-lg shadow-lg"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x600?text=No+Image';
            }}
          />
        </div>

        {/* Movie Details */}
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{selectedMovie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
              <span className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {selectedMovie.duration} min
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                {selectedMovie.genre}
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-medium">
                {selectedMovie.rating}
              </span>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {selectedMovie.description}
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Director</h3>
                <p className="text-gray-600">{selectedMovie.director}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Fecha de Estreno</h3>
                <p className="text-gray-600">
                  {new Date(selectedMovie.releaseDate).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {selectedMovie.cast && selectedMovie.cast.length > 0 && (
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-900 mb-2">Reparto</h3>
                  <p className="text-gray-600">{selectedMovie.cast.join(', ')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Showtimes */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Horarios</h2>
            
            {showtimes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay funciones disponibles para esta película</p>
              </div>
            ) : (
              <>
                {/* Date Selector */}
                {availableDates.length > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {availableDates.map(date => (
                        <Button
                          key={date}
                          variant={selectedDate === date ? 'primary' : 'secondary'}
                          onClick={() => setSelectedDate(date)}
                          className="text-sm"
                        >
                          {formatDate(date)}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Showtimes Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredShowtimes.map(showtime => {
                    const availability = getAvailabilityStatus(showtime.availableSeats, showtime.totalSeats);
                    
                    return (
                      <div
                        key={showtime.id}
                        className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-lg font-semibold text-gray-900">{showtime.time}</p>
                            <p className="text-sm text-gray-500">Sala {showtime.hallId.replace('hall', '')}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-blue-600">
                              {formatPrice(showtime.price)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1 text-sm">
                            <Users className="h-4 w-4" />
                            <span>{showtime.availableSeats} disponibles</span>
                          </div>
                          <span className={`text-xs font-medium ${availability.color}`}>
                            {availability.text}
                          </span>
                        </div>
                        
                        <Button
                          onClick={() => handleShowtimeSelect(showtime)}
                          disabled={showtime.availableSeats === 0}
                          className="w-full"
                          variant={showtime.availableSeats === 0 ? 'secondary' : 'primary'}
                        >
                          {showtime.availableSeats === 0 ? 'Agotado' : 'Seleccionar Asientos'}
                        </Button>
                      </div>
                    );
                  })}
                </div>

                {filteredShowtimes.length === 0 && selectedDate && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No hay funciones disponibles para la fecha seleccionada</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 