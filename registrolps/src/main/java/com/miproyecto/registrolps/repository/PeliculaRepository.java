package com.miproyecto.registrolps.repository;

import com.miproyecto.registrolps.entity.Pelicula;
import com.miproyecto.registrolps.entity.enums.Estado;
import com.miproyecto.registrolps.entity.enums.Valoracion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PeliculaRepository extends JpaRepository<Pelicula, Long> {

    List<Pelicula> findByTituloContainingIgnoreCase(String titulo);

    List<Pelicula> findByActorPrincipalContainingIgnoreCase(String actorPrincipal);

    List<Pelicula> findByGeneroContainingIgnoreCase(String genero);

    List<Pelicula> findByEstado(Estado estado);

    List<Pelicula> findByValoracion(Valoracion valoracion);
}