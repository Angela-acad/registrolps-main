package com.miproyecto.registrolps.service;

import com.miproyecto.registrolps.entity.Lectura;
import com.miproyecto.registrolps.entity.Usuario;
import com.miproyecto.registrolps.entity.enums.Estado;
import com.miproyecto.registrolps.entity.enums.Valoracion;
import com.miproyecto.registrolps.repository.LecturaRepository;
import com.miproyecto.registrolps.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LecturaService {

    private final LecturaRepository lecturaRepository;
    private final UsuarioRepository usuarioRepository;

    private Usuario obtenerUsuario(Long usuarioId) {
        return usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    @Transactional(readOnly = true)
    public List<Lectura> listarPorUsuario(Long usuarioId) {
        Usuario usuario = obtenerUsuario(usuarioId);
        return lecturaRepository.findByUsuarioOrderByFechaCreacionDesc(usuario);
    }

    @Transactional(readOnly = true)
    public Lectura obtenerPorId(Long id, Long usuarioId) {
        Usuario usuario = obtenerUsuario(usuarioId);
        return lecturaRepository.findByIdAndUsuario(id, usuario)
                .orElseThrow(() -> new RuntimeException("Lectura no encontrada o no pertenece al usuario"));
    }

    @Transactional
    public Lectura crear(Lectura lectura, Long usuarioId) {
        Usuario usuario = obtenerUsuario(usuarioId);
        lectura.setUsuario(usuario);
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

    @Transactional
    public void eliminar(Long id, Long usuarioId) {
        Lectura lectura = obtenerPorId(id, usuarioId);
        lecturaRepository.delete(lectura);
    }

    @Transactional(readOnly = true)
    public List<Lectura> buscar(Long usuarioId, String campo, String valor) {
        Usuario usuario = obtenerUsuario(usuarioId);

        if (valor == null || valor.isBlank()) {
            return lecturaRepository.findByUsuarioOrderByFechaCreacionDesc(usuario);
        }

        return switch (campo.toLowerCase()) {
            case "titulo" -> lecturaRepository
                    .findByUsuarioAndTituloContainingIgnoreCaseOrderByFechaCreacionDesc(usuario, valor);
            case "estado" -> {
                try {
                    Estado estado = Estado.valueOf(valor);
                    yield lecturaRepository.findByUsuarioAndEstadoOrderByFechaCreacionDesc(usuario, estado);
                } catch (IllegalArgumentException e) {
                    yield List.of();
                }
            }
            case "valoracion" -> {
                try {
                    Valoracion valoracion = Valoracion.valueOf(valor);
                    yield lecturaRepository.findByUsuarioAndValoracionOrderByFechaCreacionDesc(usuario, valoracion);
                } catch (IllegalArgumentException e) {
                    yield List.of();
                }
            }
            default -> lecturaRepository.findByUsuarioOrderByFechaCreacionDesc(usuario);
        };
    }
}