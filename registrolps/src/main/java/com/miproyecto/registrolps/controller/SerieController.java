package com.miproyecto.registrolps.controller;

import com.miproyecto.registrolps.entity.Serie;
import com.miproyecto.registrolps.service.SerieService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/series")
@CrossOrigin(origins = "*")
public class SerieController {

    private final SerieService serieService;

    public SerieController(SerieService serieService) {
        this.serieService = serieService;
    }

    @GetMapping("/todos")
    public ResponseEntity<List<Serie>> obtenerTodasAdmin() {
        return ResponseEntity.ok(serieService.obtenerTodas());
    }

    @GetMapping
    public ResponseEntity<?> listar(@RequestParam Long usuarioId) {
        try {
            return ResponseEntity.ok(serieService.listarPorUsuario(usuarioId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtener(@PathVariable Long id,
                                     @RequestParam Long usuarioId) {
        try {
            return ResponseEntity.ok(serieService.obtenerPorId(id, usuarioId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Serie serie,
                                   @RequestParam Long usuarioId) {
        try {
            Serie creada = serieService.crear(serie, usuarioId);
            return ResponseEntity.status(HttpStatus.CREATED).body(creada);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id,
                                        @RequestBody Serie datos,
                                        @RequestParam Long usuarioId) {
        try {
            return ResponseEntity.ok(serieService.actualizar(id, datos, usuarioId));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id,
                                      @RequestParam Long usuarioId) {
        try {
            serieService.eliminar(id, usuarioId);
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
            return ResponseEntity.ok(serieService.buscar(usuarioId, campo, valor));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", e.getMessage()));
        }
    }
}