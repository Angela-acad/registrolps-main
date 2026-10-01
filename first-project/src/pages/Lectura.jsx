import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BarraBusqueda from '../components/BarraBusqueda';
import TarjetaLectura from '../components/TarjetaLectura';
import '../styles/Lectura.css';

function Lectura() {
  const navigate = useNavigate();

  const [usuario] = useState(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  const [lecturas, setLecturas] = useState([]);
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
          `http://localhost:8080/api/lecturas?usuarioId=${usuario.id}`
        );
        if (!response.ok) throw new Error('No se pudieron cargar las lecturas');
        const data = await response.json();
        if (!cancelado) {
          setLecturas(data);
          setError('');
        }
      } catch {
        if (!cancelado) {
          setError('Error de conexión con el servidor');
          setLecturas([]);
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

  const cargarLecturas = async () => {
    setCargando(true);
    setError('');
    try {
      const response = await fetch(
        `http://localhost:8080/api/lecturas?usuarioId=${usuario.id}`
      );
      if (!response.ok) throw new Error('No se pudieron cargar las lecturas');
      const data = await response.json();
      setLecturas(data);
    } catch {
      setError('Error de conexión con el servidor');
      setLecturas([]);
    } finally {
      setCargando(false);
    }
  };

  const buscarLecturas = async () => {
    if (!valor.trim()) {
      cargarLecturas();
      return;
    }

    setCargando(true);
    setError('');
    try {
      const response = await fetch(
        `http://localhost:8080/api/lecturas/buscar?usuarioId=${usuario.id}&campo=${campo}&valor=${encodeURIComponent(valor)}`
      );
      if (!response.ok) throw new Error('Error en la búsqueda');
      const data = await response.json();
      setLecturas(data);
    } catch {
      setError('Error al realizar la búsqueda');
      setLecturas([]);
    } finally {
      setCargando(false);
    }
  };

  const limpiarBusqueda = () => {
    setCampo('titulo');
    setValor('');
    cargarLecturas();
  };

  const irADetalle = (id) => {
    navigate(`/lectura/${id}`);
  };

  if (!usuario) return null;

  return (
    <div className="lectura-page">
      <section className="lectura-intro">
        <p className="eyebrow">Registro LPS</p>
        <h1>Lecturas</h1>
        <p>
          Consulta, busca y organiza todo lo que has leído o estás leyendo.
        </p>
      </section>

      <section className="lectura-panel">
        <div className="panel-top">
          <div className="panel-heading">
            <div className="panel-mark">L</div>
            <div>
              <p className="panel-kicker">Sección</p>
              <h2>Mis lecturas</h2>
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
              onClick={() => navigate('/lectura/nueva')}
            >
              Agregar lectura
            </button>
          </div>
        </div>

        <BarraBusqueda
          campo={campo}
          valor={valor}
          onCampoChange={setCampo}
          onValorChange={setValor}
          onBuscar={buscarLecturas}
          onLimpiar={limpiarBusqueda}
        />

        <div className="lista-lecturas">
          {cargando && <p className="estado-msg">Cargando lecturas…</p>}

          {!cargando && error && (
            <p className="form-message error-message">{error}</p>
          )}

          {!cargando && !error && lecturas.length === 0 && (
            <p className="estado-msg">No hay lecturas registradas todavía.</p>
          )}

          {!cargando &&
            !error &&
            lecturas.map((lectura) => (
              <TarjetaLectura
                key={lectura.id}
                lectura={lectura}
                onClick={irADetalle}
              />
            ))}
        </div>
      </section>
    </div>
  );
}

export default Lectura;