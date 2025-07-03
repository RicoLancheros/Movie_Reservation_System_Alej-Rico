import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Calendar, User, CheckCircle, TrendingUp, Film, Users, DollarSign } from 'lucide-react';
import type { Movie, Showtime, ShowtimeFormData, CreateShowtimeRequest } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useMovieStore } from '../store/movieStore';
import { useAdminStore } from '../store/adminStore';

interface MovieFormData {
  title: string;
  description: string;
  posterImage: string;
  genre: string;
  duration: string;
  rating: string;
  releaseDate: string;
  director: string;
  cast: string;
}

const emptyMovieFormData: MovieFormData = {
  title: '',
  description: '',
  posterImage: '',
  genre: '',
  duration: '',
  rating: '',
  releaseDate: '',
  director: '',
  cast: ''
};

const emptyShowtimeFormData: ShowtimeFormData = {
  movieId: '',
  date: '',
  time: '',
  hallId: '',
  price: ''
};

type TabType = 'movies' | 'showtimes' | 'stats';

export function AdminDashboard() {
  const { movies, isLoading: moviesLoading, error: moviesError, fetchMovies, refreshMovies } = useMovieStore();
  const { 
    showtimes, 
    halls, 
    stats, 
    isLoading: adminLoading, 
    error: adminError, 
    fetchShowtimes, 
    fetchHalls, 
    fetchStats,
    createShowtime,
    updateShowtime,
    deleteShowtime,
    getDefaultPriceByHall
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState<TabType>('movies');
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [isShowtimeModalOpen, setIsShowtimeModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [editingShowtime, setEditingShowtime] = useState<Showtime | null>(null);
  const [movieFormData, setMovieFormData] = useState<MovieFormData>(emptyMovieFormData);
  const [showtimeFormData, setShowtimeFormData] = useState<ShowtimeFormData>(emptyShowtimeFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Cargar datos iniciales
    fetchMovies();
    fetchShowtimes();
    fetchHalls();
    fetchStats();
  }, [fetchMovies, fetchShowtimes, fetchHalls, fetchStats]);

  // Crear función predeterminada cuando se crea una nueva película
  const createDefaultShowtime = async (movieId: string) => {
    const defaultShowtime: CreateShowtimeRequest = {
      movieId,
      date: new Date().toISOString().split('T')[0], // Fecha actual
      time: '19:00', // Horario predeterminado
      hallId: halls[0]?.id || '1', // Primera sala disponible
      price: getDefaultPriceByHall(halls[0]?.id || '1') // Precio automático según la sala
    };

    try {
      await createShowtime(defaultShowtime);
    } catch (error) {
      console.warn('No se pudo crear la función predeterminada:', error);
    }
  };

  const handleMovieInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMovieFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShowtimeInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Si se cambia la sala, actualizar automáticamente el precio
    if (name === 'hallId' && value) {
      const defaultPrice = getDefaultPriceByHall(value);
      setShowtimeFormData(prev => ({
        ...prev,
        [name]: value,
        price: defaultPrice.toString()
      }));
    } else {
      setShowtimeFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleMovieSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const movieData = {
        title: movieFormData.title,
        description: movieFormData.description,
        posterImage: movieFormData.posterImage || '/placeholder-movie.svg',
        genre: movieFormData.genre,
        duration: parseInt(movieFormData.duration),
        rating: movieFormData.rating,
        releaseDate: movieFormData.releaseDate,
        director: movieFormData.director,
        cast: movieFormData.cast.split(',').map(actor => actor.trim()).filter(actor => actor)
      };

      console.log('Saving movie:', movieData);

      const url = editingMovie 
        ? `http://localhost:8083/api/movies/${editingMovie.id}`
        : 'http://localhost:8083/api/movies';
      
      const method = editingMovie ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieData)
      });

      if (!response.ok) {
        throw new Error('Error al guardar la película');
      }

      const savedMovie = await response.json();
      console.log('Movie saved successfully:', savedMovie);

      // Si es una nueva película, crear función predeterminada
      if (!editingMovie) {
        console.log('Creating default showtime for new movie...');
        await createDefaultShowtime(savedMovie.id);
      }

      // Recargar las películas del backend con logs
      console.log('Refreshing movies from backend...');
      await fetchMovies();
      console.log('Current movies in store:', movies.length);
      
      await fetchShowtimes();
      await fetchStats();
      handleCloseMovieModal();
      
      // Mostrar mensaje de éxito
      alert(editingMovie ? 'Película actualizada correctamente' : 'Película creada correctamente');
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar la película');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShowtimeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validar que la fecha de la función no sea anterior a la fecha de estreno
      const selectedMovie = movies.find(m => m.id === showtimeFormData.movieId);
      if (selectedMovie) {
        const releaseDate = new Date(selectedMovie.releaseDate);
        const showtimeDate = new Date(showtimeFormData.date);
        
        // Resetear las horas para comparar solo fechas
        releaseDate.setHours(0, 0, 0, 0);
        showtimeDate.setHours(0, 0, 0, 0);
        
        if (showtimeDate < releaseDate) {
          alert(`No se puede programar una función antes de la fecha de estreno (${selectedMovie.releaseDate})`);
          setIsSubmitting(false);
          return;
        }
      }

      // Validar que la fecha no sea en el pasado
      const today = new Date();
      const showtimeDate = new Date(showtimeFormData.date);
      today.setHours(0, 0, 0, 0);
      showtimeDate.setHours(0, 0, 0, 0);
      
      if (showtimeDate < today) {
        alert('No se puede programar una función en una fecha pasada');
        setIsSubmitting(false);
        return;
      }

      // Validar que el precio sea válido
      const price = parseFloat(showtimeFormData.price);
      if (isNaN(price) || price <= 0) {
        alert('El precio debe ser un número mayor a 0');
        setIsSubmitting(false);
        return;
      }

      const showtimeData: CreateShowtimeRequest = {
        movieId: showtimeFormData.movieId,
        date: showtimeFormData.date,
        time: showtimeFormData.time,
        hallId: showtimeFormData.hallId,
        price: price
      };

      if (editingShowtime) {
        await updateShowtime(editingShowtime.id, showtimeData);
      } else {
        await createShowtime(showtimeData);
      }

      await fetchStats();
      handleCloseShowtimeModal();
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar la función');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditMovie = (movie: Movie) => {
    setEditingMovie(movie);
    setMovieFormData({
      title: movie.title,
      description: movie.description,
      posterImage: movie.posterImage,
      genre: movie.genre,
      duration: movie.duration.toString(),
      rating: movie.rating,
      releaseDate: movie.releaseDate,
      director: movie.director,
      cast: movie.cast.join(', ')
    });
    setIsMovieModalOpen(true);
  };

  const handleEditShowtime = (showtime: Showtime) => {
    setEditingShowtime(showtime);
    setShowtimeFormData({
      movieId: showtime.movieId,
      date: showtime.date,
      time: showtime.time,
      hallId: showtime.hallId,
      price: showtime.price.toString()
    });
    setIsShowtimeModalOpen(true);
  };

  const handleDeleteMovie = async (movieId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta película? También se eliminarán todas sus funciones.')) {
      try {
        const response = await fetch(`http://localhost:8083/api/movies/${movieId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Error al eliminar la película');
        }

        // Recargar las películas del backend
        await fetchMovies();
        await fetchShowtimes();
        await fetchStats();
        
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar la película');
      }
    }
  };

  const handleDeleteShowtime = async (showtimeId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta función?')) {
      try {
        await deleteShowtime(showtimeId);
        await fetchStats();
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar la función');
      }
    }
  };

  const handleCloseMovieModal = () => {
    setIsMovieModalOpen(false);
    setEditingMovie(null);
    setMovieFormData(emptyMovieFormData);
  };

  const handleCloseShowtimeModal = () => {
    setIsShowtimeModalOpen(false);
    setEditingShowtime(null);
    setShowtimeFormData(emptyShowtimeFormData);
  };

  const handleAddNewMovie = () => {
    setEditingMovie(null);
    setMovieFormData(emptyMovieFormData);
    setIsMovieModalOpen(true);
  };

  const handleAddNewShowtime = () => {
    setEditingShowtime(null);
    setShowtimeFormData(emptyShowtimeFormData);
    setIsShowtimeModalOpen(true);
  };

  const getMovieTitleById = (movieId: string) => {
    const movie = movies.find(m => m.id === movieId);
    return movie?.title || 'Película desconocida';
  };

  const getHallNameById = (hallId: string) => {
    const hall = halls.find(h => h.id === hallId);
    return hall?.name || 'Sala desconocida';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isLoading = moviesLoading || adminLoading;
  const error = moviesError || adminError;

  if (isLoading && movies.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando panel de administración...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Film className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Películas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMovies}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Funciones</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalShowtimes}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reservas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReservations}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ingresos</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('movies')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'movies'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Películas ({movies.length})
          </button>
          <button
            onClick={() => setActiveTab('showtimes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'showtimes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Funciones ({showtimes.length})
          </button>
        </nav>
      </div>

      {/* Movies Tab */}
      {activeTab === 'movies' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Películas</h2>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  onClick={fetchMovies}
                  className="flex items-center gap-2"
                >
                  🔄 Actualizar
                </Button>
                <Button onClick={handleAddNewMovie} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar Película
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Película
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Género
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duración
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clasificación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Funciones
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {movies.map((movie) => {
                  const movieShowtimes = showtimes.filter(s => s.movieId === movie.id);
                  return (
                    <tr key={movie.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-16 w-12">
                            <img
                              className="h-16 w-12 object-cover rounded"
                              src={movie.posterImage}
                              alt={movie.title}
                              onError={(e) => {
                                e.currentTarget.src = '/placeholder-movie.svg';
                              }}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{movie.title}</div>
                            <div className="text-sm text-gray-500">{movie.director}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {movie.genre}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {movie.duration} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {movie.rating}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {movieShowtimes.length} funciones
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditMovie(movie)}
                          className="mr-2"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteMovie(movie.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {movies.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No hay películas registradas</p>
              <Button onClick={handleAddNewMovie} className="mt-4">
                Agregar Primera Película
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Showtimes Tab */}
      {activeTab === 'showtimes' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Gestión de Funciones</h2>
              <Button onClick={handleAddNewShowtime} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Agregar Función
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Película
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sala
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asientos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {showtimes.map((showtime) => (
                  <tr key={showtime.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getMovieTitleById(showtime.movieId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(showtime.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {showtime.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getHallNameById(showtime.hallId)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPrice(showtime.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {showtime.availableSeats}/{showtime.totalSeats}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditShowtime(showtime)}
                        className="mr-2"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteShowtime(showtime.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showtimes.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No hay funciones registradas</p>
              <Button onClick={handleAddNewShowtime} className="mt-4">
                Agregar Primera Función
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Movie Modal */}
      <Modal isOpen={isMovieModalOpen} onClose={handleCloseMovieModal} title={editingMovie ? 'Editar Película' : 'Agregar Película'}>
        <form onSubmit={handleMovieSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <Input
                name="title"
                value={movieFormData.title}
                onChange={handleMovieInputChange}
                required
                placeholder="Título de la película"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Género *
              </label>
              <select
                name="genre"
                value={movieFormData.genre}
                onChange={handleMovieInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar género</option>
                <option value="Acción">Acción</option>
                <option value="Animación">Animación</option>
                <option value="Aventura">Aventura</option>
                <option value="Ciencia Ficción">Ciencia Ficción</option>
                <option value="Comedia">Comedia</option>
                <option value="Drama">Drama</option>
                <option value="Horror">Horror</option>
                <option value="Romance">Romance</option>
                <option value="Suspenso">Suspenso</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duración (minutos) *
              </label>
              <Input
                name="duration"
                type="number"
                value={movieFormData.duration}
                onChange={handleMovieInputChange}
                required
                placeholder="120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Clasificación *
              </label>
              <select
                name="rating"
                value={movieFormData.rating}
                onChange={handleMovieInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar clasificación</option>
                <option value="G">G</option>
                <option value="PG">PG</option>
                <option value="PG-13">PG-13</option>
                <option value="R">R</option>
                <option value="NC-17">NC-17</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Estreno *
              </label>
              <Input
                name="releaseDate"
                type="date"
                value={movieFormData.releaseDate}
                onChange={handleMovieInputChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Director *
              </label>
              <Input
                name="director"
                value={movieFormData.director}
                onChange={handleMovieInputChange}
                required
                placeholder="Nombre del director"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL de la Imagen del Póster
            </label>
            <Input
              name="posterImage"
              value={movieFormData.posterImage}
              onChange={handleMovieInputChange}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reparto
            </label>
            <Input
              name="cast"
              value={movieFormData.cast}
              onChange={handleMovieInputChange}
              placeholder="Actor 1, Actor 2, Actor 3..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              name="description"
              value={movieFormData.description}
              onChange={handleMovieInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción de la película..."
            />
          </div>

          {!editingMovie && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Al crear esta película, se generará automáticamente una función predeterminada 
                para hoy a las 19:00 en la primera sala disponible con precio automático según el tipo de sala.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCloseMovieModal}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Guardando...' : editingMovie ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Showtime Modal */}
      <Modal isOpen={isShowtimeModalOpen} onClose={handleCloseShowtimeModal} title={editingShowtime ? 'Editar Función' : 'Agregar Función'}>
        <form onSubmit={handleShowtimeSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Película *
            </label>
            <select
              name="movieId"
              value={showtimeFormData.movieId}
              onChange={handleShowtimeInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar película</option>
              {movies.map(movie => (
                <option key={movie.id} value={movie.id}>
                  {movie.title} ({movie.genre})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha *
              </label>
              <Input
                name="date"
                type="date"
                value={showtimeFormData.date}
                onChange={handleShowtimeInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora *
              </label>
              <Input
                name="time"
                type="time"
                value={showtimeFormData.time}
                onChange={handleShowtimeInputChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sala *
              </label>
              <select
                name="hallId"
                value={showtimeFormData.hallId}
                onChange={handleShowtimeInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar sala</option>
                {halls.map(hall => (
                  <option key={hall.id} value={hall.id}>
                    {hall.name} ({hall.capacity} asientos)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio (COP) *
              </label>
              <Input
                name="price"
                type="number"
                value={showtimeFormData.price}
                onChange={handleShowtimeInputChange}
                required
                placeholder="Se llena automáticamente según la sala"
                min="0"
                step="1000"
              />
              {showtimeFormData.hallId && (
                <p className="text-xs text-gray-500 mt-1">
                  Precio sugerido: {formatPrice(getDefaultPriceByHall(showtimeFormData.hallId))}
                </p>
              )}
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <h4 className="text-sm font-medium text-green-800 mb-2">Precios Automáticos por Sala:</h4>
            <div className="text-xs text-green-700 grid grid-cols-2 gap-2">
              <span>• VIP: {formatPrice(30000)}</span>
              <span>• Estándar: {formatPrice(15000)}</span>
              <span>• IMAX: {formatPrice(20000)}</span>
              <span>• 4DX: {formatPrice(22000)}</span>
            </div>
            <p className="text-xs text-green-600 mt-2">
              El precio se ajusta automáticamente al seleccionar la sala, pero puedes modificarlo manualmente.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCloseShowtimeModal}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Guardando...' : editingShowtime ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </Modal>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">Error: {error}</p>
        </div>
      )}
    </div>
  );
} 