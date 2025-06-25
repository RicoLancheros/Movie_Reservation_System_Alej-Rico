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
}

type MovieStore = MovieState & MovieActions;

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
      const queryParams = new URLSearchParams();
      
      if (filters.genre) queryParams.append('genre', filters.genre);
      if (filters.search) queryParams.append('title', filters.search);

      // Llamada real al movie-service
      const url = `http://localhost:8082/api/movies/search?${queryParams}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const movies: Movie[] = await response.json();
      set({ movies, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch movies',
        isLoading: false,
      });
    }
  },

  fetchMovieById: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:8082/api/movies/${id}`);
      
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
      let url = `http://localhost:8083/api/showtimes/movie/${movieId}`;
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
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch showtimes',
        isLoading: false,
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
})); 