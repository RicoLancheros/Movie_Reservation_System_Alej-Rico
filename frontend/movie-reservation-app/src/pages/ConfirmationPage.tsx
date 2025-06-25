import React from 'react';
import { useParams } from 'react-router-dom';

export function ConfirmationPage() {
  const { reservationId } = useParams();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Confirmación de Reserva</h1>
      <p>Página en desarrollo - Reserva ID: {reservationId}</p>
    </div>
  );
} 