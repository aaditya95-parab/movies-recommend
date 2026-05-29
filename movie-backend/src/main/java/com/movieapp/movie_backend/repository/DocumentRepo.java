package com.movieapp.movie_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.movieapp.movie_backend.entity.Document;

public interface DocumentRepo
       extends JpaRepository<Document, Long> {
}