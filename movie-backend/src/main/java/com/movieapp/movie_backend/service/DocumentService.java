package com.movieapp.movie_backend.service;

import java.io.File;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.movieapp.movie_backend.entity.Document;
import com.movieapp.movie_backend.repository.DocumentRepo;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepo repository;

    public String uploadFile(
            String title,
            MultipartFile file
    ) {

        try {

            String uploadDir = "uploads/";

            File dir = new File(uploadDir);

            if (!dir.exists()) {
                dir.mkdirs();
            }

            String filePath =
                    uploadDir + file.getOriginalFilename();

            file.transferTo(new File(filePath));

            Document doc = new Document();

            doc.setTitle(title);
            doc.setFileName(file.getOriginalFilename());
            doc.setFilePath(filePath);
            doc.setUploadTime(LocalDateTime.now());

            repository.save(doc);
            System.out.println("Service Hit");
            System.out.println("Saved to DB successfully");
            System.out.println(doc.getFileName());

        } catch (Exception e) {

            e.printStackTrace();

            return "Upload failed";
        }
        return "File uploaded successfully";
    }
}