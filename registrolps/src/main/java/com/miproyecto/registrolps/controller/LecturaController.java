package com.miproyecto.registrolps.controller;

import com.miproyecto.registrolps.entity.Lectura;
import com.miproyecto.registrolps.service.LecturaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lecturas")
@RequiredArgsConstructor
public class LecturaController {

    private final LecturaService lecturaService;

    // Listar todas las lecturas de un usuario (más reciente primero)
    // Ejemplo: GET /api/lecturas?usuarioId=1
    @GetMapping("/todos")
    public ResponseEntity<List<Lectura>> listarTodos() {
        return ResponseEntity.ok(lecturaService.listarTodos());
    }

    @GetMapping
    public ResponseEntity<List<Lectura>> listar(@RequestParam Long usuarioId) {
        return ResponseEntity.ok(lecturaService.listarPorUsuario(usuarioId));
    }

    // Obtener una lectura por id
    // Ejemplo: GET /api/lecturas/5?usuarioId=1
    @GetMapping("/{id}")
    public ResponseEntity<Lectura> obtener(@PathVariable Long id,
                                           @RequestParam Long usuarioId) {
        return ResponseEntity.ok(lecturaService.obtenerPorId(id, usuarioId));
    }

    // Crear nueva lectura
    // Ejemplo: POST /api/lecturas?usuarioId=1
    @PostMapping
    public ResponseEntity<Lectura> crear(@RequestBody Lectura lectura,
                                         @RequestParam Long usuarioId) {
        Lectura creada = lecturaService.crear(lectura, usuarioId);
        return ResponseEntity.status(HttpStatus.CREATED).body(creada);
    }

    // Actualizar
    // Ejemplo: PUT /api/lecturas/5?usuarioId=1
    @PutMapping("/{id}")
    public ResponseEntity<Lectura> actualizar(@PathVariable Long id,
                                              @RequestBody Lectura datos,
                                              @RequestParam Long usuarioId) {
        return ResponseEntity.ok(lecturaService.actualizar(id, datos, usuarioId));
    }

    // Eliminar
    // Ejemplo: DELETE /api/lecturas/5?usuarioId=1
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id,
                                         @RequestParam Long usuarioId) {
        lecturaService.eliminar(id, usuarioId);
        return ResponseEntity.noContent().build();
    }

    // Búsqueda
    // Ejemplo: GET /api/lecturas/buscar?usuarioId=1&campo=titulo&valor=harry
    @GetMapping("/buscar")
    public ResponseEntity<List<Lectura>> buscar(
            @RequestParam Long usuarioId,
            @RequestParam String campo,
            @RequestParam String valor) {
        return ResponseEntity.ok(lecturaService.buscar(usuarioId, campo, valor));
    }
}