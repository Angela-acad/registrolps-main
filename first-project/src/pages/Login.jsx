import '../styles/Login.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [datos, setDatos] = useState({
        tipo: '',
        usuario: '',
        ctrs: ''
    });

    const [errores, setErrores] = useState({});
    const [errorLogin, setErrorLogin] = useState("");

    const handleChanges = (e) => {
        setDatos({ ...datos, [e.target.name]: e.target.value });

        if (errores[e.target.name]) {
            setErrores({ ...errores, [e.target.name]: "" });
        }
        setErrorLogin("");
    };

    const validar = (datos) => {
        const errores = {};

        if (!datos.tipo) {
            errores.tipo = "Por favor, defina su tipo de usuario";
        }

        if (!datos.usuario) {
            errores.usuario = "Por favor, ingrese su nombre de usuario";
        } else if (datos.usuario.length < 4) {
            errores.usuario = "Recuerde que su usuario tiene más de 3 caracteres";
        } else if (datos.usuario.includes(' ')) {
            errores.usuario = "Recuerde que su usuario no contiene espacios";
        }

        if (!datos.ctrs) {
            errores.ctrs = "Por favor, ingrese su contraseña";
        } else if (datos.ctrs.length < 6) {
            errores.ctrs = "Recuerde que su contraseña tiene más de 5 caracteres";
        } else if (datos.ctrs.includes(' ')) {
            errores.ctrs = "Recuerde que su contraseña no contiene espacios";
        }

        return errores;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const objetoErrores = validar(datos);
        setErrores(objetoErrores);

        if (Object.keys(objetoErrores).length > 0) {
            return;
        }

        try {
            const respuesta = await fetch("http://localhost:8081/api/usuario/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    tipo: datos.tipo,
                    usuario: datos.usuario,
                    ctrs: datos.ctrs
                })
            });

            if (respuesta.ok) {
                const usuario = await respuesta.json();

                localStorage.setItem("usuario", JSON.stringify(usuario));
                navigate(usuario.tipo === "Administrador" ? "/admin" : "/inicio", { replace: true });
            } else {
                const error = await respuesta.json();
                setErrorLogin(error.mensaje || "Usuario o contraseña incorrectos");
            }

        } catch{
            setErrorLogin("No se pudo conectar con el servidor");
        }
    };

    return (
        <div className="contenedor">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <label>Tipo de usuario: </label>
                <div className='radio'>
                    <input name="tipo" type="radio" value="Administrador"
                    onChange={handleChanges}
                    checked={datos.tipo === "Administrador"}/> Administrador
                    <input name="tipo" type="radio" value="Usuario_estandar"
                    onChange={handleChanges} 
                    checked={datos.tipo === "Usuario_estandar"}/> Usuario estándar
                </div>
                {errores.tipo && <p>{errores.tipo}</p>}

                <label htmlFor="usuario">Usuario: </label>
                <input
                    id="usuario" name="usuario" type="text" placeholder="Ingrese su nombre de usuario"
                    onChange={handleChanges} value={datos.usuario}/>
                {errores.usuario && <p>{errores.usuario}</p>}

                <label htmlFor="ctrs">Contraseña: </label>
                <input id="ctrs" name="ctrs" type="password" placeholder="Ingrese su contraseña"
                onChange={handleChanges} value={datos.ctrs}/>
                {errores.ctrs && <p>{errores.ctrs}</p>}

                {errorLogin && <p>{errorLogin}</p>}

                <div className='boton'>
                    <button type="submit">Ingresar</button>
                </div>
            </form>
        </div>
    );
};

export default Login;