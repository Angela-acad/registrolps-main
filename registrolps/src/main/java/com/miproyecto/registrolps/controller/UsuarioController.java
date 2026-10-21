package com.miproyecto.registrolps.controller;

import com.miproyecto.registrolps.entity.Usuario;
import com.miproyecto.registrolps.entity.enums.TipoUsuario;
import com.miproyecto.registrolps.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuario")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    /** POST /api/usuario/login */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {
        String usuario = credenciales.get("usuario");
        String password = credenciales.get("ctrs"); // como lo tenías
        String tipoTexto = credenciales.get("tipo");

        if (usuario == null || password == null || tipoTexto == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje", "Usuario, contraseña y tipo son obligatorios"));
        }

        TipoUsuario tipo;
        try {
            tipo = TipoUsuario.valueOf(tipoTexto);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje", "El tipo de usuario no es válido"));
        }

        Optional<Usuario> user = usuarioService.login(usuario, password, tipo);

        if (user.isPresent()) {
            Usuario u = user.get();
            u.setPassword(null); // nunca devolver la contraseña
            return ResponseEntity.ok(u);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("mensaje", "Usuario o contraseña incorrectos"));
    }

    /** POST /api/usuario/registro */
    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Usuario usuario) {
        if (usuario.getUsuario() == null || usuario.getPassword() == null || usuario.getTipo() == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje", "Usuario, contraseña y tipo son obligatorios"));
        }

        try {
            Usuario nuevo = usuarioService.registrar(usuario);
            nuevo.setPassword(null);
            return new ResponseEntity<>(nuevo, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje", e.getMessage()));
        }
    }

    /** GET /api/usuario/{id} — perfil */
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPerfil(@PathVariable Long id) {
        try {
            Usuario usuario = usuarioService.obtenerPorId(id);
            usuario.setPassword(null);
            return ResponseEntity.ok(usuario);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", e.getMessage()));
        }
    }

    /** PUT /api/usuario/{id} — modificar */
    @PutMapping("/{id}")
    public ResponseEntity<?> modificar(@PathVariable Long id,
                                       @RequestBody Usuario datos) {
        try {
            Usuario actualizado = usuarioService.actualizar(id, datos);
            actualizado.setPassword(null);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje", e.getMessage()));
        }
    }

    /** DELETE /api/usuario/{id} — soft delete de cuenta + registros */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            usuarioService.eliminar(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("mensaje", e.getMessage()));
        }
    }
}