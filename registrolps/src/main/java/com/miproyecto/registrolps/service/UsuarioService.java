package com.miproyecto.registrolps.service;

import com.miproyecto.registrolps.entity.Usuario;
import com.miproyecto.registrolps.entity.enums.TipoUsuario;
import com.miproyecto.registrolps.repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    public Usuario registrar(Usuario usuario) {
        // Aquí más adelante encriptaremos la contraseña
        return usuarioRepository.save(usuario);
    }

    public java.util.List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public boolean existePorUsuario(String usuario) {
        return usuarioRepository.findByUsuario(usuario).isPresent();
    }

    public Optional<Usuario> login(String usuario, String password, TipoUsuario tipo) {
        Optional<Usuario> user = usuarioRepository.findByUsuario(usuario);

        if (user.isPresent()
                && user.get().getPassword().equals(password)
                && user.get().getTipo() == tipo) {
            return user;
        }
        return Optional.empty();
    }

    public Usuario obtenerPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public Usuario actualizar(Long id, Usuario datos) {
        Usuario usuario = obtenerPorId(id);

        // Solo actualizamos el nombre de usuario si viene
        if (datos.getUsuario() != null && !datos.getUsuario().isBlank()) {
            // Validar que el nuevo nombre no esté en uso por otro usuario
            if (!usuario.getUsuario().equals(datos.getUsuario()) 
                    && existePorUsuario(datos.getUsuario())) {
                throw new RuntimeException("El nombre de usuario ya existe");
            }
            usuario.setUsuario(datos.getUsuario());
        }

        // Solo actualizamos la contraseña si viene una nueva
        if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
            usuario.setPassword(datos.getPassword());
        }  

        return usuarioRepository.save(usuario);
    }

    public void eliminar(Long id) {
        Usuario usuario = obtenerPorId(id);
        usuarioRepository.delete(usuario);
    }
}