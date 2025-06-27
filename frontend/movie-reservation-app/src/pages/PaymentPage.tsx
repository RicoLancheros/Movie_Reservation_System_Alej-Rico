import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock, Calendar, User } from 'lucide-react';
import type { Movie, Showtime, Seat, PaymentData } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useReservationStore } from '../store/reservationStore';
import { useAuthStore } from '../store/authStore';

interface ReservationData {
  movie: Movie;
  showtime: Showtime;
  selectedSeats: Seat[];
  totalPrice: number;
  showtimeId: string;
}

interface PaymentForm {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  email: string;
  phone: string;
}

export function PaymentPage() {
  const navigate = useNavigate();
  const { 
    createReservation, 
    isLoading: reservationLoading,
    setCurrentShowtime,
    selectSeat,
    clearSelectedSeats,
    calculateTotalPrice
  } = useReservationStore();
  const { user } = useAuthStore();
  
  const [reservationData, setReservationData] = useState<ReservationData | null>(null);
  const [formData, setFormData] = useState<PaymentForm>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<PaymentForm>>({});

  useEffect(() => {
    const setupReservationData = async () => {
      try {
        const storedData = localStorage.getItem('reservationData');
        if (storedData) {
          const parsed = JSON.parse(storedData) as ReservationData;
          setReservationData(parsed);
          
          // Configurar el reservation store con los datos necesarios de manera secuencial
          setCurrentShowtime(parsed.showtimeId);
          clearSelectedSeats();
          
          // Esperar un poco para que el store se actualice
          await new Promise(resolve => setTimeout(resolve, 50));
          
          // Seleccionar asientos uno por uno
          for (const seat of parsed.selectedSeats) {
            selectSeat(seat);
          }
          
          // Calcular precio total después de seleccionar asientos
          setTimeout(() => {
            calculateTotalPrice(parsed.showtime.price);
          }, 100);
          
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error loading reservation data:', error);
        navigate('/');
      }
    };

    setupReservationData();
  }, [navigate, setCurrentShowtime, clearSelectedSeats, selectSeat, calculateTotalPrice]);

  // Llenar datos del usuario si está logueado
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        cardholderName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || prev.cardholderName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Formatear número de tarjeta
    if (name === 'cardNumber') {
      formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19); // 4 grupos de 4 dígitos + 3 espacios
    }

    // Formatear fecha de expiración
    if (name === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .slice(0, 5);
    }

    // Formatear CVV
    if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[name as keyof PaymentForm]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentForm> = {};

    // Validar número de tarjeta
    const cardNumberDigits = formData.cardNumber.replace(/\s/g, '');
    if (!cardNumberDigits || cardNumberDigits.length !== 16) {
      newErrors.cardNumber = 'El número de tarjeta debe tener 16 dígitos';
    }

    // Validar fecha de expiración
    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Formato de fecha inválido (MM/AA)';
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Mes inválido';
      } else if (parseInt(year) < currentYear || 
                (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'La tarjeta está vencida';
      }
    }

    // Validar CVV
    if (!formData.cvv || formData.cvv.length < 3) {
      newErrors.cvv = 'CVV debe tener 3 o 4 dígitos';
    }

    // Validar nombre del titular
    if (!formData.cardholderName.trim()) {
      newErrors.cardholderName = 'Nombre del titular es requerido';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Email válido es requerido';
    }

    // Validar teléfono
    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = 'Teléfono válido es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !reservationData) {
      return;
    }

    setIsProcessing(true);

    try {
      console.log('🔄 Configurando store antes del pago...');
      console.log('📊 Datos de reserva:', reservationData);
      
      // Obtener el estado actual del store
      const store = useReservationStore.getState();
      
      // Configurar directamente usando el estado del store
      console.log('🎬 Configurando showtime:', reservationData.showtimeId);
      store.setCurrentShowtime(reservationData.showtimeId);
      
      // Limpiar asientos seleccionados
      console.log('🧹 Limpiando asientos seleccionados...');
      store.clearSelectedSeats();
      
      // Seleccionar asientos directamente
      console.log('🪑 Seleccionando asientos:', reservationData.selectedSeats.map(s => s.id));
      for (const seat of reservationData.selectedSeats) {
        console.log('➕ Seleccionando asiento:', seat.id);
        store.selectSeat(seat);
      }
      
      // Calcular precio total
      console.log('💰 Calculando precio total...');
      store.calculateTotalPrice(reservationData.showtime.price);
      
      // Verificar el estado final
      const finalState = useReservationStore.getState();
      console.log('🔍 Estado final del store:', {
        currentShowtimeId: finalState.currentShowtimeId,
        selectedSeatsCount: finalState.selectedSeats.length,
        selectedSeatIds: finalState.selectedSeats.map(s => s.id),
        totalPrice: finalState.totalPrice
      });
      
      // Verificar que todo esté configurado correctamente
      if (!finalState.currentShowtimeId || finalState.selectedSeats.length === 0) {
        console.error('❌ Store no configurado correctamente después de configuración directa');
        
        // Intento alternativo: configurar manualmente el estado
        console.log('🔄 Intentando configuración alternativa...');
        
        // Crear el estado manualmente para el pago
        const manualState = {
          currentShowtimeId: reservationData.showtimeId,
          selectedSeats: reservationData.selectedSeats,
          totalPrice: reservationData.totalPrice
        };
        
        // Usar una función de createReservation modificada que acepte parámetros
        const paymentData: PaymentData = {
          cardNumber: formData.cardNumber.replace(/\s/g, ''),
          expiryDate: formData.expiryDate,
          cvv: formData.cvv,
          cardholderName: formData.cardholderName,
          method: 'credit'
        };
        
        // Procesar pago con datos manuales
        const paymentResponse = await processManualReservation(manualState, paymentData);
        
        if (paymentResponse.success) {
          console.log('🎉 Pago exitoso con configuración manual, redirigiendo...');
          
          // Limpiar datos de reserva temporal
          localStorage.removeItem('reservationData');
          localStorage.removeItem('selectedShowtime');
          localStorage.removeItem('selectedMovie');

          // Redirigir a confirmación con el ID de la transacción
          navigate(`/confirmation/${paymentResponse.transactionId}`);
          return;
        } else {
          throw new Error(paymentResponse.message || 'Error en el pago');
        }
      }
      
      console.log('✅ Store configurado correctamente, procesando pago...');
      
      // Preparar datos de pago
      const paymentData: PaymentData = {
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
        cardholderName: formData.cardholderName,
        method: 'credit'
      };

      // Procesar pago y crear reserva
      const paymentResponse = await createReservation(paymentData);

      if (paymentResponse.success) {
        console.log('🎉 Pago exitoso, redirigiendo...');
        
        // Limpiar datos de reserva temporal
        localStorage.removeItem('reservationData');
        localStorage.removeItem('selectedShowtime');
        localStorage.removeItem('selectedMovie');

        // Redirigir a confirmación con el ID de la transacción
        navigate(`/confirmation/${paymentResponse.transactionId}`);
      } else {
        throw new Error(paymentResponse.message || 'Error en el pago');
      }

    } catch (error) {
      console.error('❌ Error processing payment:', error);
      alert(`Error al procesar el pago: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Función auxiliar para procesar pago manualmente
  const processManualReservation = async (manualState: any, paymentData: PaymentData) => {
    try {
      console.log('🔧 Procesando reserva manual con estado:', manualState);
      
      // Simular el procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const transactionId = `TXN-${Date.now()}`;
      const reservationId = `RES-${Date.now()}`;
      
      // Obtener el usuario actual
      const currentUserId = user?.id || 'guest';
      
      const payment = {
        success: true,
        transactionId,
        amount: manualState.totalPrice,
        currency: 'COP',
        paymentMethod: paymentData.method,
        message: 'Pago procesado exitosamente'
      };
      
      if (payment.success) {
        // Marcar asientos como ocupados
        const store = useReservationStore.getState();
        const seatIds = manualState.selectedSeats.map((seat: any) => seat.id);
        store.markSeatsAsOccupied(manualState.currentShowtimeId, seatIds);
        
        // Crear nueva reserva
        const newReservation = {
          id: reservationId,
          userId: currentUserId, // Usar el ID del usuario actual
          showtimeId: manualState.currentShowtimeId,
          seatIds: seatIds,
          totalPrice: manualState.totalPrice,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          transactionId: transactionId
        };

        // Guardar datos completos de la reserva
        const completeReservationData = {
          ...newReservation,
          movie: reservationData?.movie,
          showtime: reservationData?.showtime,
          selectedSeats: manualState.selectedSeats,
          paymentData: {
            ...paymentData,
            cardNumber: `****-****-****-${paymentData.cardNumber.slice(-4)}`
          }
        };
        
        localStorage.setItem(`reservation_${transactionId}`, JSON.stringify(completeReservationData));
        
        // Guardar también en la lista de reservas del usuario
        const userReservationsKey = `user_reservations_${currentUserId}`;
        const existingReservations = JSON.parse(localStorage.getItem(userReservationsKey) || '[]');
        const updatedReservations = [...existingReservations, completeReservationData];
        localStorage.setItem(userReservationsKey, JSON.stringify(updatedReservations));
        
        console.log('💰 Reserva manual procesada exitosamente:', transactionId);
        console.log('👤 Reserva guardada para usuario:', currentUserId);
        return payment;
      }
      
      throw new Error('Payment failed');
    } catch (error) {
      console.error('💥 Error en reserva manual:', error);
      throw error;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!reservationData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Cargando información de pago...</p>
          <Button onClick={() => navigate('/')}>
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/seats/${reservationData.showtimeId}`)}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a selección de asientos
        </Button>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Información de Pago</h1>
        <p className="text-gray-600">Completa los datos para confirmar tu reserva</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Datos de la Tarjeta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Tarjeta
              </label>
              <Input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                error={errors.cardNumber}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Vencimiento
                </label>
                <Input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/AA"
                  error={errors.expiryDate}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <Input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  error={errors.cvv}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Titular
              </label>
              <Input
                type="text"
                name="cardholderName"
                value={formData.cardholderName}
                onChange={handleInputChange}
                placeholder="Como aparece en la tarjeta"
                error={errors.cardholderName}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email de Confirmación
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="tu@email.com"
                error={errors.email}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+57 300 123 4567"
                error={errors.phone}
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isProcessing || reservationLoading}
              className="w-full"
            >
              {isProcessing || reservationLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando Pago...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Confirmar Pago ({formatPrice(reservationData.totalPrice)})
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-800 flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Tu información está protegida con encriptación SSL
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Resumen de tu Compra</h2>

          <div className="space-y-6">
            {/* Movie Info */}
            <div className="flex gap-4">
              <img
                src={reservationData.movie.posterImage}
                alt={reservationData.movie.title}
                className="w-16 h-24 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Image';
                }}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{reservationData.movie.title}</h3>
                <p className="text-gray-600 text-sm">{reservationData.movie.genre}</p>
                <p className="text-gray-600 text-sm">{reservationData.movie.duration} min</p>
              </div>
            </div>

            {/* Showtime Info */}
            <div className="border-t pt-4">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{formatDate(reservationData.showtime.date)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{reservationData.showtime.time}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-4 w-4" />
                <span className="text-sm">{reservationData.showtime.hallName || `Sala ${reservationData.showtime.hallId}`}</span>
              </div>
            </div>

            {/* Seats */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-900 mb-2">Asientos seleccionados:</p>
              <div className="flex flex-wrap gap-2">
                {reservationData.selectedSeats.map((seat) => (
                  <span
                    key={seat.id}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {seat.row}{seat.number}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {reservationData.selectedSeats.length} entrada{reservationData.selectedSeats.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-green-600">
                  {formatPrice(reservationData.totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 