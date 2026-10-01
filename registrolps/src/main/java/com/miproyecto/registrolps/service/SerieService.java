package com.miproyecto.registrolps.service;

import com.miproyecto.registrolps.entity.Serie;
import com.miproyecto.registrolps.entity.enums.Estado;
import com.miproyecto.registrolps.entity.enums.Valoracion;
import com.miproyecto.registrolps.repository.SerieRepository;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class SerieService {

    private final SerieRepository serieRepository;

    SerieService(SerieRepository serieRepository) {
        this.serieRepository = serieRepository;
    }

    public Serie crearSerie(Serie serie) {
        validarReglaValoracion(serie);
        return serieRepository.save(serie);
    }

    private void validarReglaValoracion(Serie serie) {
        boolean esFinalizadoOAbandonado = serie.getEstado() == Estado.Finalizado 
                                       || serie.getEstado() == Estado.Abandonado;
        if (!esFinalizadoOAbandonado) {
            serie.setValoracion(null);
        }
    }

    public List<Serie> obtenerTodas() {
    return serieRepository.findAll();
    }

    public Serie obtenerPorId(Long id) {
        return serieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No se encontró la serie con el ID: " + id));
    }

    public List<Serie> buscarPorFiltro(String filtro, String valor) {
        if (valor == null || valor.isBlank()) {
            return serieRepository.findAll();
        }

        switch (filtro.toLowerCase()) {
            case "actor":
            case "actorprincipal":
                return serieRepository.findByActorPrincipalContainingIgnoreCase(valor);
            case "genero":
                return serieRepository.findByGeneroContainingIgnoreCase(valor);
            case "estado":
                return serieRepository.findByEstado(Estado.valueOf(valor));
            case "valoracion":
                return serieRepository.findByValoracion(Valoracion.valueOf(valor));
            case "titulo":
            default:
                return serieRepository.findByTituloContainingIgnoreCase(valor);
        }
    }

    public Serie actualizarSerie(Long id, Serie serieDetalles) {
    Serie serieExistente = obtenerPorId(id);

    serieExistente.setTitulo(serieDetalles.getTitulo());
    serieExistente.setActorPrincipal(serieDetalles.getActorPrincipal());
    serieExistente.setGenero(serieDetalles.getGenero());
    serieExistente.setEstado(serieDetalles.getEstado());
    serieExistente.setNumeroCapitulos(serieDetalles.getNumeroCapitulos());
    serieExistente.setComentario(serieDetalles.getComentario());
    serieExistente.setValoracion(serieDetalles.getValoracion());
    validarReglaValoracion(serieExistente);

    return serieRepository.save(serieExistente);
    }

    public void eliminarSerie(Long id) {
    if (!serieRepository.existsById(id)) {
        throw new RuntimeException("No existe la serie con el ID: " + id);
    }
    serieRepository.deleteById(id);
    }
}