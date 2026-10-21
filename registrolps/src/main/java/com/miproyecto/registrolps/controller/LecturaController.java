package com.miproyecto.registrolps.controller;

import com.miproyecto.registrolps.entity.Lectura;
import com.miproyecto.registrolps.service.LecturaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/lecturas")
@CrossOrigin(origins = "*")
public class LecturaController {

    private final LecturaService lecturaService;

    public LecturaController(LecturaService lecturaService) {
        this.lecturaService = lecturaService;
    }

    @GetMapping
    public ResponseEntity<?> listar(@RequestParam Long usuarioId) {
        try {
            return ResponseEntity.ok(lecturaService.listarPorUsuario(usuarioId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id,
                                     @RequestParam Long usuarioId) {
        try {
            return ResponseEntity.ok(lecturaService.obtenerPorId(id, usuarioId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Lectura lectura,
                                   @RequestParam Long usuarioId) {
        try {
            Lectura creada = lecturaService.crear(lectura, usuarioId);
            return ResponseEntity.status(HttpStatus.CREATED).body(creada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id,
                                        @RequestBody Lectura datos,
                                        @RequestParam Long usuarioId) {
        try {
            return ResponseEntity.ok(lecturaService.actualizar(id, datos, usuarioId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id,
                                      @RequestParam Long usuarioId) {
        try {
            lecturaService.eliminar(id, usuarioId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", e.getMessage()));
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<?> buscar(@RequestParam Long usuarioId,
                                    @RequestParam String campo,
                                    @RequestParam String valor) {
        try {
            return ResponseEntity.ok(lecturaService.buscar(usuarioId, campo, valor));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", e.getMessage()));
        }
    }
}