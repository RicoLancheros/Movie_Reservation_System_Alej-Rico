import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Download, Calendar, Clock, MapPin, Ticket, QrCode, Home } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';

interface ReservationDetails {
  id: string;
  movieTitle: string;
  date: string;
  time: string;
  theater: string;
  seats: string[];
  totalPrice: number;
  ticketNumber: string;
}

export function ConfirmationPage() {
  const { reservationId } = useParams();
  const { user } = useAuthStore();
  const [reservation, setReservation] = useState<ReservationDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReservationData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockReservation: ReservationDetails = {
        id: reservationId || '1',
        movieTitle: 'Avengers: Endgame',
        date: '2024-01-25',
        time: '19:30',
        theater: 'Sala VIP 1',
        seats: ['F8', 'F9'],
        totalPrice: 60000,
        ticketNumber: `TCK${Date.now().toString().slice(-6)}`
      };
      
      setReservation(mockReservation);
      setLoading(false);
    };

    loadReservationData();
  }, [reservationId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando detalles de tu reserva...</p>
        </div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Reserva no encontrada</h1>
        <p className="text-gray-600 mb-6">No se pudo encontrar la información de tu reserva.</p>
        <Button onClick={() => window.location.href = '/'}>
          Volver al inicio
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Reserva Confirmada!</h1>
          <p className="text-gray-600 text-lg">Tu ticket digital ha sido generado exitosamente</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">🎬 CineReserva</h2>
                <p className="text-primary-100">Ticket Digital</p>
              </div>
              <div className="text-right">
                <p className="text-primary-100 text-sm">Número de Ticket</p>
                <p className="text-xl font-mono font-bold">{reservation.ticketNumber}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{reservation.movieTitle}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-3 text-primary-600" />
                <div>
                  <p className="font-medium">{reservation.date}</p>
                  <p className="text-sm text-gray-500">Fecha</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Clock className="w-5 h-5 mr-3 text-primary-600" />
                <div>
                  <p className="font-medium">{reservation.time}</p>
                  <p className="text-sm text-gray-500">Hora</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <MapPin className="w-5 h-5 mr-3 text-primary-600" />
                <div>
                  <p className="font-medium">{reservation.theater}</p>
                  <p className="text-sm text-gray-500">Sala</p>
                </div>
              </div>
              
              <div className="flex items-center text-gray-600">
                <Ticket className="w-5 h-5 mr-3 text-primary-600" />
                <div>
                  <p className="font-medium">Asientos: {reservation.seats.join(', ')}</p>
                  <p className="text-sm text-gray-500">{reservation.seats.length} entrada(s)</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total Pagado:</span>
                <span className="text-2xl font-bold text-green-600">{formatPrice(reservation.totalPrice)}</span>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <QrCode className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <p className="text-sm text-gray-600">Presenta este ticket en el cine</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/profile?tab=reservations">
            <Button variant="ghost" className="flex items-center space-x-2">
              <Ticket className="w-4 h-4" />
              <span>Ver Mis Reservas</span>
            </Button>
          </Link>
          
          <Link to="/">
            <Button className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span>Reservar Otra Película</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 