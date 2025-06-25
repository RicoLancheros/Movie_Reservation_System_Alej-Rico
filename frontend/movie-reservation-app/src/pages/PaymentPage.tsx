import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Lock, Calendar, User } from 'lucide-react';
import type { Movie, Showtime, Seat } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

interface ReservationData {
  movie: Movie;
  showtime: Showtime;
  selectedSeats: Seat[];
  totalPrice: number;
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
  const [reservationData, setReservationData] = useState<ReservationData | null>(null);
  const [formData, setFormData] = useState<PaymentForm>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    phone: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<PaymentForm>>({});

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('reservationData');
      if (storedData) {
        const parsed = JSON.parse(storedData) as ReservationData;
        setReservationData(parsed);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error loading reservation data:', error);
      navigate('/');
    }
  }, [navigate]);

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
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Crear ticket de reserva
      const reservationId = `RES-${Date.now()}`;
      const ticket = {
        id: reservationId,
        movie: reservationData!.movie,
        showtime: reservationData!.showtime,
        seats: reservationData!.selectedSeats,
        totalPrice: reservationData!.totalPrice,
        customerInfo: {
          name: formData.cardholderName,
          email: formData.email,
          phone: formData.phone
        },
        paymentInfo: {
          cardNumber: `****-****-****-${formData.cardNumber.slice(-4)}`,
          transactionId: `TXN-${Date.now()}`
        },
        purchaseDate: new Date().toISOString(),
        status: 'confirmed'
      };

      // Guardar ticket en localStorage
      localStorage.setItem('currentTicket', JSON.stringify(ticket));
      
      // Limpiar datos de reserva temporal
      localStorage.removeItem('reservationData');
      localStorage.removeItem('selectedShowtime');
      localStorage.removeItem('selectedMovie');

      // Redirigir a confirmación
      navigate('/confirmation');

    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Error al procesar el pago. Por favor, intenta nuevamente.');
    } finally {
      setIsProcessing(false);
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
          <p className="text-gray-500">Cargando información de pago...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a selección de asientos
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Información de Pago</h2>
                <span className="text-sm text-green-600 font-medium">Seguro</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información Personal */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Personal</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre Completo *
                      </label>
                      <Input
                        name="cardholderName"
                        value={formData.cardholderName}
                        onChange={handleInputChange}
                        placeholder="Nombre como aparece en la tarjeta"
                        icon={<User />}
                        error={errors.cardholderName}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="tu@email.com"
                        error={errors.email}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+57 300 123 4567"
                      error={errors.phone}
                    />
                  </div>
                </div>

                {/* Información de Tarjeta */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Tarjeta</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Tarjeta *
                      </label>
                      <Input
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        icon={<CreditCard />}
                        error={errors.cardNumber}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Fecha de Expiración *
                        </label>
                        <Input
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/AA"
                          icon={<Calendar />}
                          error={errors.expiryDate}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV *
                        </label>
                        <Input
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          error={errors.cvv}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                        Procesando Pago...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Completar Pago - {formatPrice(reservationData.totalPrice)}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen de Compra</h3>
              
              <div className="flex gap-4 mb-6">
                <img
                  src={reservationData.movie.posterImage}
                  alt={reservationData.movie.title}
                  className="w-16 h-24 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Image';
                  }}
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{reservationData.movie.title}</h4>
                  <p className="text-sm text-gray-600">{reservationData.movie.genre}</p>
                  <p className="text-sm text-gray-600">{reservationData.movie.duration} min</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fecha:</span>
                  <span className="text-gray-900">{formatDate(reservationData.showtime.date)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hora:</span>
                  <span className="text-gray-900">{reservationData.showtime.time}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sala:</span>
                  <span className="text-gray-900">{reservationData.showtime.hallId.replace('hall', '')}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Asientos ({reservationData.selectedSeats.length})
                </h4>
                <div className="space-y-2">
                  {reservationData.selectedSeats.map(seat => (
                    <div key={seat.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Fila {seat.row}, Asiento {seat.number}
                      </span>
                      <span className="text-gray-900">{formatPrice(reservationData.showtime.price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-blue-600">
                    {formatPrice(reservationData.totalPrice)}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-600">
                  <Lock className="h-3 w-3 inline mr-1" />
                  Tus datos están protegidos con encriptación SSL
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 