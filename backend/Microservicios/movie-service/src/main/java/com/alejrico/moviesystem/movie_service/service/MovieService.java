package com.alejrico.moviesystem.movie_service.service;

import com.alejrico.moviesystem.movie_service.dto.MovieRequest;
import com.alejrico.moviesystem.movie_service.dto.MovieResponse;
import com.alejrico.moviesystem.movie_service.model.Movie;
import com.alejrico.moviesystem.movie_service.repository.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieService {
    
    private final MovieRepository movieRepository;
    
    public List<MovieResponse> getAllMovies() {
        return movieRepository.findAll()
                .stream()
                .map(this::mapToMovieResponse)
                .collect(Collectors.toList());
    }
    
    public Optional<MovieResponse> getMovieById(String id) {
        return movieRepository.findById(id)
                .map(this::mapToMovieResponse);
    }
    
    public MovieResponse createMovie(MovieRequest movieRequest) {
        Movie movie = mapToMovie(movieRequest);
        Movie savedMovie = movieRepository.save(movie);
        return mapToMovieResponse(savedMovie);
    }
    
    public Optional<MovieResponse> updateMovie(String id, MovieRequest movieRequest) {
        return movieRepository.findById(id)
                .map(existingMovie -> {
                    updateMovieFromRequest(existingMovie, movieRequest);
                    Movie savedMovie = movieRepository.save(existingMovie);
                    return mapToMovieResponse(savedMovie);
                });
    }
    
    public boolean deleteMovie(String id) {
        if (movieRepository.existsById(id)) {
            movieRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    public List<MovieResponse> searchMovies(String title, String genre) {
        List<Movie> movies;
        
        if (title != null && !title.trim().isEmpty() && genre != null && !genre.trim().isEmpty()) {
            movies = movieRepository.findByGenreAndTitleContainingIgnoreCase(genre, title);
        } else if (title != null && !title.trim().isEmpty()) {
            movies = movieRepository.findByTitleContainingIgnoreCase(title);
        } else if (genre != null && !genre.trim().isEmpty()) {
            movies = movieRepository.findByGenreIgnoreCase(genre);
        } else {
            movies = movieRepository.findAll();
        }
        
        return movies.stream()
                .map(this::mapToMovieResponse)
                .collect(Collectors.toList());
    }
    
    public List<String> getAllGenres() {
        return movieRepository.findAll()
                .stream()
                .map(Movie::getGenre)
                .collect(Collectors.toSet()) // Remove duplicates
                .stream()
                .sorted()
                .collect(Collectors.toList());
    }
    
    private Movie mapToMovie(MovieRequest movieRequest) {
        Movie movie = new Movie();
        movie.setTitle(movieRequest.getTitle());
        movie.setDescription(movieRequest.getDescription());
        movie.setPosterImage(movieRequest.getPosterImage());
        movie.setGenre(movieRequest.getGenre());
        movie.setDuration(movieRequest.getDuration());
        movie.setRating(movieRequest.getRating());
        movie.setReleaseDate(movieRequest.getReleaseDate());
        movie.setDirector(movieRequest.getDirector());
        movie.setCast(movieRequest.getCast());
        return movie;
    }
    
    private void updateMovieFromRequest(Movie movie, MovieRequest movieRequest) {
        movie.setTitle(movieRequest.getTitle());
        movie.setDescription(movieRequest.getDescription());
        movie.setPosterImage(movieRequest.getPosterImage());
        movie.setGenre(movieRequest.getGenre());
        movie.setDuration(movieRequest.getDuration());
        movie.setRating(movieRequest.getRating());
        movie.setReleaseDate(movieRequest.getReleaseDate());
        movie.setDirector(movieRequest.getDirector());
        movie.setCast(movieRequest.getCast());
    }
    
    private MovieResponse mapToMovieResponse(Movie movie) {
        MovieResponse response = new MovieResponse();
        response.setId(movie.getId());
        response.setTitle(movie.getTitle());
        response.setDescription(movie.getDescription());
        response.setPosterImage(movie.getPosterImage());
        response.setGenre(movie.getGenre());
        response.setDuration(movie.getDuration());
        response.setRating(movie.getRating());
        response.setReleaseDate(movie.getReleaseDate());
        response.setDirector(movie.getDirector());
        response.setCast(movie.getCast());
        return response;
    }
} 