package com.miproyecto.registrolps.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*") // Permite que React pueda llamar a este endpoint
public class FileController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping
    public ResponseEntity<?> subirImagen(@RequestParam("archivo") MultipartFile archivo) {
        if (archivo.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("mensaje", "El archivo está vacío"));
        }

        try {
            // 1. Crear la carpeta si no existe
            Path directorio = Paths.get(uploadDir);
            if (!Files.exists(directorio)) {
                Files.createDirectories(directorio);
            }

            // 2. Generar un nombre único para evitar colisiones
            String nombreOriginal = archivo.getOriginalFilename();
            String extension = nombreOriginal.substring(nombreOriginal.lastIndexOf("."));
            String nuevoNombre = UUID.randomUUID().toString() + extension;

            // 3. Guardar el archivo en el disco
            Path rutaCompleta = directorio.resolve(nuevoNombre);
            Files.copy(archivo.getInputStream(), rutaCompleta);

            // 4. Devolver la URL relativa
            String urlRelativa = "/uploads/" + nuevoNombre;
            return ResponseEntity.ok(Map.of("url", urlRelativa));

        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("mensaje", "Error al guardar la imagen: " + e.getMessage()));
        }
    }
}