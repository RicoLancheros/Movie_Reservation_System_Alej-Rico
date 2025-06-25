package com.alejrico.moviesystem.showtime_service.repository;

import com.alejrico.moviesystem.showtime_service.model.Hall;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HallRepository extends MongoRepository<Hall, String> {
    
    // Buscar sala por nombre
    Optional<Hall> findByName(String name);
} 