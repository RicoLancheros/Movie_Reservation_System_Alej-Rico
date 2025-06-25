package com.alejrico.moviesystem.showtime_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShowtimeResponse {
    
    private String id;
    private String movieId;
    private LocalDate date;
    private LocalTime time;
    private String hallId;
    private Double price;
    private Integer availableSeats;
    private Integer totalSeats;
} 