package com.alejrico.moviesystem.movie_service.repository;

import com.alejrico.moviesystem.movie_service.model.Movie;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends MongoRepository<Movie, String> {
    
    // Buscar películas por género
    List<Movie> findByGenreIgnoreCase(String genre);
    
    // Buscar películas por título (contiene)
    @Query("{'title': {$regex: ?0, $options: 'i'}}")
    List<Movie> findByTitleContainingIgnoreCase(String title);
    
    // Buscar películas por género y título
    @Query("{'genre': {$regex: ?0, $options: 'i'}, 'title': {$regex: ?1, $options: 'i'}}")
    List<Movie> findByGenreAndTitleContainingIgnoreCase(String genre, String title);
    
    // Buscar películas por director
    @Query("{'director': {$regex: ?0, $options: 'i'}}")
    List<Movie> findByDirectorContainingIgnoreCase(String director);
    
    // Obtener géneros únicos
    @Query(value = "{}", fields = "{'genre': 1}")
    List<Movie> findAllGenres();
} 