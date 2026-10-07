import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PerfilPanel from '../components/PerfilPanel';
import BloqueSeccion from '../components/BloqueSeccion';
import '../styles/Inicio.css';

function Inicio() {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
    }
  }, [usuario, navigate]);

  const actualizarPerfil = async (formData) => {
    try {
      const body = {};
      if (formData.usuario && formData.usuario !== usuario.usuario) {
        body.usuario = formData.usuario;
      }
      if (formData.password && formData.password.trim() !== '') {
        body.password = formData.password;
      }

      if (Object.keys(body).length === 0) {
        return { ok: false, mensaje: 'No hay cambios para guardar' };
      }

      const response = await fetch(`http://localhost:8081/api/usuario/${usuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        return { ok: false, mensaje: data.mensaje || 'Error al actualizar' };
      }

      localStorage.setItem('usuario', JSON.stringify(data));
      setUsuario(data);
      return { ok: true };
    } catch {
      return { ok: false, mensaje: 'Error de conexión con el servidor' };
    }
  };

  const eliminarCuenta = async () => {
    try {
      const response = await fetch(`http://localhost:8081/api/usuario/${usuario.id}`, {
        method: 'DELETE',
      });

      if (response.ok || response.status === 204) {
        localStorage.removeItem('usuario');
        navigate('/login');
      }
    } catch {
      alert('Error de conexión con el servidor');
    }
  };

  const cerrarSesion = () => {
  localStorage.removeItem('usuario');
  navigate('/login');
  };

  if (!usuario) return null;

  return (
    <div className="inicio-page">
      <section className="inicio-intro">
        <p className="eyebrow">Registro LPS</p>
        <h1>Tu espacio personal de lecturas, películas y series.</h1>
        <p>
          Guarda lo que consumes, califícalo y vuelve a encontrarlo cuando quieras.
        </p>
        <div className="intro-line" />
        <p className="intro-note">Sesión iniciada correctamente</p>
      </section>

      <section className="inicio-panel">
        <div className="panel-top">
          <div className="panel-heading">
            <div className="panel-mark">R</div>
            <div>
              <p className="panel-kicker">Inicio</p>
              <h2>Hola, {usuario.usuario}</h2>
            </div>
          </div>

          <PerfilPanel
            usuario={usuario}
            onActualizar={actualizarPerfil}
            onEliminar={eliminarCuenta}
            onCerrarSesion={cerrarSesion}
          />
        </div>

        <div className="bloques-grid">
          <BloqueSeccion
            titulo="Lectura"
            descripcion="Libros, novelas, mangas y más."
            variante="lectura"
            onClick={() => navigate('/lectura')}
          />
          <BloqueSeccion
            titulo="Película"
            descripcion="Todo lo que has visto en pantalla grande."
            variante="pelicula"
            onClick={() => navigate('/pelicula')}
          />
          <BloqueSeccion
            titulo="Serie"
            descripcion="Tus series y el progreso de cada una."
            variante="serie"
            onClick={() => navigate('/serie')}
          />
        </div>
      </section>
    </div>
  );
}

export default Inicio;