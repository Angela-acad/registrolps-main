package com.miproyecto.registrolps.service;

import com.miproyecto.registrolps.entity.Pelicula;
import com.miproyecto.registrolps.entity.Usuario;
import com.miproyecto.registrolps.entity.enums.Disponibilidad;
import com.miproyecto.registrolps.entity.enums.Estado;
import com.miproyecto.registrolps.entity.enums.Valoracion;
import com.miproyecto.registrolps.repository.PeliculaRepository;
import com.miproyecto.registrolps.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PeliculaService {

    private final PeliculaRepository peliculaRepository;
    private final UsuarioRepository usuarioRepository;

    public PeliculaService(PeliculaRepository peliculaRepository,
                           UsuarioRepository usuarioRepository) {
        this.peliculaRepository = peliculaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    private Usuario obtenerUsuarioActivo(Long usuarioId) {
        return usuarioRepository
                .findByIdAndDisponibilidad(usuarioId, Disponibilidad.existe)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Transactional(readOnly = true)
    public List<Pelicula> listarPorUsuario(Long usuarioId) {
        Usuario usuario = obtenerUsuarioActivo(usuarioId);
        return peliculaRepository.findByUsuarioAndDisponibilidadOrderByIdDesc(
                usuario, Disponibilidad.existe);
    }

    @Transactional(readOnly = true)
    public Pelicula obtenerPorId(Long id, Long usuarioId) {
        Usuario usuario = obtenerUsuarioActivo(usuarioId);
        return peliculaRepository
                .findByIdAndUsuarioAndDisponibilidad(id, usuario, Disponibilidad.existe)
                .orElseThrow(() -> new RuntimeException("Película no encontrada"));
    }

    @Transactional
    public Pelicula crear(Pelicula pelicula, Long usuarioId) {
        Usuario usuario = obtenerUsuarioActivo(usuarioId);
        pelicula.setUsuario(usuario);
        pelicula.setDisponibilidad(Disponibilidad.existe);
        return peliculaRepository.save(pelicula);
    }

    @Transactional
    public Pelicula actualizar(Long id, Pelicula datos, Long usuarioId) {
        Pelicula pelicula = obtenerPorId(id, usuarioId);

        pelicula.setTitulo(datos.getTitulo());
        pelicula.setDuracionMinutos(datos.getDuracionMinutos());
        pelicula.setActorPrincipal(datos.getActorPrincipal());
        pelicula.setGenero(datos.getGenero());
        pelicula.setEstado(datos.getEstado());
        pelicula.setValoracion(datos.getValoracion());
        pelicula.setComentario(datos.getComentario());
<<<<<<< HEAD
        pelicula.setPortadaUrl(datos.getPortadaUrl());
=======

>>>>>>> b63a53554078ffc468a5affe6299906ced4b88ae
        return peliculaRepository.save(pelicula);
    }

    @Transactional
    public void eliminar(Long id, Long usuarioId) {
        Pelicula pelicula = obtenerPorId(id, usuarioId);
        pelicula.setDisponibilidad(Disponibilidad.inexistente);
        peliculaRepository.save(pelicula);
    }

    @Transactional(readOnly = true)
    public List<Pelicula> buscar(Long usuarioId, String campo, String valor) {
        Usuario usuario = obtenerUsuarioActivo(usuarioId);

        if (valor == null || valor.isBlank()) {
            return listarPorUsuario(usuarioId);
        }

        return switch (campo.toLowerCase()) {
            case "titulo" -> peliculaRepository
                    .findByUsuarioAndDisponibilidadAndTituloContainingIgnoreCaseOrderByIdDesc(
                            usuario, Disponibilidad.existe, valor);
            case "estado" -> {
                try {
                    Estado estado = Estado.valueOf(valor);
                    yield peliculaRepository
                            .findByUsuarioAndDisponibilidadAndEstadoOrderByIdDesc(
                                    usuario, Disponibilidad.existe, estado);
                } catch (IllegalArgumentException e) {
                    yield List.of();
                }
            }
            case "valoracion" -> {
                try {
                    Valoracion valoracion = Valoracion.valueOf(valor);
                    yield peliculaRepository
                            .findByUsuarioAndDisponibilidadAndValoracionOrderByIdDesc(
                                    usuario, Disponibilidad.existe, valoracion);
                } catch (IllegalArgumentException e) {
                    yield List.of();
                }
            }
            default -> listarPorUsuario(usuarioId);
        };
    }
}