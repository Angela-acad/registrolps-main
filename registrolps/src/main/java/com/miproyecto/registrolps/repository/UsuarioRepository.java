package com.miproyecto.registrolps.repository;

import com.miproyecto.registrolps.entity.Usuario;
import com.miproyecto.registrolps.entity.enums.Disponibilidad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsuario(String usuario);

    boolean existsByUsuario(String usuario);

    List<Usuario> findByDisponibilidadOrderByFechaCreacionDesc(Disponibilidad disponibilidad);

    Optional<Usuario> findByIdAndDisponibilidad(Long id, Disponibilidad disponibilidad);

    Optional<Usuario> findByUsuarioAndDisponibilidad(String usuario, Disponibilidad disponibilidad);

    boolean existsByUsuarioAndDisponibilidad(String usuario, Disponibilidad disponibilidad);
}