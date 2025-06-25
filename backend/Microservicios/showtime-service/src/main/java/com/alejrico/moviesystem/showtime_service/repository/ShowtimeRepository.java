package com.alejrico.moviesystem.showtime_service.repository;

import com.alejrico.moviesystem.showtime_service.model.Showtime;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShowtimeRepository extends MongoRepository<Showtime, String> {
    
    // Buscar funciones por película
    List<Showtime> findByMovieId(String movieId);
    
    // Buscar funciones por fecha
    List<Showtime> findByDate(LocalDate date);
    
    // Buscar funciones por película y fecha
    List<Showtime> findByMovieIdAndDate(String movieId, LocalDate date);
    
    // Buscar funciones por sala
    List<Showtime> findByHallId(String hallId);
    
    // Buscar funciones por sala y fecha
    List<Showtime> findByHallIdAndDate(String hallId, LocalDate date);
    
    // Buscar funciones disponibles (con asientos disponibles)
    List<Showtime> findByAvailableSeatsGreaterThan(Integer seats);
} 