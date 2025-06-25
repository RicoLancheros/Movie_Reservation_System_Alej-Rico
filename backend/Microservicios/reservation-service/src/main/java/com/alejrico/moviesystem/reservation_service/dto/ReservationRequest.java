package com.alejrico.moviesystem.reservation_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationRequest {
    
    @NotBlank(message = "El ID del usuario es obligatorio")
    private String userId;
    
    @NotBlank(message = "El ID de la función es obligatorio")
    private String showtimeId;
    
    @NotNull(message = "Los IDs de asientos son obligatorios")
    private List<String> seatIds;
} 