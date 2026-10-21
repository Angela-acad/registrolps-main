package com.miproyecto.registrolps.service;

import com.miproyecto.registrolps.entity.Lectura;
import com.miproyecto.registrolps.entity.Usuario;
import com.miproyecto.registrolps.entity.enums.Disponibilidad;
import com.miproyecto.registrolps.entity.enums.Estado;
import com.miproyecto.registrolps.entity.enums.Valoracion;
import com.miproyecto.registrolps.repository.LecturaRepository;
import com.miproyecto.registrolps.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class LecturaService {

    private final LecturaRepository lecturaRepository;
    private final UsuarioRepository usuarioRepository;

    public LecturaService(LecturaRepository lecturaRepository,
                          UsuarioRepository usuarioRepository) {
        this.lecturaRepository = lecturaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    private Usuario obtenerUsuarioActivo(Long usuarioId) {
        return usuarioRepository
                .findByIdAndDisponibilidad(usuarioId, Disponibilidad.existe)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Transactional(readOnly = true)
    public List<Lectura> listarPorUsuario(Long usuarioId) {
        Usuario usuario = obtenerUsuarioActivo(usuarioId);
        return lecturaRepository.findByUsuarioAndDisponibilidadOrderByFechaCreacionDesc(
                usuario, Disponibilidad.existe);
    }

    @Transactional(readOnly = true)
    public Lectura obtenerPorId(Long id, Long usuarioId) {
        Usuario usuario = obtenerUsuarioActivo(usuarioId);
        return lecturaRepository
                .findByIdAndUsuarioAndDisponibilidad(id, usuario, Disponibilidad.existe)
                .orElseThrow(() -> new RuntimeException("Lectura no encontrada"));
    }

    @Transactional
    public Lectura crear(Lectura lectura, Long usuarioId) {
        Usuario usuario = obtenerUsuarioActivo(usuarioId);
        lectura.setUsuario(usuario);
        lectura.setDisponibilidad(Disponibilidad.existe);
        return lecturaRepository.save(lectura);
    }

    @Transactional
    public Lectura actualizar(Long id, Lectura datos, Long usuarioId) {
        Lectura lectura = obtenerPorId(id, usuarioId);

        lectura.setTitulo(datos.getTitulo());
        lectura.setAutor(datos.getAutor());
        lectura.setTipo(datos.getTipo());
        lectura.setEstado(datos.getEstado());
        lectura.setValoracion(datos.getValoracion());
        lectura.setNumeroVolumenes(datos.getNumeroVolumenes());
        lectura.setNumeroCapitulos(datos.getNumeroCapitulos());
        lectura.setComentario(datos.getComentario());

        return lecturaRepository.save(lectura);
    }

    /** Soft delete */
    @Transactional
    public void eliminar(Long id, Long usuarioId) {
        Lectura lectura = obtenerPorId(id, usuarioId);
        lectura.setDisponibilidad(Disponibilidad.inexistente);
        lecturaRepository.save(lectura);
    }

    @Transactional(readOnly = true)
    public List<Lectura> buscar(Long usuarioId, String campo, String valor) {
        Usuario usuario = obtenerUsuarioActivo(usuarioId);

        if (valor == null || valor.isBlank()) {
            return listarPorUsuario(usuarioId);
        }

        return switch (campo.toLowerCase()) {
            case "titulo" -> lecturaRepository
                    .findByUsuarioAndDisponibilidadAndTituloContainingIgnoreCaseOrderByFechaCreacionDesc(
                            usuario, Disponibilidad.existe, valor);
            case "estado" -> {
                try {
                    Estado estado = Estado.valueOf(valor);
                    yield lecturaRepository
                            .findByUsuarioAndDisponibilidadAndEstadoOrderByFechaCreacionDesc(
                                    usuario, Disponibilidad.existe, estado);
                } catch (IllegalArgumentException e) {
                    yield List.of();
                }
            }
            case "valoracion" -> {
                try {
                    Valoracion valoracion = Valoracion.valueOf(valor);
                    yield lecturaRepository
                            .findByUsuarioAndDisponibilidadAndValoracionOrderByFechaCreacionDesc(
                                    usuario, Disponibilidad.existe, valoracion);
                } catch (IllegalArgumentException e) {
                    yield List.of();
                }
            }
            default -> listarPorUsuario(usuarioId);
        };
    }
}