package com.alejrico.moviesystem.reservation_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "reservations")
public class Reservation {
    
    @Id
    private String id;
    
    @NotBlank(message = "El ID del usuario es obligatorio")
    private String userId;
    
    @NotBlank(message = "El ID de la función es obligatorio")
    private String showtimeId;
    
    @NotBlank(message = "El título de la película es obligatorio")
    private String movieTitle;
    
    @NotBlank(message = "La fecha es obligatoria")
    private String date;
    
    @NotBlank(message = "La hora es obligatoria")
    private String time;
    
    @NotNull(message = "Los asientos son obligatorios")
    private List<String> seatIds;
    
    @NotNull(message = "El precio total es obligatorio")
    @Positive(message = "El precio total debe ser positivo")
    private Double totalPrice;
    
    @NotBlank(message = "El estado es obligatorio")
    private String status; // confirmed, cancelled
    
    @NotNull(message = "La fecha de creación es obligatoria")
    private LocalDateTime createdAt;
} 