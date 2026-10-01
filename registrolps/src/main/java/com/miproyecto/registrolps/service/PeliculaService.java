package com.miproyecto.registrolps.service;

import com.miproyecto.registrolps.entity.Pelicula;
import com.miproyecto.registrolps.entity.enums.Estado;
import com.miproyecto.registrolps.entity.enums.Valoracion;
import com.miproyecto.registrolps.repository.PeliculaRepository;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class PeliculaService {

    private final PeliculaRepository peliculaRepository;

    PeliculaService(PeliculaRepository peliculaRepository) {
        this.peliculaRepository = peliculaRepository;
    }

    public Pelicula crearPelicula(Pelicula pelicula) {
        validarReglaValoracion(pelicula);
        return peliculaRepository.save(pelicula);
    }

    private void validarReglaValoracion(Pelicula pelicula) {
        boolean esFinalizadoOAbandonado = pelicula.getEstado() == Estado.Finalizado 
                                       || pelicula.getEstado() == Estado.Abandonado;
        if (!esFinalizadoOAbandonado) {
            pelicula.setValoracion(null);
        }
    }

    public List<Pelicula> obtenerTodas() {
        return peliculaRepository.findAll();
    }

    public Pelicula obtenerPorId(Long id) {
        return peliculaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No se encontró la película con el ID: " + id));
    }

    public List<Pelicula> buscarPorFiltro(String filtro, String valor) {
        if (valor == null || valor.isBlank()) {
            return peliculaRepository.findAll();
        }

        switch (filtro.toLowerCase()) {
            case "actor":
            case "actorprincipal":
                return peliculaRepository.findByActorPrincipalContainingIgnoreCase(valor);
            case "genero":
                return peliculaRepository.findByGeneroContainingIgnoreCase(valor);
            case "estado":
                return peliculaRepository.findByEstado(Estado.valueOf(valor));
            case "valoracion":
                return peliculaRepository.findByValoracion(Valoracion.valueOf(valor));
            case "titulo":
            default:
                return peliculaRepository.findByTituloContainingIgnoreCase(valor);
        }
    }

    public Pelicula actualizarPelicula(Long id, Pelicula peliculaDetalles) {
        Pelicula peliculaExistente = obtenerPorId(id);

        peliculaExistente.setTitulo(peliculaDetalles.getTitulo());
        peliculaExistente.setActorPrincipal(peliculaDetalles.getActorPrincipal());
        peliculaExistente.setGenero(peliculaDetalles.getGenero());
        peliculaExistente.setEstado(peliculaDetalles.getEstado());
        peliculaExistente.setComentario(peliculaDetalles.getComentario());
        peliculaExistente.setValoracion(peliculaDetalles.getValoracion());
        validarReglaValoracion(peliculaExistente);

        return peliculaRepository.save(peliculaExistente);
    }

    public void eliminarPelicula(Long id) {
        if (!peliculaRepository.existsById(id)) {
            throw new RuntimeException("No existe la película con el ID: " + id);
        }
        peliculaRepository.deleteById(id);
    }
}