import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Registro.css';

function Registro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    usuario: '',
    password: '',
    tipo: '',
  });

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errores[name]) {
      setErrores((prev) => ({ ...prev, [name]: '' }));
    }
    setMensaje({ texto: '', tipo: '' });
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

    if (!datos.password) {
      errores.password = 'Por favor, ingrese su contraseña';
    } else if (datos.password.length < 6) {
      errores.password = 'Recuerde que su contraseña tiene más de 5 caracteres';
    } else if (datos.password.includes(' ')) {
      errores.password = 'Recuerde que su contraseña no contiene espacios';
    }

    return errores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const objetoErrores = validar(formData);
    setErrores(objetoErrores);

    if (Object.keys(objetoErrores).length > 0) {
      return;
    }

    setCargando(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      const response = await fetch('http://localhost:8081/api/usuario/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: formData.usuario,
          password: formData.password,
          tipo: formData.tipo,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMensaje({
          texto: data.mensaje || 'No se pudo registrar el usuario',
          tipo: 'error',
        });
        setCargando(false);
        return;
      }

      // El backend devuelve el usuario (sin password) → misma sesión que el login
      localStorage.setItem('usuario', JSON.stringify(data));
      navigate('/inicio', { replace: true });
    } catch {
      setMensaje({
        texto: 'Error de conexión con el servidor',
        tipo: 'error',
      });
      setCargando(false);
    }
  };

  return (
    <div className="registro-page">
      <section className="registro-intro">
        <div className="brand-header">
          <img
            src="/Logo.png"
            alt="Logo de Registro LPS"
            className="brand-logo"
          />
          <p className="eyebrow">Registro LPS</p>
        </div>
        <h1>Crear cuenta</h1>
        <p>
          Regístrate para empezar a gestionar tus lecturas, películas y series.
        </p>
        <div className="intro-line" />
        <p className="intro-note">Los campos con * son obligatorios</p>
      </section>

      <section className="registro-panel">
        <div className="panel-top">
          <div className="panel-heading">
            <div className="panel-mark">R</div>
            <div>
              <p className="panel-kicker">Formulario</p>
              <h2>Nuevo usuario</h2>
            </div>
          </div>
          <div className="panel-acciones">
            <button
              type="button"
              className="btn-secundario"
              onClick={() => navigate('/login')}
            >
              Ya tengo cuenta
            </button>
          </div>
        </div>

        <form className="formulario-registro" onSubmit={handleSubmit} noValidate>
          <fieldset className="field-group role-options">
            <legend>Tipo de usuario *</legend>
            <div className="role-grid">
              <label
                className={`role-option ${formData.tipo === 'Administrador' ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="tipo"
                  value="Administrador"
                  checked={formData.tipo === 'Administrador'}
                  onChange={handleChange}
                />
                <span>
                  <strong>Administrador</strong>
                  <small>Gestión completa</small>
                </span>
              </label>

              <label
                className={`role-option ${formData.tipo === 'Usuario_estandar' ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="tipo"
                  value="Usuario_estandar"
                  checked={formData.tipo === 'Usuario_estandar'}
                  onChange={handleChange}
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
            <label htmlFor="usuario">Nombre de usuario *</label>
            <input
              id="usuario"
              type="text"
              name="usuario"
              placeholder="Mínimo 4 caracteres, sin espacios"
              value={formData.usuario}
              onChange={handleChange}
              aria-invalid={errores.usuario ? 'true' : 'false'}
            />
            {errores.usuario && <span className="error">{errores.usuario}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="password">Contraseña *</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Mínimo 6 caracteres, sin espacios"
              value={formData.password}
              onChange={handleChange}
              aria-invalid={errores.password ? 'true' : 'false'}
            />
            {errores.password && <span className="error">{errores.password}</span>}
          </div>

          {mensaje.texto && (
            <p
              className={`form-message ${
                mensaje.tipo === 'error' ? 'error-message' : 'success-message'
              }`}
            >
              {mensaje.texto}
            </p>
          )}

          <button type="submit" className="submit-button" disabled={cargando}>
            <span>{cargando ? 'Registrando…' : 'Crear cuenta'}</span>
            <span>→</span>
          </button>
        </form>

        <p className="registro-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
        </p>
      </section>
    </div>
  );
}

export default Registro;