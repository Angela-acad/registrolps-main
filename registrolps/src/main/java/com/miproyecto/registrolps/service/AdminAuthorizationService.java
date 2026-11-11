package com.miproyecto.registrolps.service;

import com.miproyecto.registrolps.entity.enums.Disponibilidad;
import com.miproyecto.registrolps.entity.enums.TipoUsuario;
import com.miproyecto.registrolps.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminAuthorizationService {

    private final UsuarioRepository usuarioRepository;

    public AdminAuthorizationService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public void validarAdministrador(Long administradorId) {
        var usuario = usuarioRepository
                .findByIdAndDisponibilidad(administradorId, Disponibilidad.existe)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado"));

        if (usuario.getTipo() != TipoUsuario.Administrador) {
            throw new RuntimeException("Se requieren permisos de administrador");
        }
    }
}