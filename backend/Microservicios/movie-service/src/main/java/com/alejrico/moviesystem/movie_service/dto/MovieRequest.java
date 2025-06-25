package com.alejrico.moviesystem.movie_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieRequest {
    
    @NotBlank(message = "El título es obligatorio")
    private String title;
    
    @NotBlank(message = "La descripción es obligatoria")
    private String description;
    
    @NotBlank(message = "La imagen del póster es obligatoria")
    private String posterImage;
    
    @NotBlank(message = "El género es obligatorio")
    private String genre;
    
    @NotNull(message = "La duración es obligatoria")
    @Positive(message = "La duración debe ser positiva")
    private Integer duration;
    
    @NotBlank(message = "La clasificación es obligatoria")
    private String rating;
    
    @NotBlank(message = "La fecha de estreno es obligatoria")
    private String releaseDate;
    
    @NotBlank(message = "El director es obligatorio")
    private String director;
    
    private List<String> cast;
} 