package com.miproyecto.registrolps.service;

import com.miproyecto.registrolps.entity.Pelicula;
import com.miproyecto.registrolps.entity.Usuario;
import com.miproyecto.registrolps.entity.enums.Estado;
import com.miproyecto.registrolps.entity.enums.Valoracion;
import com.miproyecto.registrolps.repository.PeliculaRepository;
import com.miproyecto.registrolps.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PeliculaService {

    private final PeliculaRepository peliculaRepository;
    private final UsuarioRepository usuarioRepository;

    private Usuario obtenerUsuario(Long usuarioId) {
        return usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Transactional(readOnly = true)
    public List<Pelicula> listarPorUsuario(Long usuarioId) {
        Usuario usuario = obtenerUsuario(usuarioId);
        return peliculaRepository.findByUsuarioOrderByFechaCreacionDesc(usuario);
    }

    @Transactional(readOnly = true)
    public Pelicula obtenerPorId(Long id, Long usuarioId) {
        Usuario usuario = obtenerUsuario(usuarioId);
        return peliculaRepository.findByIdAndUsuario(id, usuario)
                .orElseThrow(() -> new RuntimeException("Pelicula no encontrada o no pertenece al usuario"));
    }

    @Transactional
    public Pelicula crear(Pelicula pelicula, Long usuarioId) {
        Usuario usuario = obtenerUsuario(usuarioId);
        pelicula.setUsuario(usuario);
        return peliculaRepository.save(pelicula);
    }

    @Transactional
    public Pelicula actualizar(Long id, Pelicula datos, Long usuarioId) {
        Pelicula pelicula = obtenerPorId(id, usuarioId);
        pelicula.setTitulo(datos.getTitulo());
        pelicula.setActorPrincipal(datos.getActorPrincipal());
        pelicula.setDuracionMinutos(datos.getDuracionMinutos());
        pelicula.setGenero(datos.getGenero());
        pelicula.setEstado(datos.getEstado());
        pelicula.setValoracion(datos.getValoracion());
        pelicula.setComentario(datos.getComentario());
        return peliculaRepository.save(pelicula);
    }

    @Transactional
    public void eliminar(Long id, Long usuarioId) {
        Pelicula pelicula = obtenerPorId(id, usuarioId);
        peliculaRepository.delete(pelicula);
    }

    @Transactional(readOnly = true)
    public List<Pelicula> buscar(Long usuarioId, String campo, String valor) {
        Usuario usuario = obtenerUsuario(usuarioId);
        if (valor == null || valor.isBlank()) {
            return peliculaRepository.findByUsuarioOrderByFechaCreacionDesc(usuario);
        }
        return switch (campo.toLowerCase()) {
            case "titulo" -> peliculaRepository.findByUsuarioAndTituloContainingIgnoreCaseOrderByFechaCreacionDesc(usuario, valor);
            case "estado" -> {
                try {
                    Estado estado = Estado.valueOf(valor);
                    yield peliculaRepository.findByUsuarioAndEstadoOrderByFechaCreacionDesc(usuario, estado);
                } catch (IllegalArgumentException e) { yield List.of(); }
            }
            case "valoracion" -> {
                try {
                    Valoracion valoracion = Valoracion.valueOf(valor);
                    yield peliculaRepository.findByUsuarioAndValoracionOrderByFechaCreacionDesc(usuario, valoracion);
                } catch (IllegalArgumentException e) { yield List.of(); }
            }
            default -> peliculaRepository.findByUsuarioOrderByFechaCreacionDesc(usuario);
        };
    }
}