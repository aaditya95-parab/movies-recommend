package com.movieapp.movie_backend.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.movieapp.movie_backend.dto.LoginRequest;

@Service
public class AuthService {

    private Map<String, String> users = new HashMap<>();

    public AuthService() {

        // username -> password

        users.put("aaditya.parab", "1234");

        users.put("suchita.saroj", "suchita@123");

        users.put("atish.pawar", "atish@123");

        users.put("akshay.jadhav", "akshay@123");
    }

    public String authenticate(LoginRequest request) {

        String storedPassword =
                users.get(request.getUsername());

        if (storedPassword != null &&
                storedPassword.equals(request.getPassword())) {

            return "Login Successful";
        }

        return "Invalid Credentials";
    }
}