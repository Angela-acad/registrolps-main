package com.miproyecto.registrolps.service;

import com.miproyecto.registrolps.entity.Lectura;
import com.miproyecto.registrolps.entity.Pelicula;
import com.miproyecto.registrolps.entity.Serie;
import com.miproyecto.registrolps.entity.Usuario;
import com.miproyecto.registrolps.entity.enums.Disponibilidad;
import com.miproyecto.registrolps.entity.enums.TipoUsuario;
import com.miproyecto.registrolps.repository.LecturaRepository;
import com.miproyecto.registrolps.repository.PeliculaRepository;
import com.miproyecto.registrolps.repository.SerieRepository;
import com.miproyecto.registrolps.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final LecturaRepository lecturaRepository;
    private final PeliculaRepository peliculaRepository;
    private final SerieRepository serieRepository;

    public UsuarioService(UsuarioRepository usuarioRepository,
                          LecturaRepository lecturaRepository,
                          PeliculaRepository peliculaRepository,
                          SerieRepository serieRepository) {
        this.usuarioRepository = usuarioRepository;
        this.lecturaRepository = lecturaRepository;
        this.peliculaRepository = peliculaRepository;
        this.serieRepository = serieRepository;
    }

    /** Registro — solo cuenta si el nombre no está en uso por un usuario "existe" */
    @Transactional
    public Usuario registrar(Usuario usuario) {
        if (usuarioRepository.existsByUsuarioAndDisponibilidad(
                usuario.getUsuario(), Disponibilidad.existe)) {
            throw new RuntimeException("El nombre de usuario ya existe");
        }

        usuario.setDisponibilidad(Disponibilidad.existe);
        if (usuario.getTipo() == null) {
            usuario.setTipo(TipoUsuario.Usuario_estandar);
        }
        // Más adelante: encriptar password aquí
        return usuarioRepository.save(usuario);
    }

    public boolean existePorUsuario(String usuario) {
        return usuarioRepository.existsByUsuarioAndDisponibilidad(
                usuario, Disponibilidad.existe);
    }

    /** Login — ignora usuarios con disponibilidad = inexistente */
    public Optional<Usuario> login(String usuario, String password, TipoUsuario tipo) {
        Optional<Usuario> user = usuarioRepository
                .findByUsuarioAndDisponibilidad(usuario, Disponibilidad.existe);

        if (user.isPresent()
                && user.get().getPassword().equals(password)
                && user.get().getTipo() == tipo) {
            return user;
        }
        return Optional.empty();
    }

    /** Perfil — solo si existe */
    @Transactional(readOnly = true)
    public Usuario obtenerPorId(Long id) {
        return usuarioRepository
                .findByIdAndDisponibilidad(id, Disponibilidad.existe)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    /** Modificar perfil */
    @Transactional
    public Usuario actualizar(Long id, Usuario datos) {
        Usuario usuario = obtenerPorId(id);

        if (datos.getUsuario() != null && !datos.getUsuario().isBlank()) {
            if (!usuario.getUsuario().equals(datos.getUsuario())
                    && existePorUsuario(datos.getUsuario())) {
                throw new RuntimeException("El nombre de usuario ya existe");
            }
            usuario.setUsuario(datos.getUsuario());
        }

        if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
            usuario.setPassword(datos.getPassword());
        }

        // Tipo: normalmente no se cambia desde el perfil
        // if (datos.getTipo() != null) {
        //     usuario.setTipo(datos.getTipo());
        // }

        return usuarioRepository.save(usuario);
    }

    /**
     * Eliminar cuenta (soft delete):
     * - usuario → inexistente
     * - todas sus lecturas, películas y series → inexistente
     */
    @Transactional
    public void eliminar(Long id) {
        Usuario usuario = obtenerPorId(id);

        usuario.setDisponibilidad(Disponibilidad.inexistente);
        usuarioRepository.save(usuario);

        // Lecturas
        List<Lectura> lecturas = lecturaRepository
                .findByUsuarioAndDisponibilidadOrderByFechaCreacionDesc(
                        usuario, Disponibilidad.existe);
        for (Lectura l : lecturas) {
            l.setDisponibilidad(Disponibilidad.inexistente);
        }
        lecturaRepository.saveAll(lecturas);

        // Películas (si usas OrderByIdDesc en el repo, ajústalo aquí)
        List<Pelicula> peliculas = peliculaRepository
                .findByUsuarioAndDisponibilidadOrderByIdDesc(
                        usuario, Disponibilidad.existe);
        for (Pelicula p : peliculas) {
            p.setDisponibilidad(Disponibilidad.inexistente);
        }
        peliculaRepository.saveAll(peliculas);

        // Series
        List<Serie> series = serieRepository
                .findByUsuarioAndDisponibilidadOrderByIdDesc(
                        usuario, Disponibilidad.existe);
        for (Serie s : series) {
            s.setDisponibilidad(Disponibilidad.inexistente);
        }
        serieRepository.saveAll(series);
    }
}