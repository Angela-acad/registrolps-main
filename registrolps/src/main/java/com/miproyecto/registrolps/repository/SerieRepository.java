package com.miproyecto.registrolps.repository;

import com.miproyecto.registrolps.entity.Serie;
import com.miproyecto.registrolps.entity.enums.Estado;
import com.miproyecto.registrolps.entity.enums.Valoracion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SerieRepository extends JpaRepository<Serie, Long> {

    List<Serie> findByTituloContainingIgnoreCase(String titulo);

    List<Serie> findByActorPrincipalContainingIgnoreCase(String actorPrincipal);

    List<Serie> findByGeneroContainingIgnoreCase(String genero);

    List<Serie> findByEstado(Estado estado);

    List<Serie> findByValoracion(Valoracion valoracion);
}