package com.miproyecto.registrolps.repository;

import com.miproyecto.registrolps.entity.Pelicula;
import com.miproyecto.registrolps.entity.Usuario;
import com.miproyecto.registrolps.entity.enums.Disponibilidad;
import com.miproyecto.registrolps.entity.enums.Estado;
import com.miproyecto.registrolps.entity.enums.Valoracion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PeliculaRepository extends JpaRepository<Pelicula, Long> {

    List<Pelicula> findByUsuarioAndDisponibilidadOrderByIdDesc(
            Usuario usuario, Disponibilidad disponibilidad);

    Optional<Pelicula> findByIdAndUsuarioAndDisponibilidad(
            Long id, Usuario usuario, Disponibilidad disponibilidad);

    List<Pelicula> findByUsuarioAndDisponibilidadAndTituloContainingIgnoreCaseOrderByIdDesc(
            Usuario usuario, Disponibilidad disponibilidad, String titulo);

    List<Pelicula> findByUsuarioAndDisponibilidadAndEstadoOrderByIdDesc(
            Usuario usuario, Disponibilidad disponibilidad, Estado estado);

    List<Pelicula> findByUsuarioAndDisponibilidadAndValoracionOrderByIdDesc(
            Usuario usuario, Disponibilidad disponibilidad, Valoracion valoracion);
}