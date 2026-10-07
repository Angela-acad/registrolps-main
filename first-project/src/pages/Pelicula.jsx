import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraBusqueda from '../components/BarraBusqueda';
import TarjetaPelicula from '../components/TarjetaPelicula.jsx';
import '../styles/Pelicula.css';

function Pelicula() {
  const navigate = useNavigate();

  const [usuario] = useState(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  const [peliculas, setPeliculas] = useState([]);
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

    async function cargarInicial() {
      try {
        const response = await fetch(
          `http://localhost:8081/api/peliculas?usuarioId=${usuario.id}`
        );
        if (!response.ok) throw new Error('No se pudieron cargar las películas');
        const data = await response.json();
        if (!cancelado) {
          setPeliculas(data);
          setError('');
        }
      } catch {
        if (!cancelado) {
          setError('Error de conexión con el servidor');
          setPeliculas([]);
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    }

    cargarInicial();

    return () => {
      cancelado = true;
    };
  }, [usuario, navigate]);

  const cargarPeliculas = async () => {
    setCargando(true);
    setError('');
    try {
      const response = await fetch(
        `http://localhost:8081/api/peliculas?usuarioId=${usuario.id}`
      );
      if (!response.ok) throw new Error('No se pudieron cargar las películas');
      const data = await response.json();
      setPeliculas(data);
    } catch {
      setError('Error de conexión con el servidor');
      setPeliculas([]);
    } finally {
      setCargando(false);
    }
  };

  const buscarPeliculas = async () => {
    if (!valor.trim()) {
      cargarPeliculas();
      return;
    }

    setCargando(true);
    setError('');
    try {
      const response = await fetch(
        `http://localhost:8081/api/peliculas/buscar?usuarioId=${usuario.id}&campo=${campo}&valor=${encodeURIComponent(valor)}`
      );
      if (!response.ok) throw new Error('Error en la búsqueda');
      const data = await response.json();
      setPeliculas(data);
    } catch {
      setError('Error al realizar la búsqueda');
      setPeliculas([]);
    } finally {
      setCargando(false);
    }
  };

  const limpiarBusqueda = () => {
    setCampo('titulo');
    setValor('');
    cargarPeliculas();
  };

  const irADetalle = (id) => {
    navigate(`/pelicula/${id}`);
  };

  if (!usuario) return null;

  return (
    <div className="pelicula-page">
      <section className="pelicula-intro">
        <p className="eyebrow">Registro LPS</p>
        <h1>Películas</h1>
        <p>
          Consulta, busca y organiza todas las películas que has visto o quieres ver.
        </p>
      </section>

      <section className="pelicula-panel">
        <div className="panel-top">
          <div className="panel-heading">
            <div className="panel-mark">P</div>
            <div>
              <p className="panel-kicker">Sección</p>
              <h2>Mis películas</h2>
            </div>
          </div>

          <div className="panel-acciones">
            <button
              type="button"
              className="btn-secundario"
              onClick={() => navigate('/')}
            >
              Inicio
            </button>
            <button
              type="button"
              className="btn-primario"
              onClick={() => navigate('/pelicula/nueva')}
            >
              Agregar película
            </button>
          </div>
        </div>

        <BarraBusqueda
          campo={campo}
          valor={valor}
          onCampoChange={setCampo}
          onValorChange={setValor}
          onBuscar={buscarPeliculas}
          onLimpiar={limpiarBusqueda}
        />

        <div className="lista-peliculas">
          {cargando && <p className="estado-msg">Cargando películas…</p>}

          {!cargando && error && (
            <p className="form-message error-message">{error}</p>
          )}

          {!cargando && !error && peliculas.length === 0 && (
            <p className="estado-msg">No hay películas registradas todavía.</p>
          )}

          {!cargando &&
            !error &&
            peliculas.map((pelicula) => (
              <TarjetaPelicula
                key={pelicula.id}
                pelicula={pelicula}
                onClick={irADetalle}
              />
            ))}
        </div>
      </section>
    </div>
  );
}

export default Pelicula;