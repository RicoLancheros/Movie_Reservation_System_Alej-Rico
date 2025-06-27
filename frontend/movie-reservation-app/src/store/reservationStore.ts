import { create } from 'zustand';
import type { Seat, Reservation, CreateReservationRequest, PaymentData, PaymentResponse } from '../types';

interface ReservationState {
  selectedSeats: Seat[];
  currentShowtimeId: string | null;
  seatMap: Seat[][];
  reservations: Reservation[];
  occupiedSeats: { [showtimeId: string]: string[] };
  lastReservation: Reservation | null;
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
  markSeatsAsOccupied: (showtimeId: string, seatIds: string[]) => void;
  initializeMockData: () => void;
  getReservationByTransactionId: (transactionId: string) => Reservation | null;
}

type ReservationStore = ReservationState & ReservationActions;

const generateMockSeatMap = (occupiedSeatIds: string[] = []): Seat[][] => {
  const rows = 8;
  const seatsPerRow = 12;
  const seatMap: Seat[][] = [];
  
  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    const row: Seat[] = [];
    const rowLetter = String.fromCharCode(65 + rowIndex);
    
    for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
      const seatId = `${rowLetter}${seatNum}`;
      let status: 'available' | 'occupied' | 'disabled' | 'accessible' = 'available';
      let type: 'regular' | 'accessible' | 'vip' = 'regular';
      
      if (occupiedSeatIds.includes(seatId)) {
        status = 'occupied';
      }
      
      if (rowIndex < 2) {
        type = 'vip';
      }
      
      if ((rowIndex === 3 || rowIndex === 4) && (seatNum === 1 || seatNum === 12)) {
        type = 'accessible';
        status = status === 'occupied' ? 'occupied' : 'accessible';
      }
      
      if ((rowIndex === 6 && seatNum === 6) || (rowIndex === 7 && seatNum === 7)) {
        status = 'disabled';
      }
      
      row.push({
        id: seatId,
        row: rowLetter,
        number: seatNum,
        status,
        type,
        price: type === 'vip' ? 25000 : type === 'accessible' ? 12000 : 15000
      });
    }
    
    seatMap.push(row);
  }
  
  return seatMap;
};

