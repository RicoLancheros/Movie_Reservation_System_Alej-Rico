import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Users } from 'lucide-react';
import type { Movie, Showtime } from '../types';
import { Button } from '../components/ui/Button';
import { SeatSelector } from '../components/SeatSelector';
import { useReservationStore } from '../store/reservationStore';

export function SeatSelectionPage() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState(null);
  const [showtime, setShowtime] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    seatMap,
    selectedSeats,
    totalPrice,
    isLoading: storeLoading,
    error,
    selectSeat,
    deselectSeat,
    clearSelectedSeats,
    fetchSeatMap,
    calculateTotalPrice,
    setCurrentShowtime,
    initializeMockData
  } = useReservationStore();

  useEffect(() => {
    initializeMockData();
  }, [initializeMockData]);

  useEffect(() => {
    const loadData = async () => {
      if (showtimeId) {
        try {
          setIsLoading(true);
          
          const storedShowtime = localStorage.getItem('selectedShowtime');
          const storedMovie = localStorage.getItem('selectedMovie');
          
          if (storedShowtime && storedMovie) {
            const parsedShowtime = JSON.parse(storedShowtime);
            const parsedMovie = JSON.parse(storedMovie);
            
            setShowtime(parsedShowtime);
            setMovie(parsedMovie);
            
            setCurrentShowtime(showtimeId);
            await fetchSeatMap(showtimeId);
          } else {
            navigate('/');
            return;
          }
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadData();
  }, [showtimeId, navigate, fetchSeatMap, setCurrentShowtime, initializeMockData]);

  useEffect(() => {
    return () => {
      clearSelectedSeats();
    };
  }, [clearSelectedSeats]);

  useEffect(() => {
    if (selectedSeats.length > 0 && showtime?.price) {
      calculateTotalPrice(showtime.price);
    }
  }, [selectedSeats, showtime?.price, calculateTotalPrice]);

  const handleSeatSelect = (seat) => {
    if (selectedSeats.length < 8) {
      selectSeat(seat);
    } else {
      alert('Máximo 8 asientos por reserva');
    }
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) {
      alert('Debes seleccionar al menos un asiento');
      return;
    }

    const reservationData = {
      movie,
      showtime,
      selectedSeats,
      totalPrice,
      showtimeId
    };
    
    localStorage.setItem('reservationData', JSON.stringify(reservationData));
    navigate('/payment');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading || storeLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cargando asientos...</p>
        </div>
      </div>
    );
  }

  if (error || !movie || !showtime) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'No se encontró información de la función'}</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al catálogo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
                    {showtime.hallName || `Sala ${showtime.hallId}`}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">
                  {formatDate(showtime.date)}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-500">Precio por asiento</p>
              <p className="text-2xl font-bold text-primary-600">
                {formatPrice(showtime.price)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Selecciona tus asientos</h2>
          <p className="text-gray-600 mt-1">
            Haz clic en los asientos disponibles para seleccionarlos (máximo 8 asientos)
          </p>
        </div>
        
        <SeatSelector
          seats={seatMap}
          selectedSeats={selectedSeats}
          onSeatSelect={handleSeatSelect}
          onSeatDeselect={deselectSeat}
        />
      </div>

      {selectedSeats.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen de tu selección</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Asientos seleccionados</p>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
                  <span
                    key={seat.id}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {seat.row}{seat.number}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Cantidad</p>
              <p className="text-lg font-semibold flex items-center gap-1">
                <Users className="h-4 w-4" />
                {selectedSeats.length} entrada{selectedSeats.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">Total a pagar</p>
              <p className="text-2xl font-bold text-green-600">
                {formatPrice(totalPrice)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <Button
          variant="ghost"
          onClick={() => clearSelectedSeats()}
          disabled={selectedSeats.length === 0}
        >
          Limpiar selección
        </Button>
        
        <Button
          onClick={handleProceedToPayment}
          disabled={selectedSeats.length === 0}
          className="px-8"
        >
          Continuar al pago ({formatPrice(totalPrice)})
        </Button>
      </div>
    </div>
  );
} 