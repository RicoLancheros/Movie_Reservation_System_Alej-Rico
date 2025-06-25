package com.alejrico.moviesystem.showtime_service.service;

import com.alejrico.moviesystem.showtime_service.dto.ShowtimeRequest;
import com.alejrico.moviesystem.showtime_service.dto.ShowtimeResponse;
import com.alejrico.moviesystem.showtime_service.model.Showtime;
import com.alejrico.moviesystem.showtime_service.repository.ShowtimeRepository;
import com.alejrico.moviesystem.showtime_service.repository.HallRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShowtimeService {
    
    private final ShowtimeRepository showtimeRepository;
    private final HallRepository hallRepository;
    
    public List<ShowtimeResponse> getAllShowtimes() {
        return showtimeRepository.findAll()
                .stream()
                .map(this::mapToShowtimeResponse)
                .collect(Collectors.toList());
    }
    
    public Optional<ShowtimeResponse> getShowtimeById(String id) {
        return showtimeRepository.findById(id)
                .map(this::mapToShowtimeResponse);
    }
    
    public List<ShowtimeResponse> getShowtimesByMovieId(String movieId) {
        return showtimeRepository.findByMovieId(movieId)
                .stream()
                .map(this::mapToShowtimeResponse)
                .collect(Collectors.toList());
    }
    
    public List<ShowtimeResponse> getShowtimesByDate(LocalDate date) {
        return showtimeRepository.findByDate(date)
                .stream()
                .map(this::mapToShowtimeResponse)
                .collect(Collectors.toList());
    }
    
    public List<ShowtimeResponse> getShowtimesByMovieIdAndDate(String movieId, LocalDate date) {
        return showtimeRepository.findByMovieIdAndDate(movieId, date)
                .stream()
                .map(this::mapToShowtimeResponse)
                .collect(Collectors.toList());
    }
    
    public ShowtimeResponse createShowtime(ShowtimeRequest showtimeRequest) {
        Showtime showtime = mapToShowtime(showtimeRequest);
        showtime.setTotalSeats(100); // Default
        showtime.setAvailableSeats(100);
        
        Showtime savedShowtime = showtimeRepository.save(showtime);
        return mapToShowtimeResponse(savedShowtime);
    }
    
    public Optional<ShowtimeResponse> updateShowtime(String id, ShowtimeRequest showtimeRequest) {
        return showtimeRepository.findById(id)
                .map(existingShowtime -> {
                    updateShowtimeFromRequest(existingShowtime, showtimeRequest);
                    Showtime savedShowtime = showtimeRepository.save(existingShowtime);
                    return mapToShowtimeResponse(savedShowtime);
                });
    }
    
    public boolean deleteShowtime(String id) {
        if (showtimeRepository.existsById(id)) {
            showtimeRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public boolean updateAvailableSeats(String id, int seatsToReserve) {
        Optional<Showtime> showtimeOpt = showtimeRepository.findById(id);
        if (showtimeOpt.isPresent()) {
            Showtime showtime = showtimeOpt.get();
            if (showtime.getAvailableSeats() >= seatsToReserve) {
                showtime.setAvailableSeats(showtime.getAvailableSeats() - seatsToReserve);
                showtimeRepository.save(showtime);
                return true;
            }
        }
        return false;
    }
    
    private Showtime mapToShowtime(ShowtimeRequest showtimeRequest) {
        Showtime showtime = new Showtime();
        showtime.setMovieId(showtimeRequest.getMovieId());
        showtime.setDate(showtimeRequest.getDate());
        showtime.setTime(showtimeRequest.getTime());
        showtime.setHallId(showtimeRequest.getHallId());
        showtime.setPrice(showtimeRequest.getPrice());
        return showtime;
    }
    
    private void updateShowtimeFromRequest(Showtime showtime, ShowtimeRequest showtimeRequest) {
        showtime.setMovieId(showtimeRequest.getMovieId());
        showtime.setDate(showtimeRequest.getDate());
        showtime.setTime(showtimeRequest.getTime());
        showtime.setHallId(showtimeRequest.getHallId());
        showtime.setPrice(showtimeRequest.getPrice());
    }
    
    private ShowtimeResponse mapToShowtimeResponse(Showtime showtime) {
        ShowtimeResponse response = new ShowtimeResponse();
        response.setId(showtime.getId());
        response.setMovieId(showtime.getMovieId());
        response.setDate(showtime.getDate());
        response.setTime(showtime.getTime());
        response.setHallId(showtime.getHallId());
        response.setPrice(showtime.getPrice());
        response.setAvailableSeats(showtime.getAvailableSeats());
        response.setTotalSeats(showtime.getTotalSeats());
        return response;
    }
} 