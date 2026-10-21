package com.miproyecto.registrolps.repository;

import com.miproyecto.registrolps.entity.Serie;
import com.miproyecto.registrolps.entity.Usuario;
import com.miproyecto.registrolps.entity.enums.Disponibilidad;
import com.miproyecto.registrolps.entity.enums.Estado;
import com.miproyecto.registrolps.entity.enums.Valoracion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SerieRepository extends JpaRepository<Serie, Long> {

    List<Serie> findByUsuarioAndDisponibilidadOrderByIdDesc(
            Usuario usuario, Disponibilidad disponibilidad);

    Optional<Serie> findByIdAndUsuarioAndDisponibilidad(
            Long id, Usuario usuario, Disponibilidad disponibilidad);

    List<Serie> findByUsuarioAndDisponibilidadAndTituloContainingIgnoreCaseOrderByIdDesc(
            Usuario usuario, Disponibilidad disponibilidad, String titulo);

    List<Serie> findByUsuarioAndDisponibilidadAndEstadoOrderByIdDesc(
            Usuario usuario, Disponibilidad disponibilidad, Estado estado);

    List<Serie> findByUsuarioAndDisponibilidadAndValoracionOrderByIdDesc(
            Usuario usuario, Disponibilidad disponibilidad, Valoracion valoracion);
}