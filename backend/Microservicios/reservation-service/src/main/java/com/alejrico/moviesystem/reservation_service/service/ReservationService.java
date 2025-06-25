package com.alejrico.moviesystem.reservation_service.service;

import com.alejrico.moviesystem.reservation_service.dto.ReservationRequest;
import com.alejrico.moviesystem.reservation_service.dto.ReservationResponse;
import com.alejrico.moviesystem.reservation_service.model.Reservation;
import com.alejrico.moviesystem.reservation_service.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {
    
    private final ReservationRepository reservationRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    
    public List<ReservationResponse> getAllReservations() {
        return reservationRepository.findAll()
                .stream()
                .map(this::mapToReservationResponse)
                .collect(Collectors.toList());
    }
    
    public Optional<ReservationResponse> getReservationById(String id) {
        return reservationRepository.findById(id)
                .map(this::mapToReservationResponse);
    }
    
    public List<ReservationResponse> getReservationsByUserId(String userId) {
        return reservationRepository.findByUserId(userId)
                .stream()
                .map(this::mapToReservationResponse)
                .collect(Collectors.toList());
    }
    
    public ReservationResponse createReservation(ReservationRequest reservationRequest) {
        try {
            // Obtener información de la función desde showtime-service
            String showtimeUrl = "http://localhost:8083/api/showtimes/" + reservationRequest.getShowtimeId();
            var showtimeResponse = restTemplate.getForObject(showtimeUrl, Object.class);
            
            // Calcular precio total (precio por asiento * número de asientos)
            double pricePerSeat = 30000.0; // Precio fijo por simplicity
            double totalPrice = pricePerSeat * reservationRequest.getSeatIds().size();
            
            // Crear la reserva
            Reservation reservation = new Reservation();
            reservation.setUserId(reservationRequest.getUserId());
            reservation.setShowtimeId(reservationRequest.getShowtimeId());
            reservation.setMovieTitle("Película"); // Por ahora un valor por defecto
            reservation.setDate("2025-06-25"); // Por ahora fecha fija
            reservation.setTime("20:00"); // Por ahora hora fija
            reservation.setSeatIds(reservationRequest.getSeatIds());
            reservation.setTotalPrice(totalPrice);
            reservation.setStatus("confirmed");
            reservation.setCreatedAt(LocalDateTime.now());
            
            // Intentar reservar asientos en showtime-service
            try {
                String reserveUrl = "http://localhost:8083/api/showtimes/" + reservationRequest.getShowtimeId() + "/reserve-seats?seats=" + reservationRequest.getSeatIds().size();
                restTemplate.put(reserveUrl, null);
            } catch (Exception e) {
                throw new RuntimeException("No se pudieron reservar los asientos");
            }
            
            Reservation savedReservation = reservationRepository.save(reservation);
            return mapToReservationResponse(savedReservation);
            
        } catch (Exception e) {
            throw new RuntimeException("Error al crear la reserva: " + e.getMessage());
        }
    }
    
    public boolean cancelReservation(String id) {
        Optional<Reservation> reservationOpt = reservationRepository.findById(id);
        if (reservationOpt.isPresent()) {
            Reservation reservation = reservationOpt.get();
            if ("confirmed".equals(reservation.getStatus())) {
                reservation.setStatus("cancelled");
                reservationRepository.save(reservation);
                
                // Liberar asientos en showtime-service (implementar si es necesario)
                
                return true;
            }
        }
        return false;
    }
    
    public boolean deleteReservation(String id) {
        if (reservationRepository.existsById(id)) {
            reservationRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    private ReservationResponse mapToReservationResponse(Reservation reservation) {
        ReservationResponse response = new ReservationResponse();
        response.setId(reservation.getId());
        response.setUserId(reservation.getUserId());
        response.setShowtimeId(reservation.getShowtimeId());
        response.setMovieTitle(reservation.getMovieTitle());
        response.setDate(reservation.getDate());
        response.setTime(reservation.getTime());
        response.setSeatIds(reservation.getSeatIds());
        response.setTotalPrice(reservation.getTotalPrice());
        response.setStatus(reservation.getStatus());
        response.setCreatedAt(reservation.getCreatedAt());
        return response;
    }
} 