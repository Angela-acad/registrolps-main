package com.miproyecto.registrolps.entity;

import java.time.LocalDateTime;

import com.miproyecto.registrolps.entity.enums.Estado;
import com.miproyecto.registrolps.entity.enums.TipoLectura;
import com.miproyecto.registrolps.entity.enums.Valoracion;
import com.miproyecto.registrolps.entity.enums.Disponibilidad;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "lecturas")
public class Lectura {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String titulo;
    
    private String autor;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private TipoLectura tipo;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Estado estado;

    @Enumerated(EnumType.STRING)
    private Valoracion valoracion;
    
    private Integer numeroVolumenes;

    private Integer numeroCapitulos;

    private String comentario;

    @Column(nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    private LocalDateTime fechaActualizacion;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Disponibilidad disponibilidad = Disponibilidad.existe;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @PrePersist
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
        this.fechaActualizacion = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.fechaActualizacion = LocalDateTime.now();
    }
}

//Id, titulo, autor, tipo, estado, valoracion, numeroVolumenes, numeroCapitulos, comentario, fechas.