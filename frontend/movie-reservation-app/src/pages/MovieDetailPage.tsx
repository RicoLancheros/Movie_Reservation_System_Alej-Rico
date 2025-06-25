import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Users, ArrowLeft } from 'lucide-react';
import type { Movie, Showtime } from '../types';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

// Función para obtener películas del localStorage
const getMoviesFromStorage = (): Movie[] => {
  const stored = localStorage.getItem('movies');
  if (stored) {
    return JSON.parse(stored);
  }
  return [];
};

// Función para generar horarios dinámicos
const generateShowtimes = (movieId: string): Showtime[] => {
  const today = new Date();
  const showtimes: Showtime[] = [];
  
  // Generar horarios para los próximos 7 días
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + dayOffset);
    const dateString = currentDate.toISOString().split('T')[0];
    
    // Horarios por día: 14:00, 17:00, 20:00, 22:30
    const times = ['14:00', '17:00', '20:00', '22:30'];
    
    times.forEach((time, timeIndex) => {
      const id = `${movieId}-${dateString}-${time.replace(':', '')}`;
      const isWeekend = currentDate.getDay() === 0 || currentDate.getDay() === 6;
      const isPrime = time === '20:00' || time === '22:30';
      
      // Precios dinámicos
      let basePrice = 12000;
      if (isWeekend) basePrice += 3000;
      if (isPrime) basePrice += 2000;
      
      // Asientos disponibles aleatorios
      const totalSeats = 100;
      const availableSeats = Math.floor(Math.random() * 50) + 30; // Entre 30-80 asientos disponibles
      
      showtimes.push({
        id,
        movieId,
        date: dateString,
        time,
        hallId: `hall${(timeIndex % 3) + 1}`,
        price: basePrice,
        availableSeats,
        totalSeats
      });
    });
  }
  
  return showtimes;
};

export function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    if (id) {
      // Cargar película desde localStorage
      const movies = getMoviesFromStorage();
      const foundMovie = movies.find(m => m.id === id);
      setMovie(foundMovie || null);
      
      if (foundMovie) {
        // Generar horarios dinámicos
        const movieShowtimes = generateShowtimes(id);
        setShowtimes(movieShowtimes);
        
        // Establecer fecha inicial (hoy)
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
      }
    }
  }, [id]);

  const handleShowtimeSelect = (showtime: Showtime) => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para reservar asientos');
      return;
    }
    // Guardar información del showtime en localStorage para la página de asientos
    localStorage.setItem('selectedShowtime', JSON.stringify(showtime));
    localStorage.setItem('selectedMovie', JSON.stringify(movie));
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

  const availableDates = Array.from(new Set(showtimes.map(st => st.date))).sort();
  const filteredShowtimes = showtimes.filter(st => st.date === selectedDate);

  if (!movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Película no encontrada</p>
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
            src={movie.posterImage}
            alt={movie.title}
            className="w-full rounded-lg shadow-lg"
            onError={(e) => {
              e.currentTarget.src = 'https://via.placeholder.com/400x600?text=No+Image';
            }}
          />
        </div>

        {/* Movie Details */}
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{movie.title}</h1>
            
            <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
              <span className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {movie.duration} min
              </span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                {movie.genre}
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-medium">
                {movie.rating}
              </span>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {movie.description}
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Director</h3>
                <p className="text-gray-600">{movie.director}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Reparto</h3>
                <p className="text-gray-600">{movie.cast.slice(0, 3).join(', ')}</p>
              </div>
            </div>
          </div>

          {/* Showtime Selection */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Seleccionar Horario</h2>
            
            {/* Date Selection */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Fecha</h3>
              <div className="flex flex-wrap gap-2">
                {availableDates.map(date => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      selectedDate === date
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    {formatDate(date)}
                  </button>
                ))}
              </div>
            </div>

            {/* Showtime Grid */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Horarios Disponibles</h3>
              {filteredShowtimes.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {filteredShowtimes.map(showtime => {
                    const availability = getAvailabilityStatus(showtime.availableSeats, showtime.totalSeats);
                    return (
                      <div
                        key={showtime.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-xl font-bold text-gray-900">{showtime.time}</p>
                            <p className="text-sm text-gray-500">Sala {showtime.hallId.replace('hall', '')}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-blue-600">
                              {formatPrice(showtime.price)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-4">
                          <span className={`text-sm font-medium ${availability.color}`}>
                            {availability.text}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {showtime.availableSeats}/{showtime.totalSeats}
                          </span>
                        </div>

                        <Button
                          onClick={() => handleShowtimeSelect(showtime)}
                          className="w-full"
                          disabled={showtime.availableSeats === 0}
                        >
                          {showtime.availableSeats === 0 ? 'Agotado' : 'Seleccionar Asientos'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No hay horarios disponibles para esta fecha
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 