import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Calendar, Clock, MapPin, Ticket, QrCode, Home, Share2, Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { useReservationStore } from '../store/reservationStore';

interface TicketData {
  id: string;
  movie: {
    title: string;
    genre: string;
    duration: number;
    posterImage: string;
  };
  showtime: {
    date: string;
    time: string;
    hallName?: string;
    hallId: string;
  };
  selectedSeats: Array<{
    id: string;
    row: string;
    number: number;
    type: string;
    price: number;
  }>;
  totalPrice: number;
  paymentData: {
    cardholderName: string;
    cardNumber: string;
  };
  ticketNumber: string;
  transactionId: string;
  purchaseDate: string;
}

export function ConfirmationPage() {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getReservationByTransactionId } = useReservationStore();
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTicketData = async () => {
      if (!transactionId) {
        setError('ID de transacción no válido');
        setLoading(false);
        return;
      }

      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular carga

      try {
        const reservationData = getReservationByTransactionId(transactionId);
        
        if (!reservationData) {
          setError('No se encontró la reserva');
          setLoading(false);
          return;
        }

        const ticket: TicketData = {
          id: reservationData.id,
          movie: reservationData.movie,
          showtime: reservationData.showtime,
          selectedSeats: reservationData.selectedSeats,
          totalPrice: reservationData.totalPrice,
          paymentData: reservationData.paymentData,
          ticketNumber: `TCK${reservationData.id.slice(-6)}`,
          transactionId: transactionId,
          purchaseDate: reservationData.createdAt
        };

        setTicketData(ticket);
      } catch (error) {
        console.error('Error loading ticket data:', error);
        setError('Error al cargar los datos del ticket');
      } finally {
        setLoading(false);
      }
    };

    loadTicketData();
  }, [transactionId, getReservationByTransactionId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    try {
      const [hours, minutes] = timeString.split(':');
      return `${hours}:${minutes}`;
    } catch {
      return timeString;
    }
  };

  const handleDownload = () => {
    alert('Función de descarga en desarrollo. Tu ticket se descargará próximamente.');
  };

  const handleShare = () => {
    if (navigator.share && ticketData) {
      navigator.share({
        title: `Ticket para ${ticketData.movie.title}`,
        text: `¡Tengo entradas para ${ticketData.movie.title}! Fecha: ${formatDate(ticketData.showtime.date)} a las ${formatTime(ticketData.showtime.time)}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace del ticket copiado al portapapeles');
    }
  };

  const handleEmailTicket = () => {
    if (ticketData && user) {
      const subject = encodeURIComponent(`Tu ticket para ${ticketData.movie.title}`);
      const body = encodeURIComponent(`
Hola ${user.firstName || user.username},

Tu reserva ha sido confirmada:

🎬 Película: ${ticketData.movie.title}
📅 Fecha: ${formatDate(ticketData.showtime.date)}
🕐 Hora: ${formatTime(ticketData.showtime.time)}
🎭 Sala: ${ticketData.showtime.hallName || `Sala ${ticketData.showtime.hallId}`}
💺 Asientos: ${ticketData.selectedSeats.map(s => `${s.row}${s.number}`).join(', ')}
💰 Total: ${formatPrice(ticketData.totalPrice)}
🎫 Número de ticket: ${ticketData.ticketNumber}

¡Disfruta tu película!

CineReserva
      `);
      
      window.open(`mailto:${user.email}?subject=${subject}&body=${body}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Generando tu ticket digital...</p>
        </div>
      </div>
    );
  }

  if (error || !ticketData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex justify-center items-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2 text-red-600">
            {error || 'Ticket no encontrado'}
          </h1>
          <p className="text-gray-600 mb-6">
            No se pudo cargar la información de tu reserva. Por favor, verifica el enlace o contacta soporte.
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/profile?tab=reservations')} className="w-full">
              Ver Mis Reservas
            </Button>
            <Button onClick={() => navigate('/')} variant="ghost" className="w-full">
              Volver al Inicio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h1>
          <p className="text-gray-600 text-lg">Tu reserva ha sido confirmada</p>
        </div>

        {/* Digital Ticket */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">🎬 CineReserva</h2>
                <p className="text-primary-100">Ticket Digital Oficial</p>
              </div>
              <div className="text-right">
                <p className="text-primary-100 text-sm">Número de Ticket</p>
                <p className="text-xl font-mono font-bold">{ticketData.ticketNumber}</p>
              </div>
            </div>
          </div>

          {/* Ticket Content */}
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Movie Poster */}
              <div className="flex-shrink-0">
                <img
                  src={ticketData.movie.posterImage}
                  alt={ticketData.movie.title}
                  className="w-32 h-48 object-cover rounded-lg shadow-md mx-auto lg:mx-0"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Image';
                  }}
                />
              </div>

              {/* Movie & Showtime Details */}
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{ticketData.movie.title}</h3>
                <p className="text-gray-600 mb-4">{ticketData.movie.genre} • {ticketData.movie.duration} min</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3 text-primary-600" />
                    <div>
                      <p className="font-medium">{formatDate(ticketData.showtime.date)}</p>
                      <p className="text-sm text-gray-500">Fecha de función</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-5 h-5 mr-3 text-primary-600" />
                    <div>
                      <p className="font-medium">{formatTime(ticketData.showtime.time)}</p>
                      <p className="text-sm text-gray-500">Hora de inicio</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-3 text-primary-600" />
                    <div>
                      <p className="font-medium">
                        {ticketData.showtime.hallName || `Sala ${ticketData.showtime.hallId}`}
                      </p>
                      <p className="text-sm text-gray-500">Sala de cine</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <Ticket className="w-5 h-5 mr-3 text-primary-600" />
                    <div>
                      <p className="font-medium">
                        {ticketData.selectedSeats.map(s => `${s.row}${s.number}`).join(', ')}
                      </p>
                      <p className="text-sm text-gray-500">
                        {ticketData.selectedSeats.length} asiento{ticketData.selectedSeats.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Titular:</span>
                    <span className="font-medium">{ticketData.paymentData.cardholderName}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Método de pago:</span>
                    <span className="font-medium">{ticketData.paymentData.cardNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total pagado:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatPrice(ticketData.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="border-t pt-6">
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <QrCode className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Código QR para validación</strong>
                </p>
                <p className="text-xs text-gray-500">
                  Presenta este ticket en el cine para acceder a tu función
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  ID: {ticketData.transactionId}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button onClick={handleDownload} variant="ghost" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Descargar PDF</span>
          </Button>
          
          <Button onClick={handleShare} variant="ghost" className="flex items-center space-x-2">
            <Share2 className="w-4 h-4" />
            <span>Compartir</span>
          </Button>
          
          <Button onClick={handleEmailTicket} variant="ghost" className="flex items-center space-x-2">
            <Mail className="w-4 h-4" />
            <span>Enviar por Email</span>
          </Button>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/profile?tab=reservations">
            <Button variant="ghost" className="flex items-center space-x-2 w-full sm:w-auto">
              <Ticket className="w-4 h-4" />
              <span>Ver Mis Reservas</span>
            </Button>
          </Link>
          
          <Link to="/">
            <Button className="flex items-center space-x-2 w-full sm:w-auto">
              <Home className="w-4 h-4" />
              <span>Reservar Otra Película</span>
            </Button>
          </Link>
        </div>

        {/* Important Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-900 mb-3">📋 Información Importante</h4>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Llega al cine 30 minutos antes del inicio de la función</li>
            <li>• Presenta este ticket digital o impreso en la entrada</li>
            <li>• No olvides traer tu documento de identidad</li>
            <li>• Las reservas no son reembolsables</li>
            <li>• Los alimentos y bebidas pueden adquirirse en el lobby</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 