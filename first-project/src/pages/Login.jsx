import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();

  const [datos, setDatos] = useState({
    tipo: '',
    usuario: '',
    ctrs: '',
  });

  const [errores, setErrores] = useState({});
  const [errorLogin, setErrorLogin] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChanges = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });

    if (errores[e.target.name]) {
      setErrores({ ...errores, [e.target.name]: '' });
    }
    setErrorLogin('');
  };

  const validar = (datos) => {
    const errores = {};

    if (!datos.tipo) {
      errores.tipo = 'Por favor, defina su tipo de usuario';
    }

    if (!datos.usuario) {
      errores.usuario = 'Por favor, ingrese su nombre de usuario';
    } else if (datos.usuario.length < 4) {
      errores.usuario = 'Recuerde que su usuario tiene más de 3 caracteres';
    } else if (datos.usuario.includes(' ')) {
      errores.usuario = 'Recuerde que su usuario no contiene espacios';
    }

    if (!datos.ctrs) {
      errores.ctrs = 'Por favor, ingrese su contraseña';
    } else if (datos.ctrs.length < 6) {
      errores.ctrs = 'Recuerde que su contraseña tiene más de 5 caracteres';
    } else if (datos.ctrs.includes(' ')) {
      errores.ctrs = 'Recuerde que su contraseña no contiene espacios';
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

    setCargando(true);
    setErrorLogin('');

    try {
      const respuesta = await fetch('http://localhost:8081/api/usuario/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: datos.tipo,
          usuario: datos.usuario,
          ctrs: datos.ctrs,
        }),
      });

      if (respuesta.ok) {
        const usuario = await respuesta.json();
        localStorage.setItem('usuario', JSON.stringify(usuario));
        navigate(usuario.tipo === 'Administrador' ? '/admin' : '/inicio', { replace: true });
      } else {
        const error = await respuesta.json().catch(() => ({}));
        setErrorLogin(error.mensaje || 'Usuario o contraseña incorrectos');
      }
    } catch {
      setErrorLogin('No se pudo conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-intro">
        <div className="brand-header">
          <img
            src="/Logo.png"
            alt="Logo de Registro LPS"
            className="brand-logo"
          />
          <p className="eyebrow">Registro LPS</p>
        </div>
        <h1>Tu espacio de lecturas, películas y series.</h1>
        <p>
          Inicia sesión para guardar lo que consumes, calificarlo y encontrarlo cuando quieras.
        </p>
        <div className="intro-line" />
        <p className="intro-note">Acceso seguro a tu biblioteca personal</p>
      </section>

      <section className="login-panel">
        <div className="panel-heading">
          <div className="panel-mark">R</div>
          <div>
            <p className="panel-kicker">Bienvenida/o</p>
            <h2>Iniciar sesión</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <fieldset className="field-group role-options">
            <legend>Tipo de usuario</legend>
            <div className="role-grid">
              <label
                className={`role-option ${datos.tipo === 'Administrador' ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="tipo"
                  value="Administrador"
                  checked={datos.tipo === 'Administrador'}
                  onChange={handleChanges}
                />
                <span>
                  <strong>Administrador</strong>
                  <small>Gestión completa</small>
                </span>
              </label>

              <label
                className={`role-option ${datos.tipo === 'Usuario_estandar' ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="tipo"
                  value="Usuario_estandar"
                  checked={datos.tipo === 'Usuario_estandar'}
                  onChange={handleChanges}
                />
                <span>
                  <strong>Usuario estándar</strong>
                  <small>Uso personal</small>
                </span>
              </label>
            </div>
            {errores.tipo && <span className="error">{errores.tipo}</span>}
          </fieldset>

          <div className="field-group">
            <label htmlFor="usuario">Usuario</label>
            <input
              id="usuario"
              name="usuario"
              type="text"
              placeholder="Ingrese su nombre de usuario"
              value={datos.usuario}
              onChange={handleChanges}
              aria-invalid={errores.usuario ? 'true' : 'false'}
            />
            {errores.usuario && <span className="error">{errores.usuario}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="ctrs">Contraseña</label>
            <input
              id="ctrs"
              name="ctrs"
              type="password"
              placeholder="Ingrese su contraseña"
              value={datos.ctrs}
              onChange={handleChanges}
              aria-invalid={errores.ctrs ? 'true' : 'false'}
            />
            {errores.ctrs && <span className="error">{errores.ctrs}</span>}
          </div>

          {errorLogin && (
            <p className="form-message error-message">{errorLogin}</p>
          )}

          <button type="submit" className="submit-button" disabled={cargando}>
            <span>{cargando ? 'Ingresando…' : 'Ingresar'}</span>
            <span>→</span>
          </button>
        </form>

        <div className="panel-footer">
          <p>¿No tienes cuenta?</p>
          <button
            type="button"
            className="btn-registro"
            onClick={() => navigate('/registro')}
          >
            Ir a registro
          </button>
        </div>
      </section>
    </div>
  );
};

export default Login;