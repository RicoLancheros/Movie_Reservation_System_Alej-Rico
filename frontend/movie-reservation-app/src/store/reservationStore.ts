import { create } from 'zustand';
import type { Seat, Reservation, CreateReservationRequest, PaymentData, PaymentResponse } from '../types';

interface ReservationState {
  selectedSeats: Seat[];
  currentShowtimeId: string | null;
  seatMap: Seat[][];
  reservations: Reservation[];
  isLoading: boolean;
  error: string | null;
  totalPrice: number;
}

interface ReservationActions {
  selectSeat: (seat: Seat) => void;
  deselectSeat: (seatId: string) => void;
  clearSelectedSeats: () => void;
  fetchSeatMap: (showtimeId: string) => Promise<void>;
  createReservation: (paymentData: PaymentData) => Promise<PaymentResponse>;
  fetchUserReservations: () => Promise<void>;
  cancelReservation: (reservationId: string) => Promise<void>;
  setCurrentShowtime: (showtimeId: string) => void;
  calculateTotalPrice: (pricePerSeat: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

type ReservationStore = ReservationState & ReservationActions;

export const useReservationStore = create<ReservationStore>((set, get) => ({
  // State
  selectedSeats: [],
  currentShowtimeId: null,
  seatMap: [],
  reservations: [],
  isLoading: false,
  error: null,
  totalPrice: 0,

  // Actions
  selectSeat: (seat) => {
    const { selectedSeats } = get();
    if (seat.status === 'available' || seat.status === 'accessible') {
      const updatedSeat = { ...seat, status: 'selected' as const };
      set({
        selectedSeats: [...selectedSeats, updatedSeat],
      });
    }
  },

  deselectSeat: (seatId) => {
    const { selectedSeats } = get();
    set({
      selectedSeats: selectedSeats.filter(seat => seat.id !== seatId),
    });
  },

  clearSelectedSeats: () => {
    set({ selectedSeats: [], totalPrice: 0 });
  },

  fetchSeatMap: async (showtimeId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/showtimes/${showtimeId}/seats`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch seat map');
      }

      const seatMap: Seat[][] = await response.json();
      set({ seatMap, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch seat map',
        isLoading: false,
      });
    }
  },

  createReservation: async (paymentData) => {
    const { selectedSeats, currentShowtimeId } = get();
    set({ isLoading: true, error: null });
    
    try {
      if (!currentShowtimeId || selectedSeats.length === 0) {
        throw new Error('No showtime or seats selected');
      }

      // Simulate payment processing
      const paymentResponse = await fetch('/api/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!paymentResponse.ok) {
        throw new Error('Payment failed');
      }

      const payment: PaymentResponse = await paymentResponse.json();

      if (payment.success) {
        // Create reservation
        const reservationData: CreateReservationRequest = {
          showtimeId: currentShowtimeId,
          seatIds: selectedSeats.map(seat => seat.id),
        };

        const reservationResponse = await fetch('/api/reservations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reservationData),
        });

        if (!reservationResponse.ok) {
          throw new Error('Failed to create reservation');
        }

        set({ 
          selectedSeats: [], 
          totalPrice: 0, 
          isLoading: false 
        });

        return payment;
      } else {
        throw new Error(payment.message || 'Payment failed');
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Reservation failed',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchUserReservations: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/reservations/user');
      
      if (!response.ok) {
        throw new Error('Failed to fetch reservations');
      }

      const reservations: Reservation[] = await response.json();
      set({ reservations, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch reservations',
        isLoading: false,
      });
    }
  },

  cancelReservation: async (reservationId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/reservations/${reservationId}/cancel`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to cancel reservation');
      }

      const { reservations } = get();
      set({
        reservations: reservations.map(reservation =>
          reservation.id === reservationId
            ? { ...reservation, status: 'cancelled' as const }
            : reservation
        ),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to cancel reservation',
        isLoading: false,
      });
    }
  },

  setCurrentShowtime: (showtimeId) => {
    set({ currentShowtimeId: showtimeId });
  },

  calculateTotalPrice: (pricePerSeat) => {
    const { selectedSeats } = get();
    set({ totalPrice: selectedSeats.length * pricePerSeat });
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
})); 