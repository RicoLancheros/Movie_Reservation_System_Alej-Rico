import React, { useEffect, useMemo, useCallback } from 'react';
import { Search } from 'lucide-react';
import { useMovieStore } from '../store/movieStore';
import { MovieCard } from '../components/MovieCard';
import type { Movie } from '../types';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();
  const { movies, filters, isLoading, error, fetchMovies, setFilters } = useMovieStore();

  useEffect(() => {
    // Cargar películas del backend al montar el componente
    fetchMovies();
  }, [fetchMovies]);

  // Memoizar géneros únicos para evitar recálculos innecesarios
  const genres = useMemo(() => {
    return Array.from(new Set(movies.map(movie => movie.genre)));
  }, [movies]);

  // Memoizar películas filtradas
  const filteredMovies = useMemo(() => {
    let filtered = movies;

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(movie => 
        movie.title.toLowerCase().includes(searchLower) ||
        movie.description.toLowerCase().includes(searchLower) ||
        movie.genre.toLowerCase().includes(searchLower) ||
        movie.director?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.genre) {
      filtered = filtered.filter(movie => movie.genre === filters.genre);
    }

    return filtered;
  }, [movies, filters.search, filters.genre]);

  // Callbacks memoizados para evitar re-renders innecesarios
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value;
    setFilters({ search: searchTerm });
  }, [setFilters]);

  const handleGenreFilter = useCallback((genre: string) => {
    if (filters.genre === genre) {
      setFilters({ genre: undefined });
    } else {
      setFilters({ genre });
    }
  }, [filters.genre, setFilters]);

  const handleMovieSelect = useCallback((movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  }, [navigate]);

  const handleImageError = useCallback((movieId: string) => {
    console.warn(`Failed to load image for movie ${movieId}`);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, [setFilters]);

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
        {filteredMovies.length > 0 ? (
          filteredMovies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onImageError={handleImageError}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">
              {filters.search || filters.genre 
                ? 'No se encontraron películas que coincidan con tu búsqueda' 
                : 'No hay películas disponibles'
              }
            </p>
            {(filters.search || filters.genre) && (
              <Button 
                variant="ghost" 
                onClick={clearFilters}
                className="mt-4"
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 