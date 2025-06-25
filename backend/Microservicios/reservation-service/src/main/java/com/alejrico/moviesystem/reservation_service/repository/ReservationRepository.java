package com.alejrico.moviesystem.reservation_service.repository;

import com.alejrico.moviesystem.reservation_service.model.Reservation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends MongoRepository<Reservation, String> {
    
    // Buscar reservas por usuario
    List<Reservation> findByUserId(String userId);
    
    // Buscar reservas por función
    List<Reservation> findByShowtimeId(String showtimeId);
    
    // Buscar reservas por estado
    List<Reservation> findByStatus(String status);
    
    // Buscar reservas por usuario y estado
    List<Reservation> findByUserIdAndStatus(String userId, String status);
} 