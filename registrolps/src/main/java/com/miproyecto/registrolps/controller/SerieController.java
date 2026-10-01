package com.miproyecto.registrolps.controller;

import com.miproyecto.registrolps.entity.Serie;
import com.miproyecto.registrolps.service.SerieService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/series")
@CrossOrigin(origins = "*")
public class SerieController {

    private final SerieService serieService;

    public SerieController(SerieService serieService) {
        this.serieService = serieService;
    }

    @GetMapping
    public ResponseEntity<List<Serie>> obtenerTodas() {
        return ResponseEntity.ok(serieService.obtenerTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Serie> obtenerPorId(@PathVariable Long id) {
        return ResponseEntity.ok(serieService.obtenerPorId(id));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Serie>> buscarPorFiltro(
            @RequestParam(defaultValue = "titulo") String filtro,
            @RequestParam(required = false) String valor) {
        return ResponseEntity.ok(serieService.buscarPorFiltro(filtro, valor));
    }

    @PostMapping
    public ResponseEntity<Serie> crearSerie(@RequestBody Serie serie) {
        Serie nuevaSerie = serieService.crearSerie(serie);
        return new ResponseEntity<>(nuevaSerie, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Serie> actualizarSerie(@PathVariable Long id, @RequestBody Serie serie) {
        Serie serieActualizada = serieService.actualizarSerie(id, serie);
        return ResponseEntity.ok(serieActualizada);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarSerie(@PathVariable Long id) {
        serieService.eliminarSerie(id);
        return ResponseEntity.noContent().build();
    }
}