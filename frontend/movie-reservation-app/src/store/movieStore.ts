import { create } from 'zustand';
import type { Movie, Showtime, MovieFilters } from '../types';

interface MovieState {
  movies: Movie[];
  selectedMovie: Movie | null;
  showtimes: Showtime[];
  filters: MovieFilters;
  isLoading: boolean;
  error: string | null;
}

interface MovieActions {
  fetchMovies: () => Promise<void>;
  fetchMovieById: (id: string) => Promise<void>;
  fetchShowtimes: (movieId: string, date?: string) => Promise<void>;
  setSelectedMovie: (movie: Movie | null) => void;
  setFilters: (filters: Partial<MovieFilters>) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  syncShowtimesFromAdmin: (adminShowtimes: Showtime[]) => void;
  refreshMovies: () => Promise<void>;
}

type MovieStore = MovieState & MovieActions;

// URL base del Movie Service Go
const MOVIE_SERVICE_URL = 'http://localhost:8083/api';

export const useMovieStore = create<MovieStore>((set, get) => ({
  // State
  movies: [],
  selectedMovie: null,
  showtimes: [],
  filters: {},
  isLoading: false,
  error: null,

  // Actions
  fetchMovies: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      let url = `${MOVIE_SERVICE_URL}/movies`;
      
      // Si hay filtros, usar el endpoint de búsqueda
      if (filters.genre || filters.search) {
        url = `${MOVIE_SERVICE_URL}/movies/search`;
        const queryParams = new URLSearchParams();
        
        if (filters.genre) queryParams.append('genre', filters.genre);
        if (filters.search) queryParams.append('title', filters.search);
        
        if (queryParams.toString()) {
          url += `?${queryParams}`;
        }
      }

      // Agregar timestamp para evitar caché
      const timestamp = new Date().getTime();
      const separator = url.includes('?') ? '&' : '?';
      url += `${separator}_t=${timestamp}`;

      console.log('Fetching movies from:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch movies: ${response.status} ${response.statusText}`);
      }

      const movies: Movie[] = await response.json();
      console.log('Movies fetched successfully:', movies.length, 'movies');
      console.log('Movies data:', movies);
      set({ movies, isLoading: false });
    } catch (error) {
      console.error('Error fetching movies:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch movies',
        isLoading: false,
      });
    }
  },

  fetchMovieById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${MOVIE_SERVICE_URL}/movies/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch movie');
      }

      const movie: Movie = await response.json();
      set({ selectedMovie: movie, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch movie',
        isLoading: false,
      });
    }
  },

  fetchShowtimes: async (movieId: string, date?: string) => {
    set({ isLoading: true, error: null });
    try {
      // Intentar primero con el servicio de showtimes (Java)
      let url = `http://localhost:8084/api/showtimes/movie/${movieId}`;
      if (date) {
        url += `/date/${date}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch showtimes');
      }

      const showtimes: Showtime[] = await response.json();
      set({ showtimes, isLoading: false });
    } catch (error) {
      // Si el servicio no está disponible, intentar obtener del adminStore
      console.warn('Showtime service not available, checking admin store...');
      
      // Importar dinámicamente para evitar dependencias circulares
      const { useAdminStore } = await import('./adminStore');
      const adminState = useAdminStore.getState();
      
      // Filtrar funciones por película
      let filteredShowtimes = adminState.showtimes.filter(st => st.movieId === movieId);
      
      // Filtrar por fecha si se especifica
      if (date) {
        filteredShowtimes = filteredShowtimes.filter(st => st.date === date);
      }
      
      // Enriquecer con información de película
      const { movies } = get();
      const movie = movies.find(m => m.id === movieId);
      
      const enrichedShowtimes = filteredShowtimes.map(showtime => ({
        ...showtime,
        movieTitle: movie?.title || 'Película desconocida'
      }));
      
      set({ 
        showtimes: enrichedShowtimes, 
        isLoading: false, 
        error: null 
      });
    }
  },

  setSelectedMovie: (movie) => set({ selectedMovie: movie }),
  setFilters: (newFilters) => set(state => ({ 
    filters: { ...state.filters, ...newFilters } 
  })),
  clearFilters: () => set({ filters: {} }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  
  // Nueva función para sincronizar showtime desde admin
  syncShowtimesFromAdmin: (adminShowtimes) => {
    set({ showtimes: adminShowtimes });
  },

  refreshMovies: async () => {
    console.log('Force refreshing movies...');
    const { fetchMovies } = get();
    await fetchMovies();
  },
})); 