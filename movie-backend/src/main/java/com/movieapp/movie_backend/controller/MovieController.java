package com.movieapp.movie_backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.movieapp.movie_backend.service.MovieService;

@RestController
@RequestMapping("/movies")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})

public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping("/trending")
    public Map<String, Object> getTrendingMovies() {

        return movieService.getTrendingMovies();
    }
}