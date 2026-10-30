import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Registro.css';

function Registro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    usuario: '',
    password: '',
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

    if (!datos.usuario) {
      errores.usuario = 'Por favor, ingrese su nombre de usuario';
    } else if (datos.usuario.length < 4) {
      errores.usuario = 'El usuario debe tener más de 3 caracteres';
    } else if (datos.usuario.includes(' ')) {
      errores.usuario = 'El usuario no debe contener espacios';
    } else if (!/^[a-zA-Z0-9_]+$/.test(datos.usuario)) {
      errores.usuario = 'El usuario no debe contener caracteres especiales';
    }

    if (!datos.password) {
      errores.password = 'Por favor, ingrese su contraseña';
    } else if (datos.password.length < 6) {
      errores.password = 'La contraseña debe tener más de 5 caracteres';
    } else if (datos.password.includes(' ')) {
      errores.password = 'La contraseña no debe contener espacios';
    }

    return errores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevosErrores = validar(formData);
    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) {
      return;
    }

    setCargando(true);
    setMensaje({ texto: '', tipo: '' });

    const body = {
      usuario: formData.usuario,
      password: formData.password,
      tipo: 'Usuario_estandar',
    };

    try {
      const response = await fetch('http://localhost:8080/api/usuario/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const textoServidor = (data.mensaje || data.message || '').toLowerCase();

        const esDuplicado =
          response.status === 400 ||
          response.status === 409 ||
          textoServidor.includes('existe') ||
          textoServidor.includes('duplic') ||
          textoServidor.includes('ya está') ||
          textoServidor.includes('ya esta') ||
          textoServidor.includes('en uso');

        setMensaje({
          texto: esDuplicado
            ? 'Este usuario ya está en uso'
            : 'No se pudo crear la cuenta. Intenta de nuevo.',
          tipo: 'error',
        });
        setCargando(false);
        return;
      }

      const usuarioCreado = data.usuario
        ? { ...data.usuario, password: undefined }
        : {
            id: data.id,
            usuario: data.usuario ?? formData.usuario,
            tipo: data.tipo ?? 'Usuario_estandar',
          };

      localStorage.setItem('usuario', JSON.stringify(usuarioCreado));
      navigate('/inicio');
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
        <p className="eyebrow">Registro LPS</p>
        <h1>Crear cuenta</h1>
        <p>Regístrate para organizar tus lecturas, películas y series.</p>
        <div className="intro-line" />
        <p className="intro-note">Solo se crean cuentas de usuario estándar</p>
      </section>

      <section className="registro-panel">
        <div className="panel-top">
          <div className="panel-heading">
            <div className="panel-mark">R</div>
            <div>
              <p className="panel-kicker">Acceso</p>
              <h2>Registro</h2>
            </div>
          </div>
          <div className="panel-acciones">
            <button
              type="button"
              className="btn-secundario"
              onClick={() => navigate('/login')}
            >
              Ir a Login
            </button>
          </div>
        </div>

        <form className="formulario-registro" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="usuario">Usuario *</label>
            <input
              id="usuario"
              type="text"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              placeholder="Mínimo 4 caracteres"
              autoComplete="username"
            />
            {errores.usuario && <span className="error">{errores.usuario}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="password">Contraseña *</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
            />
            {errores.password && <span className="error">{errores.password}</span>}
          </div>

          <p className="intro-note" style={{ marginTop: 0 }}>
            Tipo de cuenta: <strong>Usuario estándar</strong>
          </p>

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