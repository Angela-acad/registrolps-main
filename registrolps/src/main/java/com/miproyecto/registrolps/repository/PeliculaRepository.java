package com.miproyecto.registrolps.repository;

import com.miproyecto.registrolps.entity.Pelicula;
import com.miproyecto.registrolps.entity.Usuario;
import com.miproyecto.registrolps.entity.enums.Estado;
import com.miproyecto.registrolps.entity.enums.Valoracion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PeliculaRepository extends JpaRepository<Pelicula, Long> {
    List<Pelicula> findByUsuarioOrderByFechaCreacionDesc(Usuario usuario);
    List<Pelicula> findByUsuarioAndTituloContainingIgnoreCaseOrderByFechaCreacionDesc(Usuario usuario, String titulo);
    List<Pelicula> findByUsuarioAndEstadoOrderByFechaCreacionDesc(Usuario usuario, Estado estado);
    List<Pelicula> findByUsuarioAndValoracionOrderByFechaCreacionDesc(Usuario usuario, Valoracion valoracion);
    Optional<Pelicula> findByIdAndUsuario(Long id, Usuario usuario);
}