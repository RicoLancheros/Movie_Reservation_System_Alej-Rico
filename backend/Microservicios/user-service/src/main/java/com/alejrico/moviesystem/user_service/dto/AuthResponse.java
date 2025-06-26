package com.alejrico.moviesystem.user_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    
    private String token;
    private String type = "Bearer";
    private UserResponse user;
    
    public AuthResponse(String token, UserResponse user) {
        this.token = token;
        this.user = user;
    }
} 