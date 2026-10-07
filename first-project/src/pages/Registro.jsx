import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Registro.css';

function Registro() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    usuario: '',
    password: '',
    tipo: 'Usuario_estandar', // Valor por defecto
  });

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje({ texto: '', tipo: '' });

    try {
      const response = await fetch('http://localhost:8081/api/usuario/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensaje({
          texto: data.mensaje || 'No se pudo registrar el usuario',
          tipo: 'error',
        });
        setCargando(false);
        return;
      }

      // Éxito: redirigir al login
      setMensaje({ texto: 'Usuario creado correctamente. Redirigiendo al login...', tipo: 'success' });
      setTimeout(() => {
        navigate('/login');
      }, 1500);
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
        <p>Regístrate para empezar a gestionar tus lecturas, películas y series.</p>
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

        <form className="formulario-registro" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="usuario">Nombre de usuario *</label>
            <input
              id="usuario"
              type="text"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="password">Contraseña *</label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="tipo">Tipo de usuario *</label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              required
            >
              <option value="Usuario_estandar">Usuario estándar</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>

          {mensaje.texto && (
            <p className={`form-message ${mensaje.tipo === 'error' ? 'error-message' : 'success-message'}`}>
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