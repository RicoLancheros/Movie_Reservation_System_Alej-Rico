package com.alejrico.moviesystem.showtime_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "halls")
public class Hall {
    
    @Id
    private String id;
    
    @NotBlank(message = "El nombre de la sala es obligatorio")
    private String name;
    
    @NotNull(message = "Los asientos son obligatorios")
    private List<List<Seat>> seats;
    
    @NotNull(message = "El total de asientos es obligatorio")
    @Positive(message = "El total de asientos debe ser positivo")
    private Integer totalSeats;
} 