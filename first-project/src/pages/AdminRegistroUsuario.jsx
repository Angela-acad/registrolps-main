import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminRegistro.css';

function AdminRegistroUsuario() {
  const navigate = useNavigate();

  const [usuario] = useState(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  const [formData, setFormData] = useState({
    usuario: '',
    password: '',
    tipo: 'Usuario_estandar',
  });

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
      return;
    }
    if (usuario.tipo !== 'Administrador') {
      navigate('/inicio');
    }
  }, [usuario, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: '' }));
    setMensaje({ texto: '', tipo: '' });
  };

  const validar = (datos) => {
    const err = {};
    if (!datos.usuario) err.usuario = 'Ingrese el nombre de usuario';
    else if (datos.usuario.length < 4) err.usuario = 'Mínimo 4 caracteres';
    else if (datos.usuario.includes(' ')) err.usuario = 'Sin espacios';
    else if (!/^[a-zA-Z0-9_]+$/.test(datos.usuario)) {
      err.usuario = 'Sin caracteres especiales (solo letras, números y _)';
    }

    if (!datos.password) err.password = 'Ingrese la contraseña';
    else if (datos.password.length < 6) err.password = 'Mínimo 6 caracteres';
    else if (datos.password.includes(' ')) err.password = 'Sin espacios';

    if (!datos.tipo) err.tipo = 'Seleccione el tipo de cuenta';
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validar(formData);
    setErrores(err);
    if (Object.keys(err).length > 0) return;

    setCargando(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      const response = await fetch('http://localhost:8081/api/usuario/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const texto = (data.mensaje || data.message || '').toLowerCase();
        const duplicado =
          response.status === 400 ||
          response.status === 409 ||
          texto.includes('existe') ||
          texto.includes('duplic') ||
          texto.includes('en uso');

        setMensaje({
          texto: duplicado
            ? 'Este usuario ya está en uso'
            : data.mensaje || 'No se pudo crear la cuenta',
          tipo: 'error',
        });
        setCargando(false);
        return;
      }

      setMensaje({ texto: 'Usuario creado correctamente', tipo: 'success' });
      setFormData({ usuario: '', password: '', tipo: 'Usuario_estandar' });
      setCargando(false);
      setTimeout(() => navigate('/admin'), 900);
    } catch {
      setMensaje({ texto: 'Error de conexión con el servidor', tipo: 'error' });
      setCargando(false);
    }
  };

  if (!usuario) return null;

  return (
    <div className="registro-page admin-registro-page">
      <section className="registro-intro">
        <p className="eyebrow">Panel administrador</p>
        <h1>Crear usuario</h1>
        <p>Registra cuentas estándar o administrador para el sistema.</p>
        <div className="intro-line" />
        <p className="intro-note">Como administrador puede crear ambos tipos de cuenta</p>
      </section>

      <section className="registro-panel">
        <div className="panel-top">
          <div className="panel-heading">
            <div className="panel-mark">A</div>
            <div>
              <p className="panel-kicker">Administración</p>
              <h2>Nuevo usuario</h2>
            </div>
          </div>
          <div className="panel-acciones">
            <button type="button" className="btn-secundario" onClick={() => navigate('/admin')}>
              Volver a usuarios
            </button>
          </div>
        </div>

        <form className="formulario-registro" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="usuario">Usuario *</label>
            <input
              id="usuario"
              name="usuario"
              type="text"
              value={formData.usuario}
              onChange={handleChange}
              placeholder="Mínimo 4 caracteres"
            />
            {errores.usuario && <span className="error">{errores.usuario}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="password">Contraseña *</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
            />
            {errores.password && <span className="error">{errores.password}</span>}
          </div>

          <div className="field-group">
            <label htmlFor="tipo">Tipo de cuenta *</label>
            <select id="tipo" name="tipo" value={formData.tipo} onChange={handleChange}>
              <option value="Usuario_estandar">Usuario estándar</option>
              <option value="Administrador">Administrador</option>
            </select>
            {errores.tipo && <span className="error">{errores.tipo}</span>}
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
            <span>{cargando ? 'Creando…' : 'Crear cuenta'}</span>
            <span>→</span>
          </button>
        </form>
      </section>
    </div>
  );
}

export default AdminRegistroUsuario;