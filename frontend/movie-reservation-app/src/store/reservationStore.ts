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
  migrateToGlobalReservations: () => void;
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
      
      // Cargar asientos ocupados desde el backend
      let backendOccupiedSeats: string[] = [];
      try {
        const reservationsResponse = await fetch('http://localhost:8082/api/reservations');
        if (reservationsResponse.ok) {
          const reservations = await reservationsResponse.json();
          // Filtrar reservas por showtime y extraer seatIds
          const showtimeReservations = reservations.filter((r: any) => 
            r.showtimeId === showtimeId && r.status === 'confirmed'
          );
          backendOccupiedSeats = showtimeReservations.flatMap((r: any) => r.seatIds || []);
          console.log('✅ Asientos ocupados desde backend:', backendOccupiedSeats);
        } else {
          console.warn('⚠️ No se pudieron cargar reservas del backend');
        }
      } catch (error) {
        console.warn('⚠️ Error al cargar reservas del backend:', error);
      }
      
      // Cargar asientos de reservas locales de TODOS los usuarios
      let localReservedSeats: string[] = [];
      try {
        // NUEVO: Cargar reservas globales en lugar de solo del usuario actual
        const globalReservations = JSON.parse(localStorage.getItem('global_reservations') || '[]');
        
        // Filtrar por showtime y extraer seatIds de TODAS las reservas confirmadas
        const showtimeGlobalReservations = globalReservations.filter((r: any) => 
          r.showtimeId === showtimeId && r.status === 'confirmed'
        );
        localReservedSeats = showtimeGlobalReservations.flatMap((r: any) => r.seatIds || []);
        
        console.log('🌍 Asientos ocupados globalmente:', localReservedSeats);
        console.log('📊 Total reservas globales para showtime:', showtimeGlobalReservations.length);
      } catch (error) {
        console.warn('⚠️ Error al cargar reservas globales:', error);
      }
      
      // Combinar con asientos ocupados del store
      const { occupiedSeats } = get();
      const storeOccupiedSeats = occupiedSeats[showtimeId] || [];
      
      // Combinar todas las fuentes de asientos ocupados
      const allOccupiedSeats = [...new Set([
        ...storeOccupiedSeats, 
        ...backendOccupiedSeats, 
        ...localReservedSeats
      ])];
      
      console.log('🎯 Total asientos ocupados (todos los usuarios):', allOccupiedSeats);
      
      // Actualizar occupiedSeats con todos los datos
      set({
        occupiedSeats: {
          ...occupiedSeats,
          [showtimeId]: allOccupiedSeats
        }
      });
      
      const seatMap = generateMockSeatMap(allOccupiedSeats);
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
        
        // Crear reserva en el backend
        try {
          const reservationRequest = {
            userId: currentUserId,
            showtimeId: currentShowtimeId,
            seatIds: seatIds
          };
          
          const backendResponse = await fetch('http://localhost:8082/api/reservations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservationRequest)
          });
          
          if (backendResponse.ok) {
            console.log('✅ Reserva guardada en el backend');
          } else {
            console.warn('⚠️ No se pudo guardar en el backend, continuando con localStorage');
          }
        } catch (error) {
          console.warn('⚠️ Error al conectar con el backend:', error);
        }
        
        // Marcar asientos como ocupados
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

        // Guardar en reservas del usuario específico
        const userReservationsKey = `user_reservations_${currentUserId}`;
        const existingReservations = JSON.parse(localStorage.getItem(userReservationsKey) || '[]');
        const updatedReservations = [...existingReservations, completeReservationData];
        localStorage.setItem(userReservationsKey, JSON.stringify(updatedReservations));

        // NUEVO: Guardar también en reservas globales para sincronización
        const globalReservations = JSON.parse(localStorage.getItem('global_reservations') || '[]');
        const updatedGlobalReservations = [...globalReservations, completeReservationData];
        localStorage.setItem('global_reservations', JSON.stringify(updatedGlobalReservations));
        console.log('🌍 Reserva guardada en sistema global:', completeReservationData.id);

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
    const { occupiedSeats, seatMap } = get();
    const currentOccupied = occupiedSeats[showtimeId] || [];
    const updatedOccupied = [...new Set([...currentOccupied, ...seatIds])];
    
    // Actualizar el mapa de asientos para reflejar los nuevos asientos ocupados
    const updatedSeatMap = seatMap.map(row =>
      row.map(seat => {
        if (seatIds.includes(seat.id)) {
          return { ...seat, status: 'occupied' as const };
        }
        return seat;
      })
    );
    
    set({
      occupiedSeats: {
        ...occupiedSeats,
        [showtimeId]: updatedOccupied
      },
      seatMap: updatedSeatMap
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

  // NUEVA FUNCIÓN: Migrar reservas existentes al sistema global
  migrateToGlobalReservations: () => {
    try {
      const globalReservations = JSON.parse(localStorage.getItem('global_reservations') || '[]');
      
      // Si ya existen reservas globales, no migrar
      if (globalReservations.length > 0) {
        console.log('🌍 Sistema global ya tiene reservas:', globalReservations.length);
        return;
      }

      console.log('🔄 Migrando reservas existentes al sistema global...');
      let migratedCount = 0;

      // Buscar todas las claves que empiecen con 'user_reservations_'
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('user_reservations_')) {
          const userReservations = JSON.parse(localStorage.getItem(key) || '[]');
          globalReservations.push(...userReservations);
          migratedCount += userReservations.length;
        }
      }

      // Guardar las reservas migradas
      localStorage.setItem('global_reservations', JSON.stringify(globalReservations));
      console.log(`✅ Migración completada: ${migratedCount} reservas migradas al sistema global`);
    } catch (error) {
      console.warn('⚠️ Error durante la migración:', error);
    }
  },
}));

// Ejecutar migración automáticamente al cargar el store
if (typeof window !== 'undefined') {
  const store = useReservationStore.getState();
  store.migrateToGlobalReservations();
} 