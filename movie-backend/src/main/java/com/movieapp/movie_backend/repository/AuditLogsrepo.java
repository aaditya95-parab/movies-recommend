package com.movieapp.movie_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.movieapp.movie_backend.entity.AuditLog;

@Repository
public interface AuditLogsrepo extends JpaRepository<AuditLog, Long> {

}