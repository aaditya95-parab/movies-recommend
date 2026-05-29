package com.movieapp.movie_backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

import com.movieapp.movie_backend.entity.Document;
import com.movieapp.movie_backend.repository.DocumentRepo;

@Service
public class DocumentService {

    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);

    @Autowired
    private DocumentRepo repository;

    @Transactional
    public String uploadFile(
            String title,
            MultipartFile file
    ) {

        logger.info("Service hit for uploadFile. title={}, fileName={}, size={}",
            title,
            file != null ? file.getOriginalFilename() : null,
            file != null ? file.getSize() : null);

        if (title == null || title.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Document title is required");
        }

        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is required");
        }

        try {

            Path uploadDir = Paths.get("uploads").toAbsolutePath().normalize();
            Files.createDirectories(uploadDir);

            String originalFilename = Objects.requireNonNull(file.getOriginalFilename(), "Original filename is required");
            Path targetFile = uploadDir.resolve(originalFilename).normalize();

            logger.info("Before file.transferTo. targetFile={}", targetFile);
            file.transferTo(targetFile);

            Document doc = new Document();

            doc.setTitle(title);
            doc.setFileName(originalFilename);
            doc.setFilePath(targetFile.toString());
            doc.setUploadTime(LocalDateTime.now());

            logger.info("Before repository.saveAndFlush. document={}", doc.getFileName());
            Document savedDocument = repository.saveAndFlush(doc);
            logger.info("After repository.saveAndFlush. documentId={}", savedDocument.getId());

        } catch (IOException e) {
            logger.error("File write failed", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not write uploaded file", e);
        } catch (DataAccessException e) {
            logger.error("Database write failed", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not save document metadata", e);
        } catch (Exception e) {
            logger.error("Unexpected upload failure", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Upload failed", e);
        }

        return "File uploaded successfully";
    }
}