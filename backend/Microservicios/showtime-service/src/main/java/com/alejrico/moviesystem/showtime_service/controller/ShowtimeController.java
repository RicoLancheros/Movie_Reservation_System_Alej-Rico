package com.alejrico.moviesystem.showtime_service.controller;

import com.alejrico.moviesystem.showtime_service.dto.ShowtimeRequest;
import com.alejrico.moviesystem.showtime_service.dto.ShowtimeResponse;
import com.alejrico.moviesystem.showtime_service.service.ShowtimeService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/showtimes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ShowtimeController {
    
    private final ShowtimeService showtimeService;
    
    @GetMapping
    public ResponseEntity<List<ShowtimeResponse>> getAllShowtimes() {
        List<ShowtimeResponse> showtimes = showtimeService.getAllShowtimes();
        return ResponseEntity.ok(showtimes);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ShowtimeResponse> getShowtimeById(@PathVariable String id) {
        Optional<ShowtimeResponse> showtime = showtimeService.getShowtimeById(id);
        return showtime.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<ShowtimeResponse>> getShowtimesByMovieId(@PathVariable String movieId) {
        List<ShowtimeResponse> showtimes = showtimeService.getShowtimesByMovieId(movieId);
        return ResponseEntity.ok(showtimes);
    }
    
    @GetMapping("/date/{date}")
    public ResponseEntity<List<ShowtimeResponse>> getShowtimesByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<ShowtimeResponse> showtimes = showtimeService.getShowtimesByDate(date);
        return ResponseEntity.ok(showtimes);
    }
    
    @GetMapping("/movie/{movieId}/date/{date}")
    public ResponseEntity<List<ShowtimeResponse>> getShowtimesByMovieIdAndDate(
            @PathVariable String movieId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<ShowtimeResponse> showtimes = showtimeService.getShowtimesByMovieIdAndDate(movieId, date);
        return ResponseEntity.ok(showtimes);
    }
    
    @PostMapping
    public ResponseEntity<ShowtimeResponse> createShowtime(@Valid @RequestBody ShowtimeRequest showtimeRequest) {
        ShowtimeResponse createdShowtime = showtimeService.createShowtime(showtimeRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdShowtime);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ShowtimeResponse> updateShowtime(
            @PathVariable String id, 
            @Valid @RequestBody ShowtimeRequest showtimeRequest) {
        Optional<ShowtimeResponse> updatedShowtime = showtimeService.updateShowtime(id, showtimeRequest);
        return updatedShowtime.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShowtime(@PathVariable String id) {
        boolean deleted = showtimeService.deleteShowtime(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
    
    @PutMapping("/{id}/reserve-seats")
    public ResponseEntity<Void> reserveSeats(
            @PathVariable String id, 
            @RequestParam int seats) {
        boolean reserved = showtimeService.updateAvailableSeats(id, seats);
        return reserved ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }
} 