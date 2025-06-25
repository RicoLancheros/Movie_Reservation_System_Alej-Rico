import React, { useEffect, useState } from 'react';
import { Search, Clock } from 'lucide-react';
import { useMovieStore } from '../store/movieStore';
import type { Movie } from '../types';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

// Función para obtener películas del localStorage
const getMoviesFromStorage = (): Movie[] => {
  const stored = localStorage.getItem('movies');
  if (stored) {
    return JSON.parse(stored);
  }
  // Películas por defecto si no hay nada en localStorage
  return [
    {
      id: '1',
      title: 'Avengers: Endgame',
      description: 'Los Vengadores se reúnen una vez más para enfrentar a Thanos y salvar el universo.',
      posterImage: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
      genre: 'Acción',
      duration: 181,
      rating: 'PG-13',
      releaseDate: '2019-04-26',
      director: 'Anthony Russo, Joe Russo',
      cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo']
    },
    {
      id: '2',
      title: 'The Batman',
      description: 'Batman se aventura en las calles de Gotham mientras persigue al Acertijo.',
      posterImage: 'https://static.posters.cz/image/1300/the-batman-unmask-the-truth-i133030.jpg',
      genre: 'Acción',
      duration: 176,
      rating: 'PG-13',
      releaseDate: '2022-03-04',
      director: 'Matt Reeves',
      cast: ['Robert Pattinson', 'Zoë Kravitz', 'Paul Dano']
    },
    {
      id: '3',
      title: 'Dune',
      description: 'En un futuro lejano, el joven Paul Atreides debe navegar por un mundo peligroso.',
      posterImage: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg',
      genre: 'Ciencia Ficción',
      duration: 155,
      rating: 'PG-13',
      releaseDate: '2021-10-22',
      director: 'Denis Villeneuve',
      cast: ['Timothée Chalamet', 'Rebecca Ferguson', 'Oscar Isaac']
    },
    {
      id: '4',
      title: 'Spider-Man: No Way Home',
      description: 'Peter Parker busca la ayuda del Doctor Strange cuando su identidad es revelada.',
      posterImage: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg',
      genre: 'Acción',
      duration: 148,
      rating: 'PG-13',
      releaseDate: '2021-12-17',
      director: 'Jon Watts',
      cast: ['Tom Holland', 'Zendaya', 'Benedict Cumberbatch']
    }
  ];
};

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
  const { filters, setFilters } = useMovieStore();
  const [displayMovies, setDisplayMovies] = useState<Movie[]>(getMoviesFromStorage());

  useEffect(() => {
    // Por ahora usamos datos mock, luego conectaremos con la API real
    setDisplayMovies(getMoviesFromStorage());

    // Listener para actualizaciones de películas desde AdminDashboard
    const handleMoviesUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const updatedMovies = customEvent.detail as Movie[];
      setDisplayMovies(updatedMovies);
    };

    window.addEventListener('moviesUpdated', handleMoviesUpdate);

    return () => {
      window.removeEventListener('moviesUpdated', handleMoviesUpdate);
    };
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setFilters({ search: searchTerm });
    
    if (searchTerm) {
      const filtered = getMoviesFromStorage().filter(movie =>
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.genre.toLowerCase().includes(searchTerm)
      );
      setDisplayMovies(filtered);
    } else {
      setDisplayMovies(getMoviesFromStorage());
    }
  };

  const handleGenreFilter = (genre: string) => {
    if (filters.genre === genre) {
      setFilters({ genre: undefined });
      setDisplayMovies(getMoviesFromStorage());
    } else {
      setFilters({ genre });
      const filtered = getMoviesFromStorage().filter(movie => 
        movie.genre === genre
      );
      setDisplayMovies(filtered);
    }
  };

  const handleMovieSelect = (movie: Movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const genres = Array.from(new Set(getMoviesFromStorage().map(movie => movie.genre)));

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
                size="sm"
                onClick={() => handleGenreFilter(genre)}
              >
                {genre}
              </Button>
            ))}
            {filters.genre && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFilters({ genre: undefined });
                  setDisplayMovies(getMoviesFromStorage());
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayMovies.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onSelect={handleMovieSelect}
          />
        ))}
      </div>

      {/* No results */}
      {displayMovies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No se encontraron películas que coincidan con tu búsqueda.
          </p>
          <Button
            variant="ghost"
            onClick={() => {
              setFilters({});
              setDisplayMovies(getMoviesFromStorage());
            }}
            className="mt-4"
          >
            Ver todas las películas
          </Button>
        </div>
      )}
    </div>
  );
} 