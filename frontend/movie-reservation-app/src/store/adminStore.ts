import { create } from 'zustand';
import type { Showtime, HallOption, AdminStats, CreateShowtimeRequest } from '../types';

interface AdminState {
  showtimes: Showtime[];
  halls: HallOption[];
  stats: AdminStats | null;
  isLoading: boolean;
  error: string | null;
}

interface AdminActions {
  fetchShowtimes: () => Promise<void>;
  fetchShowtimesByMovie: (movieId: string) => Promise<void>;
  createShowtime: (showtimeData: CreateShowtimeRequest) => Promise<void>;
  updateShowtime: (id: string, showtimeData: CreateShowtimeRequest) => Promise<void>;
  deleteShowtime: (id: string) => Promise<void>;
  fetchHalls: () => Promise<void>;
  fetchStats: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  getDefaultPriceByHall: (hallId: string) => number;
}

type AdminStore = AdminState & AdminActions;

// Mock data para desarrollo inicial con precios automáticos
const mockHalls: HallOption[] = [
  { id: '1', name: 'Sala 1 - VIP', capacity: 50 },
  { id: '2', name: 'Sala 2 - Estándar', capacity: 120 },
  { id: '3', name: 'Sala 3 - IMAX', capacity: 200 },
  { id: '4', name: 'Sala 4 - 4DX', capacity: 80 },
  { id: '5', name: 'Sala 5 - Estándar', capacity: 150 },
];

// Precios por tipo de sala (en COP)
const HALL_PRICES = {
  VIP: 30000,
  ESTANDAR: 15000,
  IMAX: 20000,
  '4DX': 22000,
};

const mockStats: AdminStats = {
  totalMovies: 0,
  totalShowtimes: 0,
  totalReservations: 0,
  totalRevenue: 0,
};

