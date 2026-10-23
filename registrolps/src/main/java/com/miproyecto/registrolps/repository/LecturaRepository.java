package com.miproyecto.registrolps.repository;

import com.miproyecto.registrolps.entity.Lectura;
import com.miproyecto.registrolps.entity.Usuario;
import com.miproyecto.registrolps.entity.enums.Estado;
import com.miproyecto.registrolps.entity.enums.Valoracion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LecturaRepository extends JpaRepository<Lectura, Long> {

    List<Lectura> findAllByOrderByFechaCreacionDesc();

    List<Lectura> findByUsuarioOrderByFechaCreacionDesc(Usuario usuario);

    List<Lectura> findByUsuarioAndTituloContainingIgnoreCaseOrderByFechaCreacionDesc(
            Usuario usuario, String titulo);

    List<Lectura> findByUsuarioAndEstadoOrderByFechaCreacionDesc(
            Usuario usuario, Estado estado);

    List<Lectura> findByUsuarioAndValoracionOrderByFechaCreacionDesc(
            Usuario usuario, Valoracion valoracion);

    Optional<Lectura> findByIdAndUsuario(Long id, Usuario usuario);
}