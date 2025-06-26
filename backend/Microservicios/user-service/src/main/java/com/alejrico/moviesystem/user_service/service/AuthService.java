package com.alejrico.moviesystem.user_service.service;

import com.alejrico.moviesystem.user_service.dto.AuthResponse;
import com.alejrico.moviesystem.user_service.dto.LoginRequest;
import com.alejrico.moviesystem.user_service.dto.RegisterRequest;
import com.alejrico.moviesystem.user_service.dto.UserResponse;
import com.alejrico.moviesystem.user_service.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse login(LoginRequest loginRequest) {
        // Verificar credenciales básicas
        User user = userService.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName()
        );
        userResponse.setRoles(user.getRoles());

        // Por ahora devolver un token simple
        return new AuthResponse("simple-token-" + user.getId(), userResponse);
    }

    public UserResponse register(RegisterRequest registerRequest) {
        return userService.registerUser(registerRequest);
    }

    public void logout() {
        SecurityContextHolder.clearContext();
    }
} 