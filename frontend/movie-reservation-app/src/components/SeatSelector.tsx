import React from 'react';
import { Accessibility } from 'lucide-react';
import type { Seat, SeatStatus } from '../types';

interface SeatSelectorProps {
  seats: Seat[][];
  selectedSeats: Seat[];
  onSeatSelect: (seat: Seat) => void;
  onSeatDeselect: (seatId: string) => void;
}

function getSeatClass(status: SeatStatus): string {
  switch (status) {
    case 'available':
      return 'bg-green-500 hover:bg-green-600 cursor-pointer';
    case 'occupied':
      return 'bg-red-500 cursor-not-allowed';
    case 'selected':
      return 'bg-blue-500 cursor-pointer';
    case 'disabled':
      return 'bg-gray-300 cursor-not-allowed';
    case 'accessible':
      return 'bg-purple-500 hover:bg-purple-600 cursor-pointer';
    default:
      return 'bg-gray-300';
  }
}

export function SeatSelector({ seats, selectedSeats, onSeatSelect, onSeatDeselect }: SeatSelectorProps) {
  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'occupied' || seat.status === 'disabled') {
      return;
    }

    const isSelected = selectedSeats.some(s => s.id === seat.id);
    if (isSelected) {
      onSeatDeselect(seat.id);
    } else {
      onSeatSelect(seat);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Screen */}
      <div className="mb-8">
        <div className="w-full h-4 bg-gray-800 rounded-t-full mb-2"></div>
        <p className="text-center text-gray-600 text-sm">PANTALLA</p>
      </div>

      {/* Seat Map */}
      <div className="space-y-3">
        {seats.map((row, rowIndex) => (
          <div key={rowIndex} className="flex items-center justify-center gap-2">
            {/* Row Label */}
            <div className="w-8 text-center font-semibold text-gray-700">
              {String.fromCharCode(65 + rowIndex)}
            </div>
            
            {/* Seats */}
            <div className="flex gap-1">
              {row.map((seat) => (
                <button
                  key={seat.id}
                  onClick={() => handleSeatClick(seat)}
                  className={`
                    w-8 h-8 rounded-t-lg text-xs font-medium text-white
                    transition-colors duration-200 relative
                    ${getSeatClass(seat.status)}
                  `}
                  disabled={seat.status === 'occupied' || seat.status === 'disabled'}
                  title={`Fila ${seat.row}, Asiento ${seat.number} - ${seat.status}`}
                >
                  {seat.type === 'accessible' && (
                    <Accessibility className="w-4 h-4 absolute inset-0 m-auto" />
                  )}
                  {seat.type === 'regular' && seat.number}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Seleccionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Ocupado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span>Accesible</span>
        </div>
      </div>
    </div>
  );
} 