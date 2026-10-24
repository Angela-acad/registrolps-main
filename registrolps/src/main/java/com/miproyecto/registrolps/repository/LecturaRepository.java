package com.miproyecto.registrolps.repository;

import com.miproyecto.registrolps.entity.Lectura;
import com.miproyecto.registrolps.entity.Usuario;
import com.miproyecto.registrolps.entity.enums.Disponibilidad;
import com.miproyecto.registrolps.entity.enums.Estado;
import com.miproyecto.registrolps.entity.enums.Valoracion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LecturaRepository extends JpaRepository<Lectura, Long> {

        List<Lectura> findByDisponibilidadOrderByFechaCreacionDesc(Disponibilidad disponibilidad);

    List<Lectura> findByUsuarioAndDisponibilidadOrderByFechaCreacionDesc(
            Usuario usuario, Disponibilidad disponibilidad);

    Optional<Lectura> findByIdAndUsuarioAndDisponibilidad(
            Long id, Usuario usuario, Disponibilidad disponibilidad);

    List<Lectura> findByUsuarioAndDisponibilidadAndTituloContainingIgnoreCaseOrderByFechaCreacionDesc(
            Usuario usuario, Disponibilidad disponibilidad, String titulo);

    List<Lectura> findByUsuarioAndDisponibilidadAndEstadoOrderByFechaCreacionDesc(
            Usuario usuario, Disponibilidad disponibilidad, Estado estado);

    List<Lectura> findByUsuarioAndDisponibilidadAndValoracionOrderByFechaCreacionDesc(
            Usuario usuario, Disponibilidad disponibilidad, Valoracion valoracion);
}