import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraBusqueda from '../components/BarraBusqueda';
import TarjetaSerie from '../components/TarjetaSerie';
import '../styles/Serie.css';

const opcionesCampo = [
  { valor: 'titulo', etiqueta: 'Título' },
  { valor: 'actorPrincipal', etiqueta: 'Actor' },
  { valor: 'genero', etiqueta: 'Género' },
  { valor: 'estado', etiqueta: 'Estado' },
  { valor: 'valoracion', etiqueta: 'Valoración' },
];

function Serie() {
  const navigate = useNavigate();
  const [usuario] = useState(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });
  const [series, setSeries] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [campo, setCampo] = useState('titulo');
  const [valor, setValor] = useState('');

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
      return;
    }

    let cancelado = false;
    async function cargarSeries() {
      try {
        const response = await fetch(`http://localhost:8081/api/series?usuarioId=${usuario.id}`);
        if (!response.ok) throw new Error('No se pudieron cargar las series');
        const data = await response.json();
        if (!cancelado) {
          setSeries(data);
          setError('');
        }
      } catch {
        if (!cancelado) {
          setError('Error de conexión con el servidor');
          setSeries([]);
        }
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargarSeries();
    return () => { cancelado = true; };
  }, [usuario, navigate]);

  const cargarSeries = async () => {
    setCargando(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8081/api/series?usuarioId=${usuario.id}`);
      if (!response.ok) throw new Error('No se pudieron cargar las series');
      setSeries(await response.json());
    } catch {
      setError('Error de conexión con el servidor');
      setSeries([]);
    } finally {
      setCargando(false);
    }
  };

  const buscarSeries = async () => {
    if (!valor.trim()) {
      cargarSeries();
      return;
    }

    setCargando(true);
    setError('');
    try {
      const params = new URLSearchParams({ usuarioId: usuario.id, filtro: campo, valor });
      const response = await fetch(`http://localhost:8081/api/series/buscar?${params}`);
      if (!response.ok) throw new Error('Error en la búsqueda');
      setSeries(await response.json());
    } catch {
      setError('Error al realizar la búsqueda');
      setSeries([]);
    } finally {
      setCargando(false);
    }
  };

  const limpiarBusqueda = () => {
    setCampo('titulo');
    setValor('');
    cargarSeries();
  };

  if (!usuario) return null;

  return (
    <div className="serie-page">
      <section className="serie-intro">
        <p className="eyebrow">Registro LPS</p>
        <h1>Series</h1>
        <p>Encuentra y organiza las series que sigues o ya terminaste.</p>
      </section>
      <section className="serie-panel">
        <div className="panel-top">
          <div className="panel-heading">
            <div className="panel-mark">S</div>
            <div><p className="panel-kicker">Sección</p><h2>Mis series</h2></div>
          </div>
          <div className="panel-acciones">
            <button type="button" className="btn-secundario" onClick={() => navigate('/')}>Inicio</button>
            <button type="button" className="btn-primario" onClick={() => navigate('/serie/nueva')}>Agregar serie</button>
          </div>
        </div>
        <BarraBusqueda
          campo={campo}
          valor={valor}
          onCampoChange={setCampo}
          onValorChange={setValor}
          onBuscar={buscarSeries}
          onLimpiar={limpiarBusqueda}
          opcionesCampo={opcionesCampo}
        />
        {!cargando && !error && (
          <p className="serie-resultados" aria-live="polite">
            {series.length} {series.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
          </p>
        )}
        <div className="lista-series" aria-live="polite">
          {cargando && <p className="estado-msg">Cargando series…</p>}
          {!cargando && error && <p className="form-message error-message">{error}</p>}
          {!cargando && !error && series.length === 0 && <p className="estado-msg">No se encontraron series.</p>}
          {!cargando && !error && series.map((serie) => (
            <TarjetaSerie key={serie.id} serie={serie} onClick={(id) => navigate(`/serie/${id}`)} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Serie;