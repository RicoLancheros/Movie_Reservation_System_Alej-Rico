import { create } from 'zustand';
import type { Seat, Reservation, CreateReservationRequest, PaymentData, PaymentResponse } from '../types';

interface ReservationState {
  selectedSeats: Seat[];
  currentShowtimeId: string | null;
  seatMap: Seat[][];
  reservations: Reservation[];
  occupiedSeats: { [showtimeId: string]: string[] };
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
    set({ isLoading: true, error: null });
    
    try {
      if (!currentShowtimeId || selectedSeats.length === 0) {
        throw new Error('No showtime or seats selected');
      }

      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const payment: PaymentResponse = {
        success: true,
        transactionId: `TXN-${Date.now()}`,
        amount: get().totalPrice,
        currency: 'COP',
        paymentMethod: paymentData.method,
        message: 'Pago procesado exitosamente'
      };

      if (payment.success) {
        const seatIds = selectedSeats.map(seat => seat.id);
        get().markSeatsAsOccupied(currentShowtimeId, seatIds);
        
        const newReservation: Reservation = {
          id: `RES-${Date.now()}`,
          userId: 'user-1',
          showtimeId: currentShowtimeId,
          seatIds: seatIds,
          totalPrice: get().totalPrice,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const { reservations } = get();
        set({ 
          reservations: [...reservations, newReservation],
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
})); 