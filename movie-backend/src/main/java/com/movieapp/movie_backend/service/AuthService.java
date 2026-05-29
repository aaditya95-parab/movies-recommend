package com.movieapp.movie_backend.service;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.movieapp.movie_backend.dto.AuthResponse;
import com.movieapp.movie_backend.dto.LoginRequest;
import com.movieapp.movie_backend.entity.DmsUser;
import com.movieapp.movie_backend.repository.DmsUserRepository;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final DmsUserRepository userRepository;
    private final byte[] secretBytes;
    private final long expirationMs;

    public AuthService(
        DmsUserRepository userRepository,
        @Value("${security.jwt.secret}") String secret,
        @Value("${security.jwt.expiration-ms:86400000}") long expirationMs
    ) {
        this.userRepository = userRepository;
        this.secretBytes = secret.getBytes(StandardCharsets.UTF_8);
        this.expirationMs = expirationMs;
    }

    public AuthResponse authenticate(LoginRequest request) {

        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username and password required");
        }

        String username = request.getUsername();
        String password = request.getPassword();

        if (username == null || username.isBlank() || password == null || password.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username and password required");
        }

        try {
            String normalizedUsername = username.trim();
            DmsUser user = userRepository.findByUserId(normalizedUsername);

            if (user == null) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
            }

            if (!Objects.equals(user.getPassword(), password)) {
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
            }

            if (!"ACTIVE".equalsIgnoreCase(user.getAccountStatus())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account inactive");
            }

            String token = generateToken(user.getUserId());
            logger.info("Login successful for userId={}", user.getUserId());

            AuthResponse response = new AuthResponse();
            response.setSuccess(true);
            response.setMessage("Login Successful");
            response.setToken(token);
            response.setUsername(user.getUserId());
            return response;
        } catch (DataAccessException ex) {
            logger.error("Database error during login", ex);
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Database unavailable");
        }
    }

    private String generateToken(String subject) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
            .subject(subject)
            .issuedAt(now)
            .expiration(expiry)
            .signWith(Keys.hmacShaKeyFor(secretBytes))
            .compact();
    }
}