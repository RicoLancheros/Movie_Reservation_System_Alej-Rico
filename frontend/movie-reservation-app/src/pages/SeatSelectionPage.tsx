import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Users } from 'lucide-react';
import type { Movie, Showtime, Seat } from '../types';
import { Button } from '../components/ui/Button';
import { SeatSelector } from '../components/SeatSelector';
import { useReservationStore } from '../store/reservationStore';

// Función para generar el mapa de asientos
const generateSeatMap = (showtimeId: string): Seat[][] => {
  const rows = 8; // Filas A-H
  const seatsPerRow = 12;
  const seatMap: Seat[][] = [];
  
  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    const row: Seat[] = [];
    const rowLetter = String.fromCharCode(65 + rowIndex); // A, B, C, etc.
    
    for (let seatNumber = 1; seatNumber <= seatsPerRow; seatNumber++) {
      const seatId = `${showtimeId}-${rowLetter}${seatNumber}`;
      
      // Simular algunos asientos ocupados y accesibles
      let status: Seat['status'] = 'available';
      
      // Algunos asientos ocupados aleatoriamente
      if (Math.random() < 0.15) {
        status = 'occupied';
      }
      
      // Asientos accesibles en los extremos de algunas filas
      const isAccessible = (rowIndex >= 4 && (seatNumber === 1 || seatNumber === seatsPerRow));
      
      row.push({
        id: seatId,
        row: rowLetter,
        number: seatNumber,
        status: status,
        type: isAccessible ? 'accessible' : 'regular'
      });
    }
    
    seatMap.push(row);
  }
  
  return seatMap;
};

export function SeatSelectionPage() {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [seatMap, setSeatMap] = useState<Seat[][]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (showtimeId) {
      try {
        // Cargar datos del showtime y película desde localStorage
        const storedShowtime = localStorage.getItem('selectedShowtime');
        const storedMovie = localStorage.getItem('selectedMovie');
        
        if (storedShowtime && storedMovie) {
          const parsedShowtime = JSON.parse(storedShowtime) as Showtime;
          const parsedMovie = JSON.parse(storedMovie) as Movie;
          
          setShowtime(parsedShowtime);
          setMovie(parsedMovie);
          
          // Generar mapa de asientos
          const generatedSeatMap = generateSeatMap(showtimeId);
          setSeatMap(generatedSeatMap);
        }
      } catch (error) {
        console.error('Error loading showtime data:', error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [showtimeId]);

  const handleSeatSelect = (seat: Seat) => {
    const isAlreadySelected = selectedSeats.some(s => s.id === seat.id);
    if (!isAlreadySelected && selectedSeats.length < 8) { // Máximo 8 asientos
      setSelectedSeats([...selectedSeats, { ...seat, status: 'selected' }]);
    }
  };

  const handleSeatDeselect = (seatId: string) => {
    setSelectedSeats(selectedSeats.filter(seat => seat.id !== seatId));
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      alert('Debes seleccionar al menos un asiento');
      return;
    }

    // Guardar datos para el pago
    const reservationData = {
      movie,
      showtime,
      selectedSeats,
      totalPrice: calculateTotalPrice()
    };
    
    localStorage.setItem('reservationData', JSON.stringify(reservationData));
    navigate('/payment');
  };

  const calculateTotalPrice = () => {
    return selectedSeats.length * (showtime?.price || 0);
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500">Cargando asientos...</p>
        </div>
      </div>
    );
  }

  if (!movie || !showtime) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No se encontró información de la función</p>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al catálogo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/movie/${movie.id}`)}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a horarios
        </Button>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={movie.posterImage}
                alt={movie.title}
                className="w-16 h-24 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/300x450?text=No+Image';
                }}
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{movie.title}</h1>
                <div className="flex items-center gap-4 text-gray-600 mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {showtime.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Sala {showtime.hallId.replace('hall', '')}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">
                  {formatDate(showtime.date)}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-lg font-semibold text-blue-600">
                {formatPrice(showtime.price)} por asiento
              </p>
              <p className="text-sm text-gray-500">
                {showtime.availableSeats} asientos disponibles
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Seat Map */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Selecciona tus asientos</h2>
            
            <SeatSelector
              seats={seatMap}
              selectedSeats={selectedSeats}
              onSeatSelect={handleSeatSelect}
              onSeatDeselect={handleSeatDeselect}
            />
          </div>
        </div>

        {/* Reservation Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen de Reserva</h3>
            
            {selectedSeats.length > 0 ? (
              <>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Película:</span>
                    <span className="text-gray-900 font-medium">{movie.title}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fecha:</span>
                    <span className="text-gray-900">{formatDate(showtime.date)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Hora:</span>
                    <span className="text-gray-900">{showtime.time}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sala:</span>
                    <span className="text-gray-900">{showtime.hallId.replace('hall', '')}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Asientos Seleccionados ({selectedSeats.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedSeats.map(seat => (
                      <div key={seat.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">
                          Fila {seat.row}, Asiento {seat.number}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900">{formatPrice(showtime.price)}</span>
                          <button
                            onClick={() => handleSeatDeselect(seat.id)}
                            className="text-red-600 hover:text-red-800 text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-xl font-bold text-blue-600">
                      {formatPrice(calculateTotalPrice())}
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={handleProceedToPayment}
                  className="w-full"
                >
                  Continuar al Pago
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No has seleccionado asientos</p>
                <p className="text-sm text-gray-400">
                  Haz clic en los asientos disponibles para seleccionarlos
                </p>
              </div>
            )}

            {selectedSeats.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600">
                  <strong>Nota:</strong> Tienes 15 minutos para completar tu reserva.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 