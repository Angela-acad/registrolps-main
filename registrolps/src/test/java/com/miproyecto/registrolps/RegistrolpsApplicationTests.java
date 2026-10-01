package com.miproyecto.registrolps;

import com.miproyecto.registrolps.entity.Usuario;
import com.miproyecto.registrolps.entity.enums.TipoUsuario;
import com.miproyecto.registrolps.service.UsuarioService;

import tools.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class RegistrolpsApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void loginConCredencialesValidasDebeDarOk() {
        Usuario usuario = new Usuario();
        usuario.setUsuario("nat_admin");
        usuario.setPassword("123456");
        usuario.setTipo(TipoUsuario.Administrador);

        usuarioService.registrar(usuario);

        assertThat(usuarioService.login("nat_admin", "123456", TipoUsuario.Administrador)).isPresent();
        assertThat(usuarioService.login("nat_admin", "incorrecta", TipoUsuario.Administrador)).isEmpty();
    }

    @Test
    void registroDuplicadoDebeResponderBadRequest() throws Exception {
        Usuario usuario = new Usuario();
        usuario.setUsuario("duplicado");
        usuario.setPassword("123456");
        usuario.setTipo(TipoUsuario.Usuario_estandar);
        usuarioService.registrar(usuario);

        Usuario repetido = new Usuario();
        repetido.setUsuario("duplicado");
        repetido.setPassword("654321");
        repetido.setTipo(TipoUsuario.Usuario_estandar);

        mockMvc.perform(post("/api/usuario/registro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(repetido)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void loginConTipoIncorrectoDebeRechazar() {
        Usuario usuario = new Usuario();
        usuario.setUsuario("nat_user");
        usuario.setPassword("123456");
        usuario.setTipo(TipoUsuario.Usuario_estandar);

        usuarioService.registrar(usuario);

        assertThat(usuarioService.login("nat_user", "123456", TipoUsuario.Administrador)).isEmpty();
    }
}
