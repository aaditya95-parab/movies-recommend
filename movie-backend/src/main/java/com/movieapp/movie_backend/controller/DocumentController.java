package com.movieapp.movie_backend.controller;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.movieapp.movie_backend.entity.Document;
import com.movieapp.movie_backend.service.DocumentService;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(
    origins = {"http://localhost:5173", "http://localhost:5174"},
    methods = {
        RequestMethod.GET,
        RequestMethod.POST,
        RequestMethod.DELETE,
        RequestMethod.OPTIONS
    }
)
public class DocumentController {

    @Autowired
    private DocumentService service;
    
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public String uploadFile(
            @RequestParam("title") String title,
            @RequestParam("category") String category,
            @RequestParam("department") String department,
            @RequestParam("description") String description,
            @RequestParam("tags") String tags,
            @RequestParam("username") String username,
            @RequestParam("file") MultipartFile file
    ) {
        service.uploadFile(
                title,
                category,
                department,
                description,
                tags,
                username,
                file
        );

        return "File uploaded successfully";
    }

    @GetMapping("/all")
    public List<Document> getAllDocuments() {
        return service.getAllDocuments();
    }

    @GetMapping("/view/{id}")
public ResponseEntity<Resource> viewDocument(@PathVariable Long id) throws IOException {

    Document document = service.getDocumentById(id);

    Path path = Paths.get(document.getFilePath()).toAbsolutePath().normalize();

    Resource resource = new UrlResource(path.toUri());

    if (!resource.exists() || !resource.isReadable()) {
        throw new RuntimeException("File not found or not readable: " + document.getFilePath());
    }

    String contentType = Files.probeContentType(path);

    if (contentType == null) {
        contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
    }

    return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(contentType))
            .header("Content-Disposition", "inline; filename=\"" + document.getFileName() + "\"")
            .body(resource);
}

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteDocument(
        @PathVariable Long id,
        @RequestParam("username") String username
) {
    service.deleteDocument(id, username);

    return ResponseEntity.ok("Document deleted successfully");
}
}