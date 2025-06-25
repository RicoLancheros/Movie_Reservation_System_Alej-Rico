package com.alejrico.moviesystem.reservation_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponse {
    
    private String id;
    private String userId;
    private String showtimeId;
    private String movieTitle;
    private String date;
    private String time;
    private List<String> seatIds;
    private Double totalPrice;
    private String status;
    private LocalDateTime createdAt;
} 