export const useAdminStore = create<AdminStore>((set, get) => ({
  // State
  showtimes: [],
  halls: mockHalls,
  stats: mockStats,
  isLoading: false,
  error: null,

  // Helper function para obtener precio por tipo de sala
  getDefaultPriceByHall: (hallId: string) => {
    const hall = mockHalls.find(h => h.id === hallId);
    if (!hall) return HALL_PRICES.ESTANDAR;
    
    if (hall.name.includes('VIP')) return HALL_PRICES.VIP;
    if (hall.name.includes('IMAX')) return HALL_PRICES.IMAX;
    if (hall.name.includes('4DX')) return HALL_PRICES['4DX'];
    return HALL_PRICES.ESTANDAR;
  },

  // Actions
  fetchShowtimes: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('http://localhost:8084/api/showtimes');
      
      if (!response.ok) {
        throw new Error('Failed to fetch showtimes');
      }

      const showtimes: Showtime[] = await response.json();
      
      // Enriquecer con información adicional
      const { halls } = get();
      const enrichedShowtimes = showtimes.map(showtime => {
        const hall = halls.find(h => h.id === showtime.hallId);
        return {
          ...showtime,
          hallName: hall?.name || 'Sala desconocida',
          availableSeats: showtime.availableSeats || 100,
          totalSeats: showtime.totalSeats || 100,
        };
      });

      set({ showtimes: enrichedShowtimes, isLoading: false });
    } catch (error) {
      console.warn('Showtime service not available, using empty list');
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch showtimes',
        isLoading: false,
        showtimes: []
      });
    }
  },

  fetchShowtimesByMovie: async (movieId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:8084/api/showtimes/movie/${movieId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch showtimes for movie');
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

  createShowtime: async (showtimeData: CreateShowtimeRequest) => {
    set({ isLoading: true, error: null });
    try {
      const { halls } = get();
      const hall = halls.find(h => h.id === showtimeData.hallId);
      
      const response = await fetch('http://localhost:8084/api/showtimes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(showtimeData),
      });

      if (!response.ok) {
        throw new Error('Failed to create showtime');
      }

      const newShowtime: Showtime = await response.json();
      
      // Agregar información adicional para la tabla
      const enrichedShowtime = {
        ...newShowtime,
        hallName: hall?.name || 'Sala desconocida',
        availableSeats: hall?.capacity || 100,
        totalSeats: hall?.capacity || 100,
      };

      set(state => ({
        showtimes: [...state.showtimes, enrichedShowtime],
        isLoading: false,
      }));

      // Notificar al movieStore para sincronizar
      await notifyMovieStore();
    } catch (error) {
      // Para desarrollo, creamos la función localmente si el servicio no está disponible
      console.warn('Showtime service not available, creating locally');
      const { halls } = get();
      const hall = halls.find(h => h.id === showtimeData.hallId);
      
      const newShowtime: Showtime = {
        id: Date.now().toString(),
        ...showtimeData,
        hallName: hall?.name || 'Sala desconocida',
        availableSeats: hall?.capacity || 100,
        totalSeats: hall?.capacity || 100,
      };

      set(state => ({
        showtimes: [...state.showtimes, newShowtime],
        isLoading: false,
        error: null,
      }));

      // Notificar al movieStore para sincronizar
      await notifyMovieStore();
    }
  },

  updateShowtime: async (id: string, showtimeData: CreateShowtimeRequest) => {
    set({ isLoading: true, error: null });
    try {
      const { halls } = get();
      const hall = halls.find(h => h.id === showtimeData.hallId);
      
      const response = await fetch(`http://localhost:8084/api/showtimes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(showtimeData),
      });

      if (!response.ok) {
        throw new Error('Failed to update showtime');
      }

      const updatedShowtime: Showtime = await response.json();
      
      const enrichedShowtime = {
        ...updatedShowtime,
        hallName: hall?.name || 'Sala desconocida',
      };

      set(state => ({
        showtimes: state.showtimes.map(showtime =>
          showtime.id === id ? enrichedShowtime : showtime
        ),
        isLoading: false,
      }));

      // Notificar al movieStore para sincronizar
      await notifyMovieStore();
    } catch (error) {
      // Para desarrollo, actualizamos localmente
      console.warn('Showtime service not available, updating locally');
      const { halls } = get();
      const hall = halls.find(h => h.id === showtimeData.hallId);
      
      set(state => ({
        showtimes: state.showtimes.map(showtime =>
          showtime.id === id
            ? {
                ...showtime,
                ...showtimeData,
                hallName: hall?.name || 'Sala desconocida',
              }
            : showtime
        ),
        isLoading: false,
        error: null,
      }));

      // Notificar al movieStore para sincronizar
      await notifyMovieStore();
    }
  },

  deleteShowtime: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`http://localhost:8084/api/showtimes/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete showtime');
      }

      set(state => ({
        showtimes: state.showtimes.filter(showtime => showtime.id !== id),
        isLoading: false,
      }));

      // Notificar al movieStore para sincronizar
      await notifyMovieStore();
    } catch (error) {
      // Para desarrollo, eliminamos localmente
      console.warn('Showtime service not available, deleting locally');
      set(state => ({
        showtimes: state.showtimes.filter(showtime => showtime.id !== id),
        isLoading: false,
        error: null,
      }));

      // Notificar al movieStore para sincronizar
      await notifyMovieStore();
    }
  },

  fetchHalls: async () => {
    // Por ahora usamos datos mock, más adelante se conectará al hall-service
    set({ halls: mockHalls });
  },

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      // Estadísticas calculadas desde múltiples servicios
      const [moviesResponse, showtimesResponse] = await Promise.allSettled([
        fetch('http://localhost:8083/api/movies'),
        fetch('http://localhost:8084/api/showtimes'),
      ]);

      let totalMovies = 0;
      let totalShowtimes = 0;

      if (moviesResponse.status === 'fulfilled' && moviesResponse.value.ok) {
        const movies = await moviesResponse.value.json();
        totalMovies = movies.length;
      }

      if (showtimesResponse.status === 'fulfilled' && showtimesResponse.value.ok) {
        const showtimes = await showtimesResponse.value.json();
        totalShowtimes = showtimes.length;
      } else {
        // Si el servicio no está disponible, usar datos locales
        const { showtimes } = get();
        totalShowtimes = showtimes.length;
      }

      const stats: AdminStats = {
        totalMovies,
        totalShowtimes,
        totalReservations: 0, // Se calculará cuando esté el reservation service
        totalRevenue: 0, // Se calculará cuando esté el reservation service
      };

      set({ stats, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch stats',
        isLoading: false,
      });
    }
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

// Función helper para notificar al movieStore sobre cambios
async function notifyMovieStore() {
  try {
    const { useMovieStore } = await import('./movieStore');
    const movieState = useMovieStore.getState();
    // Trigger re-fetch if there's a selected movie
    if (movieState.selectedMovie) {
      movieState.fetchShowtimes(movieState.selectedMovie.id);
    }
  } catch (error) {
    console.warn('Could not notify movieStore:', error);
  }
} 