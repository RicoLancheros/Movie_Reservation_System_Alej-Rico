import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { Calendar, Clock, Star } from 'lucide-react';
import type { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onImageError?: (movieId: string) => void;
}

// Componente memoizado para optimizar el renderizado de listas grandes
export const MovieCard = memo(({ movie, onImageError }: MovieCardProps) => {
  const navigate = useNavigate();

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder-movie.svg';
    onImageError?.(movie.id);
  };

  const handleViewDetails = () => {
    navigate(`/movie/${movie.id}`);
  };

  // Formatear fecha de estreno
  const formatReleaseDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Formatear duración
  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Imagen de la película */}
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.posterImage || '/placeholder-movie.svg'}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={handleImageError}
          loading="lazy"
        />
        
        {/* Rating badge */}
        {movie.rating && (
          <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <Star className="h-3 w-3 fill-current" />
            {movie.rating}
          </div>
        )}
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {movie.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {movie.description}
        </p>

        {/* Información adicional */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" />
            <span>{formatReleaseDate(movie.releaseDate)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(movie.duration)}</span>
          </div>
        </div>

        {/* Género */}
        <div className="mb-4">
          <span className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
            {movie.genre}
          </span>
        </div>

        {/* Botón de acción */}
        <Button
          onClick={handleViewDetails}
          className="w-full"
          size="sm"
        >
          Ver Detalles
        </Button>
      </div>
    </div>
  );
});

MovieCard.displayName = 'MovieCard'; 