package com.movieapp.movie_backend.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.movieapp.movie_backend.dto.AuthResponse;
import com.movieapp.movie_backend.dto.LoginRequest;
import com.movieapp.movie_backend.service.AuthService;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {

        try {
            Object svcResult = authService.authenticate(request);

            if (svcResult instanceof AuthResponse) {
                return ResponseEntity.ok((AuthResponse) svcResult);
            }

            if (svcResult instanceof String) {
                String token = (String) svcResult;
                AuthResponse response = new AuthResponse();
                response.setSuccess(true);
                response.setMessage("Login Successful");
                response.setToken(token);
                response.setUsername(request != null ? request.getUsername() : null);
                return ResponseEntity.ok(response);
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new AuthResponse(false, "Unexpected login result", null, null));
        } catch (ResponseStatusException ex) {
            logger.warn("Login failed: {}", ex.getReason());
            return ResponseEntity.status(ex.getStatusCode().value())
                .body(new AuthResponse(false, ex.getReason(), null, null));
        } catch (Exception ex) {
            logger.error("Unexpected login error", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new AuthResponse(false, "Unexpected error", null, null));
        }
    }
}