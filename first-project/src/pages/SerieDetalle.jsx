import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DetalleSerie from '../components/DetalleSerie';
import '../styles/Serie.css';

function SerieDetalle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [usuario] = useState(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });
  const [serie, setSerie] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
      return;
    }

    let cancelado = false;
    async function cargarDetalle() {
      try {
        const response = await fetch(`http://localhost:8081/api/series/${id}?usuarioId=${usuario.id}`);
        if (!response.ok) throw new Error('Serie no encontrada');
        const data = await response.json();
        if (!cancelado) setSerie(data);
      } catch {
        if (!cancelado) setError('No se pudo cargar el registro');
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargarDetalle();
    return () => { cancelado = true; };
  }, [usuario, navigate, id]);

  if (!usuario) return null;

  return (
    <div className="serie-page">
      <section className="serie-intro">
        <p className="eyebrow">Registro LPS</p>
        <h1>Detalle</h1>
        <p>Información completa de la serie seleccionada.</p>
        <div className="intro-line" />
        <p className="intro-note">Serie · ID {id}</p>
      </section>
      <section className="serie-panel">
        <div className="panel-top">
          <div className="panel-heading">
            <div className="panel-mark">S</div>
            <div><p className="panel-kicker">Registro</p><h2>{serie ? serie.titulo : 'Detalle de serie'}</h2></div>
          </div>
          <div className="panel-acciones">
            <button type="button" className="btn-secundario" onClick={() => navigate('/serie')}>Volver a Series</button>
            <button type="button" className="btn-secundario" onClick={() => navigate('/')}>Inicio</button>
          </div>
        </div>
        {cargando && <p className="estado-msg">Cargando detalle…</p>}
        {!cargando && error && <p className="form-message error-message">{error}</p>}
        {!cargando && !error && serie && <DetalleSerie serie={serie} />}
      </section>
    </div>
  );
}

export default SerieDetalle;