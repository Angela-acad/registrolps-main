import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DetalleLectura from '../components/DetalleLectura';
import '../styles/LecturaDetalle.css';

function LecturaDetalle() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [usuario] = useState(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  const [lectura, setLectura] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
      return;
    }

    let cancelado = false;

    async function cargarDetalle() {
      try {
        const response = await fetch(
          `http://localhost:8080/api/lecturas/${id}?usuarioId=${usuario.id}`
        );
        if (!response.ok) throw new Error('Lectura no encontrada');
        const data = await response.json();
        if (!cancelado) {
          setLectura(data);
          setError('');
        }
      } catch {
        if (!cancelado) {
          setError('No se pudo cargar el registro');
          setLectura(null);
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    }

    cargarDetalle();

    return () => {
      cancelado = true;
    };
  }, [usuario, navigate, id]);

  const handleEliminar = async () => {
    const confirmar = window.confirm(
      '¿Estás seguro de que quieres eliminar este registro? Esta acción no se puede deshacer.'
    );
    if (!confirmar) return;

    setEliminando(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/lecturas/${id}?usuarioId=${usuario.id}`,
        { method: 'DELETE' }
      );

      if (response.ok || response.status === 204) {
        navigate('/lectura');
      } else {
        setError('No se pudo eliminar el registro');
        setEliminando(false);
      }
    } catch {
      setError('Error de conexión con el servidor');
      setEliminando(false);
    }
  };

  if (!usuario) return null;

  return (
    <div className="lectura-detalle-page">
      <section className="lectura-detalle-intro">
        <p className="eyebrow">Registro LPS</p>
        <h1>Detalle</h1>
        <p>Información completa del registro seleccionado.</p>
        <div className="intro-line" />
        <p className="intro-note">Lectura · ID {id}</p>
      </section>

      <section className="lectura-detalle-panel">
        <div className="panel-top">
          <div className="panel-heading">
            <div className="panel-mark">D</div>
            <div>
              <p className="panel-kicker">Registro</p>
              <h2>{lectura ? lectura.titulo : 'Cargando…'}</h2>
            </div>
          </div>

          <div className="panel-acciones">
            <button
              type="button"
              className="btn-secundario"
              onClick={() => navigate('/lectura')}
            >
              Volver a Lectura
            </button>
            <button
              type="button"
              className="btn-secundario"
              onClick={() => navigate('/')}
            >
              Inicio
            </button>
          </div>
        </div>

        {cargando && <p className="estado-msg">Cargando detalle…</p>}

        {!cargando && error && (
          <p className="form-message error-message">{error}</p>
        )}

        {!cargando && !error && lectura && (
          <DetalleLectura
            lectura={lectura}
            onEliminar={handleEliminar}
            onModificar={() => navigate(`/lectura/${id}/editar`)}
            eliminando={eliminando}
          />
        )}
      </section>
    </div>
  );
}

export default LecturaDetalle;