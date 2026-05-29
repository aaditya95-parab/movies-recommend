package com.movieapp.movie_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.movieapp.movie_backend.entity.DmsUser;

public interface DmsUserRepository
        extends JpaRepository<DmsUser, String> {

    DmsUser findByUserId(String userId);
}