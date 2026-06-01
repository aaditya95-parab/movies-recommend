package com.movieapp.movie_backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.movieapp.movie_backend.entity.AuditLog;
import com.movieapp.movie_backend.entity.Document;
import com.movieapp.movie_backend.repository.AuditLogsrepo;
import com.movieapp.movie_backend.repository.DocumentRepo;

@Service
public class DocumentService {

    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);

    @Autowired
    private DocumentRepo repository;

    @Transactional
    public String uploadFile(
            String title,
            String category,
            String department,
            String description,
            String tags,
            String username,
            MultipartFile file
    ) {

        logger.info("Service hit for uploadFile. title={}, category={}, department={}, fileName={}, size={}",
                title,
                category,
                department,
                file != null ? file.getOriginalFilename() : null,
                file != null ? file.getSize() : null);

        if (title == null || title.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Document title is required");
        }

        if (category == null || category.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Document category is required");
        }

        if (department == null || department.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Department is required");
        }

        if (description == null || description.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Description is required");
        }

        if (tags == null || tags.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tags are required");
        }

        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is required");
        }

        try {

            Path uploadDir = Paths.get(System.getProperty("user.home"), "Desktop", "MovieUploads")
                 .toAbsolutePath()
                 .normalize();

            Files.createDirectories(uploadDir);

            String originalFilename = Objects.requireNonNull(
                    file.getOriginalFilename(),
                    "Original filename is required"
            );

            Path targetFile = uploadDir.resolve(originalFilename).normalize();

            logger.info("Before file.transferTo. targetFile={}", targetFile);
            file.transferTo(targetFile);

            Document doc = new Document();

            doc.setTitle(title);
            doc.setDocumentName(title);
            doc.setCategory(category);
            doc.setDepartment(department);
            doc.setDescription(description);
            doc.setTags(tags);

            doc.setFileName(originalFilename);
            doc.setFilePath(targetFile.toString());
            doc.setUploadTime(LocalDateTime.now());

            logger.info("Before repository.saveAndFlush. document={}", doc.getFileName());

            Document savedDocument = repository.saveAndFlush(doc);

            logger.info("After repository.saveAndFlush. documentId={}", savedDocument.getId());
              
            AuditLog auditLog = new AuditLog();

            auditLog.setDocumentId(savedDocument.getId());
            auditLog.setAction("UPLOAD");
            auditLog.setFileName(savedDocument.getFileName());
            auditLog.setDescription(savedDocument.getDescription());
            auditLog.setPerformedBy(username);
            auditLog.setActionTime(LocalDateTime.now());

            auditLogRepo.saveAndFlush(auditLog);

            logger.info("UPLOAD audit log saved. documentId={}, username={}",
                    savedDocument.getId(),
                    username);
        } catch (IOException | DataAccessException e) {
            if (e instanceof IOException) {
                logger.error("File write failed", e);
                throw new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "Could not write uploaded file",
                        e
                );
            }

            logger.error("Database write failed", e);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Could not save document metadata",
                    e
            );
        }

        return "File uploaded successfully";
    }

    public List<Document> getAllDocuments() {
        return repository.findAll();
    }

    public Document getDocumentById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Document not found"
                ));
    }
     @Autowired
     private AuditLogsrepo auditLogRepo;

    @Transactional
public void deleteDocument(Long id, String username) {

    Document document = repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Document not found"
            ));

    try {
        Path filePath = Paths.get(document.getFilePath());

        Files.deleteIfExists(filePath);

        AuditLog auditLog = new AuditLog();
        auditLog.setDocumentId(document.getId());
        auditLog.setAction("DELETE");
        auditLog.setFileName(document.getFileName());
        auditLog.setDescription(document.getDescription());
        auditLog.setPerformedBy(username);
        auditLog.setActionTime(LocalDateTime.now());

        auditLogRepo.save(auditLog);

        repository.deleteById(id);

        logger.info("Document deleted successfully. id={}, filePath={}", id, filePath);

    } catch (IOException e) {
        logger.error("File delete failed", e);
        throw new ResponseStatusException(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Could not delete document file",
                e
        );
    }
}
}