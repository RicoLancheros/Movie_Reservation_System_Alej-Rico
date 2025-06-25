import React, { useEffect } from 'react';
import { Search, Clock } from 'lucide-react';
import { useMovieStore } from '../store/movieStore';
import type { Movie } from '../types';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

function MovieCard({ movie, onSelect }: MovieCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={movie.posterImage}
          alt={movie.title}
          className="w-full h-96 object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Image';
          }}
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
          {movie.rating}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{movie.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{movie.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {movie.duration} min
          </span>
          <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded">
            {movie.genre}
          </span>
        </div>
        
        <Button 
          className="w-full" 
          onClick={() => onSelect(movie)}
        >
          Ver Detalles
        </Button>
      </div>
    </div>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const { movies, filters, isLoading, error, fetchMovies, setFilters } = useMovieStore();

  useEffect(() => {
    // Cargar películas del backend al montar el componente
    fetchMovies();
  }, [fetchMovies]);

  // Recargar películas cuando cambien los filtros
  useEffect(() => {
    fetchMovies();
  }, [filters, fetchMovies]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setFilters({ search: searchTerm });
  };

  const handleGenreFilter = (genre: string) => {
    if (filters.genre === genre) {
      setFilters({ genre: undefined });
    } else {
      setFilters({ genre });
    }
  };

  const handleMovieSelect = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  // Obtener géneros únicos de las películas cargadas
  const genres = Array.from(new Set(movies.map(movie => movie.genre)));

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando películas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error al cargar las películas: {error}</p>
            <Button onClick={fetchMovies}>Reintentar</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bienvenido a CineReserva
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Descubre las mejores películas y reserva tus asientos de manera fácil y rápida
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="w-full lg:w-96">
            <Input
              placeholder="Buscar películas..."
              icon={<Search />}
              value={filters.search || ''}
              onChange={handleSearch}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {genres.map(genre => (
              <Button
                key={genre}
                variant={filters.genre === genre ? 'primary' : 'secondary'}
                onClick={() => handleGenreFilter(genre)}
              >
                {genre}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.length > 0 ? (
          movies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onSelect={handleMovieSelect}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No se encontraron películas</p>
            {filters.search || filters.genre ? (
              <Button 
                variant="ghost" 
                onClick={() => setFilters({})}
                className="mt-4"
              >
                Limpiar filtros
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
} 