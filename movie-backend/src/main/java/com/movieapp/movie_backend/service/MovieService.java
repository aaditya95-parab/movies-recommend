package com.movieapp.movie_backend.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class MovieService {

    @Value("${tmdb.api.key}")
    private String apiKey;

    public Map<String, Object> getTrendingMovies() {

        RestTemplate restTemplate = new RestTemplate();

        List<Object> allMovies = new ArrayList<>();

        for (int page = 1; page <= 5; page++) {

            String url =
                    "https://api.themoviedb.org/3/trending/movie/day?api_key="
                            + apiKey
                            + "&page="
                            + page;

            try {

                Map<String, Object> response =
                        restTemplate.getForObject(url, Map.class);

                if (response != null &&
                        response.containsKey("results")) {

                    List<Object> results =
                            (List<Object>) response.get("results");

                    allMovies.addAll(results);
                }

            } catch (Exception e) {

                System.out.println(
                        "Error fetching page: " + page);

                e.printStackTrace();
            }
        }

        Map<String, Object> finalResponse =
                new HashMap<>();

        finalResponse.put("results", allMovies);

        return finalResponse;
    }
}