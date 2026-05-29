package com.movieapp.movie_backend.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import com.movieapp.movie_backend.dto.AuthResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<AuthResponse> handleDataAccess(DataAccessException ex) {
        logger.error("Database access error", ex);
        AuthResponse resp = new AuthResponse(false, "Database unavailable", null, null);
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(resp);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<AuthResponse> handleResponseStatus(ResponseStatusException ex) {
        logger.warn("Request rejected: {}", ex.getReason(), ex);
        AuthResponse resp = new AuthResponse(false, ex.getReason(), null, null);
        return ResponseEntity.status(ex.getStatusCode()).body(resp);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<AuthResponse> handleOther(Exception ex) {
        logger.error("Unhandled exception", ex);
        AuthResponse resp = new AuthResponse(false, "Internal server error", null, null);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(resp);
    }
}
