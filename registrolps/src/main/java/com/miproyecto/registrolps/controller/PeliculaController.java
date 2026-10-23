package com.miproyecto.registrolps.controller;

import com.miproyecto.registrolps.entity.Pelicula;
import com.miproyecto.registrolps.service.PeliculaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/peliculas")
@RequiredArgsConstructor
public class PeliculaController {

    private final PeliculaService peliculaService;

    @GetMapping("/todos")
    public ResponseEntity<List<Pelicula>> listarTodos() {
        return ResponseEntity.ok(peliculaService.listarTodos());
    }

    @GetMapping
    public ResponseEntity<List<Pelicula>> listar(@RequestParam Long usuarioId) {
        return ResponseEntity.ok(peliculaService.listarPorUsuario(usuarioId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pelicula> obtener(@PathVariable Long id, @RequestParam Long usuarioId) {
        return ResponseEntity.ok(peliculaService.obtenerPorId(id, usuarioId));
    }

    @PostMapping
    public ResponseEntity<Pelicula> crear(@RequestBody Pelicula pelicula, @RequestParam Long usuarioId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(peliculaService.crear(pelicula, usuarioId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pelicula> actualizar(@PathVariable Long id, @RequestBody Pelicula datos, @RequestParam Long usuarioId) {
        return ResponseEntity.ok(peliculaService.actualizar(id, datos, usuarioId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id, @RequestParam Long usuarioId) {
        peliculaService.eliminar(id, usuarioId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Pelicula>> buscar(@RequestParam Long usuarioId, @RequestParam String campo, @RequestParam String valor) {
        return ResponseEntity.ok(peliculaService.buscar(usuarioId, campo, valor));
    }
}