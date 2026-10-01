import { useState } from "react";

const Login = () => {

    const [datos, setDatos] = useState({
        tipo: '',
        usuario: '',
        ctrs: ''
    });

    const [errores, setErrores] = useState({});

    const handleChanges = (e) => {
        setDatos({ ...datos, [e.target.name]: e.target.value });

        if (errores[e.target.name]) {
            setErrores({ ...errores, [e.target.name]: "" });
        }
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const objetoErrores = validar(datos);
        setErrores(objetoErrores);

        if (Object.keys(objetoErrores).length === 0) {
            console.log("Datos enviados:", datos);
            alert("Datos enviados correctamente");
        } else {
            alert("Asegurese de haber ingresado bien sus datos")
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

                <div className='boton'>
                    <button type="submit">Ingresar</button>
                </div>
            </form>
        </div>
    );
};

export default Login;