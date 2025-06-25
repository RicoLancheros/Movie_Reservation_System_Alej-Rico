package com.alejrico.moviesystem.showtime_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowtimeRequest {
    
    @NotBlank(message = "El ID de la película es obligatorio")
    private String movieId;
    
    @NotNull(message = "La fecha es obligatoria")
    private LocalDate date;
    
    @NotNull(message = "La hora es obligatoria")
    private LocalTime time;
    
    @NotBlank(message = "El ID de la sala es obligatorio")
    private String hallId;
    
    @NotNull(message = "El precio es obligatorio")
    @Positive(message = "El precio debe ser positivo")
    private Double price;
} 