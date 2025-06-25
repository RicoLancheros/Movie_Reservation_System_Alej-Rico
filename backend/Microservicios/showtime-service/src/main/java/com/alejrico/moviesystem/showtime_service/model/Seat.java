package com.alejrico.moviesystem.showtime_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Seat {
    
    @NotBlank(message = "El ID del asiento es obligatorio")
    private String id;
    
    @NotBlank(message = "La fila es obligatoria")
    private String row;
    
    @NotNull(message = "El número del asiento es obligatorio")
    @Positive(message = "El número del asiento debe ser positivo")
    private Integer number;
    
    @NotBlank(message = "El estado del asiento es obligatorio")
    private String status; // available, occupied, disabled, accessible
    
    @NotBlank(message = "El tipo de asiento es obligatorio")
    private String type; // regular, accessible
} 