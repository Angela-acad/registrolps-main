package com.miproyecto.registrolps.repository;

import com.miproyecto.registrolps.entity.Serie;
import com.miproyecto.registrolps.entity.Usuario;
import com.miproyecto.registrolps.entity.enums.Estado;
import com.miproyecto.registrolps.entity.enums.Valoracion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SerieRepository extends JpaRepository<Serie, Long> {

    List<Serie> findByUsuarioOrderByFechaCreacionDesc(Usuario usuario);

    List<Serie> findByUsuarioAndTituloContainingIgnoreCaseOrderByFechaCreacionDesc(Usuario usuario, String titulo);

    List<Serie> findByUsuarioAndActorPrincipalContainingIgnoreCaseOrderByFechaCreacionDesc(Usuario usuario, String actorPrincipal);

    List<Serie> findByUsuarioAndGeneroContainingIgnoreCaseOrderByFechaCreacionDesc(Usuario usuario, String genero);

    List<Serie> findByUsuarioAndEstadoOrderByFechaCreacionDesc(Usuario usuario, Estado estado);

    List<Serie> findByUsuarioAndValoracionOrderByFechaCreacionDesc(Usuario usuario, Valoracion valoracion);

    Optional<Serie> findByIdAndUsuario(Long id, Usuario usuario);
}