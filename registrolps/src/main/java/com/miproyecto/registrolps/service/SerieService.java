package com.miproyecto.registrolps.service;

import com.miproyecto.registrolps.entity.Serie;
import com.miproyecto.registrolps.entity.Usuario;
import com.miproyecto.registrolps.entity.enums.Estado;
import com.miproyecto.registrolps.entity.enums.Valoracion;
import com.miproyecto.registrolps.repository.SerieRepository;
import com.miproyecto.registrolps.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SerieService {

    private final SerieRepository serieRepository;
    private final UsuarioRepository usuarioRepository;

    private Usuario obtenerUsuario(Long usuarioId) {
        return usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Transactional
    public Serie crearSerie(Serie serie, Long usuarioId) {
        serie.setUsuario(obtenerUsuario(usuarioId));
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

    @Transactional(readOnly = true)
    public List<Serie> obtenerTodas(Long usuarioId) {
        return serieRepository.findByUsuarioOrderByFechaCreacionDesc(obtenerUsuario(usuarioId));
    }

    @Transactional(readOnly = true)
    public Serie obtenerPorId(Long id, Long usuarioId) {
        return serieRepository.findByIdAndUsuario(id, obtenerUsuario(usuarioId))
                .orElseThrow(() -> new RuntimeException("No se encontró la serie con el ID: " + id));
    }

    @Transactional(readOnly = true)
    public List<Serie> buscarPorFiltro(Long usuarioId, String filtro, String valor) {
        Usuario usuario = obtenerUsuario(usuarioId);
        if (valor == null || valor.isBlank()) {
            return serieRepository.findByUsuarioOrderByFechaCreacionDesc(usuario);
        }

        switch (filtro.toLowerCase()) {
            case "actor":
            case "actorprincipal":
                return serieRepository.findByUsuarioAndActorPrincipalContainingIgnoreCaseOrderByFechaCreacionDesc(usuario, valor);
            case "genero":
                return serieRepository.findByUsuarioAndGeneroContainingIgnoreCaseOrderByFechaCreacionDesc(usuario, valor);
            case "estado":
                try {
                    return serieRepository.findByUsuarioAndEstadoOrderByFechaCreacionDesc(usuario, Estado.valueOf(valor));
                } catch (IllegalArgumentException e) {
                    return List.of();
                }
            case "valoracion":
                try {
                    return serieRepository.findByUsuarioAndValoracionOrderByFechaCreacionDesc(usuario, Valoracion.valueOf(valor));
                } catch (IllegalArgumentException e) {
                    return List.of();
                }
            case "titulo":
            default:
                return serieRepository.findByUsuarioAndTituloContainingIgnoreCaseOrderByFechaCreacionDesc(usuario, valor);
        }
    }

    @Transactional
    public Serie actualizarSerie(Long id, Serie serieDetalles, Long usuarioId) {
    Serie serieExistente = obtenerPorId(id, usuarioId);

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

    @Transactional
    public void eliminarSerie(Long id, Long usuarioId) {
        serieRepository.delete(obtenerPorId(id, usuarioId));
    }
}