export const useReservationStore = create<ReservationStore>((set, get) => ({
  selectedSeats: [],
  currentShowtimeId: null,
  seatMap: [],
  reservations: [],
  occupiedSeats: {},
  lastReservation: null,
  isLoading: false,
  error: null,
  totalPrice: 0,

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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { occupiedSeats } = get();
      const occupiedSeatIds = occupiedSeats[showtimeId] || [];
      
      const seatMap = generateMockSeatMap(occupiedSeatIds);
      set({ seatMap, isLoading: false, currentShowtimeId: showtimeId });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch seat map',
        isLoading: false,
      });
    }
  },

  createReservation: async (paymentData) => {
    const { selectedSeats, currentShowtimeId } = get();
    
    console.log('🏪 Estado del store en createReservation:', {
      currentShowtimeId,
      selectedSeatsCount: selectedSeats.length,
      selectedSeatIds: selectedSeats.map(s => s.id)
    });
    
    set({ isLoading: true, error: null });
    
    try {
      if (!currentShowtimeId || selectedSeats.length === 0) {
        console.error('❌ Validación fallida en createReservation:', {
          hasShowtime: !!currentShowtimeId,
          seatsCount: selectedSeats.length
        });
        throw new Error('No showtime or seats selected');
      }

      console.log('✅ Validación exitosa, procesando pago...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transactionId = `TXN-${Date.now()}`;
      const reservationId = `RES-${Date.now()}`;
      
      const authStore = JSON.parse(localStorage.getItem('auth-store') || '{}');
      const currentUserId = authStore?.state?.user?.id || 'guest';
      
      const payment: PaymentResponse = {
        success: true,
        transactionId,
        amount: get().totalPrice,
        currency: 'COP',
        paymentMethod: paymentData.method,
        message: 'Pago procesado exitosamente'
      };

      if (payment.success) {
        const seatIds = selectedSeats.map(seat => seat.id);
        get().markSeatsAsOccupied(currentShowtimeId, seatIds);
        
        const newReservation: Reservation = {
          id: reservationId,
          userId: currentUserId,
          showtimeId: currentShowtimeId,
          seatIds: seatIds,
          totalPrice: get().totalPrice,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          transactionId: transactionId
        };

        const reservationData = JSON.parse(localStorage.getItem('reservationData') || '{}');
        const completeReservationData = {
          ...newReservation,
          movie: reservationData.movie,
          showtime: reservationData.showtime,
          selectedSeats: selectedSeats,
          paymentData: {
            ...paymentData,
            cardNumber: `****-****-****-${paymentData.cardNumber.slice(-4)}`
          }
        };
        
        localStorage.setItem(`reservation_${transactionId}`, JSON.stringify(completeReservationData));

        const userReservationsKey = `user_reservations_${currentUserId}`;
        const existingReservations = JSON.parse(localStorage.getItem(userReservationsKey) || '[]');
        const updatedReservations = [...existingReservations, completeReservationData];
        localStorage.setItem(userReservationsKey, JSON.stringify(updatedReservations));

        const { reservations } = get();
        set({ 
          reservations: [...reservations, newReservation],
          lastReservation: newReservation,
          selectedSeats: [], 
          totalPrice: 0, 
          isLoading: false 
        });

        console.log('💰 Pago procesado exitosamente:', transactionId);
        console.log('👤 Reserva guardada para usuario:', currentUserId);
        return payment;
      } else {
        throw new Error(payment.message || 'Payment failed');
      }
    } catch (error) {
      console.error('💥 Error en createReservation:', error);
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { reservations } = get();
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
      await new Promise(resolve => setTimeout(resolve, 500));

      const { reservations } = get();
      const reservation = reservations.find(r => r.id === reservationId);
      
      if (reservation) {
        const { occupiedSeats } = get();
        const currentOccupied = occupiedSeats[reservation.showtimeId] || [];
        const updatedOccupied = currentOccupied.filter(seatId => 
          !reservation.seatIds.includes(seatId)
        );
        
        set({
          occupiedSeats: {
            ...occupiedSeats,
            [reservation.showtimeId]: updatedOccupied
          },
          reservations: reservations.map(r =>
            r.id === reservationId
              ? { ...r, status: 'cancelled' as const }
              : r
          ),
          isLoading: false,
        });
      }
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
    const total = selectedSeats.reduce((sum, seat) => sum + (seat.price || pricePerSeat), 0);
    set({ totalPrice: total });
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  markSeatsAsOccupied: (showtimeId, seatIds) => {
    const { occupiedSeats } = get();
    const currentOccupied = occupiedSeats[showtimeId] || [];
    const updatedOccupied = [...new Set([...currentOccupied, ...seatIds])];
    
    set({
      occupiedSeats: {
        ...occupiedSeats,
        [showtimeId]: updatedOccupied
      }
    });
  },

  initializeMockData: () => {
    const mockOccupiedSeats = {
      '1': ['A5', 'A6', 'B3', 'B4', 'C7', 'C8'],
      '2': ['A1', 'A2', 'D5', 'D6', 'E9', 'E10'],
      '3': ['B7', 'B8', 'C5', 'C6', 'F1', 'F2'],
    };
    
    set({ occupiedSeats: mockOccupiedSeats });
  },

  getReservationByTransactionId: (transactionId: string) => {
    try {
      const reservationData = localStorage.getItem(`reservation_${transactionId}`);
      return reservationData ? JSON.parse(reservationData) : null;
    } catch (error) {
      console.error('Error getting reservation by transaction ID:', error);
      return null;
    }
  },
})); 