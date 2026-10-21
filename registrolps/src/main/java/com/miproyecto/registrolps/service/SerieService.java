package com.miproyecto.registrolps.service;

import com.miproyecto.registrolps.entity.Serie;
import com.miproyecto.registrolps.entity.Usuario;
import com.miproyecto.registrolps.entity.enums.Disponibilidad;
import com.miproyecto.registrolps.entity.enums.Estado;
import com.miproyecto.registrolps.entity.enums.Valoracion;
import com.miproyecto.registrolps.repository.SerieRepository;
import com.miproyecto.registrolps.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SerieService {

    private final SerieRepository serieRepository;
    private final UsuarioRepository usuarioRepository;

    public SerieService(SerieRepository serieRepository,
                        UsuarioRepository usuarioRepository) {
        this.serieRepository = serieRepository;
        this.usuarioRepository = usuarioRepository;
    }

    private Usuario obtenerUsuarioActivo(Long usuarioId) {
        return usuarioRepository
                .findByIdAndDisponibilidad(usuarioId, Disponibilidad.existe)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Transactional(readOnly = true)
    public List<Serie> listarPorUsuario(Long usuarioId) {
        Usuario usuario = obtenerUsuarioActivo(usuarioId);
        return serieRepository.findByUsuarioAndDisponibilidadOrderByIdDesc(
                usuario, Disponibilidad.existe);
    }

    @Transactional(readOnly = true)
    public Serie obtenerPorId(Long id, Long usuarioId) {
        Usuario usuario = obtenerUsuarioActivo(usuarioId);
        return serieRepository
                .findByIdAndUsuarioAndDisponibilidad(id, usuario, Disponibilidad.existe)
                .orElseThrow(() -> new RuntimeException("Serie no encontrada"));
    }

    @Transactional
    public Serie crear(Serie serie, Long usuarioId) {
        Usuario usuario = obtenerUsuarioActivo(usuarioId);
        serie.setUsuario(usuario);
        serie.setDisponibilidad(Disponibilidad.existe);
        return serieRepository.save(serie);
    }

    @Transactional
    public Serie actualizar(Long id, Serie datos, Long usuarioId) {
        Serie serie = obtenerPorId(id, usuarioId);

        serie.setTitulo(datos.getTitulo());
        serie.setNumeroCapitulos(datos.getNumeroCapitulos());
        serie.setActorPrincipal(datos.getActorPrincipal());
        serie.setGenero(datos.getGenero());
        serie.setEstado(datos.getEstado());
        serie.setValoracion(datos.getValoracion());
        serie.setComentario(datos.getComentario());

        return serieRepository.save(serie);
    }

    @Transactional
    public void eliminar(Long id, Long usuarioId) {
        Serie serie = obtenerPorId(id, usuarioId);
        serie.setDisponibilidad(Disponibilidad.inexistente);
        serieRepository.save(serie);
    }

    @Transactional(readOnly = true)
    public List<Serie> buscar(Long usuarioId, String campo, String valor) {
        Usuario usuario = obtenerUsuarioActivo(usuarioId);

        if (valor == null || valor.isBlank()) {
            return listarPorUsuario(usuarioId);
        }

        return switch (campo.toLowerCase()) {
            case "titulo" -> serieRepository
                    .findByUsuarioAndDisponibilidadAndTituloContainingIgnoreCaseOrderByIdDesc(
                            usuario, Disponibilidad.existe, valor);
            case "estado" -> {
                try {
                    Estado estado = Estado.valueOf(valor);
                    yield serieRepository
                            .findByUsuarioAndDisponibilidadAndEstadoOrderByIdDesc(
                                    usuario, Disponibilidad.existe, estado);
                } catch (IllegalArgumentException e) {
                    yield List.of();
                }
            }
            case "valoracion" -> {
                try {
                    Valoracion valoracion = Valoracion.valueOf(valor);
                    yield serieRepository
                            .findByUsuarioAndDisponibilidadAndValoracionOrderByIdDesc(
                                    usuario, Disponibilidad.existe, valoracion);
                } catch (IllegalArgumentException e) {
                    yield List.of();
                }
<<<<<<< HEAD
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
    serieExistente.setPortadaUrl(serieDetalles.getPortadaUrl());
    validarReglaValoracion(serieExistente);

    return serieRepository.save(serieExistente);
    }

       @Transactional
    public void eliminarSerie(Long id, Long usuarioId) {
        Serie serie = obtenerPorId(id, usuarioId);
        serieRepository.delete(serie);
=======
            }
            default -> listarPorUsuario(usuarioId);
        };
>>>>>>> b63a53554078ffc468a5affe6299906ced4b88ae
    }
}