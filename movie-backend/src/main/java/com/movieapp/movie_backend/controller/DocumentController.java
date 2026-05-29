package com.movieapp.movie_backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.movieapp.movie_backend.service.DocumentService;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:5174")
public class DocumentController {

    @Autowired
    private DocumentService service;

    @PostMapping("/upload")
    public String uploadFile(

            @RequestParam("title") String title,

            @RequestParam("file") MultipartFile file

    ) {
        System.out.println("Controller hit")
        return service.uploadFile(title, file);
    }
}