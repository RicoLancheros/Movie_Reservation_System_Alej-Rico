package com.alejrico.moviesystem.movie_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieResponse {
    
    private String id;
    private String title;
    private String description;
    private String posterImage;
    private String genre;
    private Integer duration;
    private String rating;
    private String releaseDate;
    private String director;
    private List<String> cast;
} 