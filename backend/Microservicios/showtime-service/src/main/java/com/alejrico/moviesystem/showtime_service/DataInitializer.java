package com.alejrico.moviesystem.showtime_service;

import com.alejrico.moviesystem.showtime_service.model.Showtime;
import com.alejrico.moviesystem.showtime_service.repository.ShowtimeRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final ShowtimeRepository showtimeRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Override
    public void run(String... args) throws Exception {
        if (showtimeRepository.count() == 0) {
            initializeShowtimes();
        }
    }
    
    private void initializeShowtimes() {
        try {
            // Obtener películas del movie-service
            String moviesResponse = restTemplate.getForObject("http://localhost:8082/api/movies", String.class);
            JsonNode moviesArray = objectMapper.readTree(moviesResponse);
            
            List<Showtime> showtimes = new ArrayList<>();
            
            // Crear horarios para las primeras 4 películas
            int movieCount = 0;
            for (JsonNode movieNode : moviesArray) {
                if (movieCount >= 4) break; // Solo crear horarios para las primeras 4 películas
                
                String movieId = movieNode.get("id").asText();
                
                // Horarios para hoy
                showtimes.add(new Showtime(null, movieId, LocalDate.now(), LocalTime.of(14, 0), "hall1", 25000.0, 95, 100));
                showtimes.add(new Showtime(null, movieId, LocalDate.now(), LocalTime.of(17, 30), "hall2", 30000.0, 88, 100));
                showtimes.add(new Showtime(null, movieId, LocalDate.now(), LocalTime.of(20, 45), "hall3", 35000.0, 100, 100));
                
                // Horarios para mañana
                showtimes.add(new Showtime(null, movieId, LocalDate.now().plusDays(1), LocalTime.of(15, 0), "hall1", 30000.0, 100, 100));
                showtimes.add(new Showtime(null, movieId, LocalDate.now().plusDays(1), LocalTime.of(18, 15), "hall2", 35000.0, 100, 100));
                showtimes.add(new Showtime(null, movieId, LocalDate.now().plusDays(1), LocalTime.of(21, 30), "hall3", 40000.0, 100, 100));
                
                movieCount++;
            }
            
            showtimeRepository.saveAll(showtimes);
            System.out.println("Datos de funciones inicializados correctamente con " + showtimes.size() + " horarios!");
            
        } catch (Exception e) {
            System.err.println("Error inicializando horarios: " + e.getMessage());
            // Fallback: usar datos hardcodeados si no se puede conectar al movie-service
            initializeFallbackShowtimes();
        }
    }
    
    private void initializeFallbackShowtimes() {
        List<Showtime> showtimes = List.of(
                // Funciones para hoy
                new Showtime(null, "movie1", LocalDate.now(), LocalTime.of(14, 0), "hall1", 25000.0, 95, 100),
                new Showtime(null, "movie1", LocalDate.now(), LocalTime.of(17, 30), "hall1", 30000.0, 88, 100),
                new Showtime(null, "movie1", LocalDate.now(), LocalTime.of(20, 45), "hall2", 35000.0, 100, 100),
                
                new Showtime(null, "movie2", LocalDate.now(), LocalTime.of(13, 15), "hall2", 28000.0, 92, 100),
                new Showtime(null, "movie2", LocalDate.now(), LocalTime.of(16, 30), "hall3", 32000.0, 85, 100),
                new Showtime(null, "movie2", LocalDate.now(), LocalTime.of(19, 45), "hall1", 35000.0, 78, 100),
                
                // Funciones para mañana
                new Showtime(null, "movie3", LocalDate.now().plusDays(1), LocalTime.of(15, 0), "hall1", 30000.0, 100, 100),
                new Showtime(null, "movie3", LocalDate.now().plusDays(1), LocalTime.of(18, 15), "hall2", 35000.0, 100, 100),
                new Showtime(null, "movie3", LocalDate.now().plusDays(1), LocalTime.of(21, 30), "hall3", 40000.0, 100, 100),
                
                new Showtime(null, "movie4", LocalDate.now().plusDays(1), LocalTime.of(14, 30), "hall2", 25000.0, 100, 100),
                new Showtime(null, "movie4", LocalDate.now().plusDays(1), LocalTime.of(17, 45), "hall3", 30000.0, 100, 100),
                new Showtime(null, "movie4", LocalDate.now().plusDays(1), LocalTime.of(20, 0), "hall1", 35000.0, 100, 100)
        );
        
        showtimeRepository.saveAll(showtimes);
        System.out.println("Datos de funciones fallback inicializados correctamente!");
    }
} 