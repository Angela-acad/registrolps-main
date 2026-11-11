import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/Admin.css';

const CATEGORIAS = [
  { key: 'lecturas', label: 'Libros' },
  { key: 'peliculas', label: 'Películas' },
  { key: 'series', label: 'Series' },
];

function AdminCatalogo() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [usuario] = useState(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  const [categoria, setCategoria] = useState(() => {
    const solicitada = searchParams.get('categoria');
    return CATEGORIAS.some((item) => item.key === solicitada) ? solicitada : 'lecturas';
  });
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState('todos');
  const [disponibilidadFiltro, setDisponibilidadFiltro] = useState('todos');
  const [eliminandoId, setEliminandoId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
      return;
    }

    if (usuario.tipo !== 'Administrador') {
      navigate('/inicio');
      return;
    }
  }, [usuario, navigate]);

  useEffect(() => {
    if (!usuario || usuario.tipo !== 'Administrador') return;

    const cargarCatalogo = async () => {
      setCargando(true);
      try {
        const endpoint = {
          lecturas: 'http://localhost:8081/api/lecturas/todos',
          peliculas: 'http://localhost:8081/api/peliculas/todos',
          series: 'http://localhost:8081/api/series/todos',
        }[categoria];

        const response = await fetch(`${endpoint}?administradorId=${usuario.id}`);
        if (!response.ok) {
          throw new Error('No se pudieron cargar los registros');
        }

        const data = await response.json();
        setRegistros(data);
        setError('');
      } catch (error) {
        console.error(error);
        setRegistros([]);
        setError('No se pudo cargar el catálogo. Verifica la conexión o tus permisos.');
      } finally {
        setCargando(false);
      }
    };

    cargarCatalogo();
  }, [categoria, usuario]);

  const categoriaLabel = useMemo(
    () => CATEGORIAS.find((item) => item.key === categoria)?.label || 'Registros',
    [categoria]
  );

  const estados = useMemo(
    () => [...new Set(registros.map((item) => item.estado).filter(Boolean))].sort(),
    [registros]
  );

  const registrosFiltrados = useMemo(() => {
    const normalizar = (texto) => texto
      .toLocaleLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const consulta = normalizar(busqueda.trim());

    return registros.filter((item) => {
      const valores = [
        item.titulo,
        item.autor,
        item.actorPrincipal,
        item.genero,
        item.tipo,
        item.estado,
        item.usuario?.usuario,
      ].filter(Boolean);
      const coincideTexto = valores.some((valor) => normalizar(String(valor)).includes(consulta));
      const coincideEstado = estadoFiltro === 'todos' || item.estado === estadoFiltro;
      const coincideDisponibilidad = disponibilidadFiltro === 'todos'
        || item.disponibilidad === disponibilidadFiltro;
      return coincideTexto && coincideEstado && coincideDisponibilidad;
    });
  }, [registros, busqueda, estadoFiltro, disponibilidadFiltro]);

  const cambiarCategoria = (nuevaCategoria) => {
    setCategoria(nuevaCategoria);
    setSearchParams({ categoria: nuevaCategoria });
    setBusqueda('');
    setEstadoFiltro('todos');
    setDisponibilidadFiltro('todos');
  };

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const eliminarRegistro = async (item) => {
    const confirmado = window.confirm(
      `¿Marcar "${item.titulo}" como inexistente? Seguirá visible en el catálogo administrativo.`
    );
    if (!confirmado) return;

    setEliminandoId(item.id);
    setError('');
    try {
      const recurso = {
        lecturas: 'lecturas',
        peliculas: 'peliculas',
        series: 'series',
      }[categoria];
      const response = await fetch(
        `http://localhost:8081/api/${recurso}/admin/${item.id}?administradorId=${usuario.id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.mensaje || 'No se pudo eliminar el registro.');
      }

      setRegistros((actuales) => actuales.map((registro) => (
        registro.id === item.id ? { ...registro, disponibilidad: 'inexistente' } : registro
      )));
    } catch (error) {
      setError(error.message || 'No se pudo eliminar el registro.');
    } finally {
      setEliminandoId(null);
    }
  };

  const renderDisponibilidad = (item) => (
    <span className={`badge ${item.disponibilidad === 'existe' ? 'badge-active' : 'badge-inactive'}`}>
      {item.disponibilidad === 'existe' ? 'Activo' : 'Inexistente'}
    </span>
  );

  const renderAccionEliminar = (item) => item.disponibilidad === 'existe' && (
    <button
      className="btn-peligro"
      type="button"
      onClick={() => eliminarRegistro(item)}
      disabled={eliminandoId === item.id}
    >
      {eliminandoId === item.id ? 'Eliminando…' : 'Eliminar registro'}
    </button>
  );

  const renderItem = (item) => {
    if (categoria === 'lecturas') {
      return (
        <div className="catalog-card" key={item.id}>
          {item.portadaUrl && (
            <img className="catalog-cover" src={`http://localhost:8081${item.portadaUrl}`} alt={`Portada de ${item.titulo}`} />
          )}
          <div className="catalog-card-header">
            <h3>{item.titulo}</h3>
            <div className="catalog-card-badges">
              <span className="badge badge-admin">{item.estado}</span>
              {renderDisponibilidad(item)}
            </div>
          </div>
          <p><strong>Autor:</strong> {item.autor || 'No registrado'}</p>
          <p><strong>Tipo:</strong> {item.tipo}</p>
          <p><strong>Valoración:</strong> {item.valoracion || 'Sin valoración'}</p>
          <p><strong>Usuario:</strong> {item.usuario?.usuario || 'Sin usuario'}</p>
          <div className="catalog-card-actions">{renderAccionEliminar(item)}</div>
        </div>
      );
    }

    if (categoria === 'peliculas') {
      return (
        <div className="catalog-card" key={item.id}>
          {item.portadaUrl && (
            <img className="catalog-cover" src={`http://localhost:8081${item.portadaUrl}`} alt={`Portada de ${item.titulo}`} />
          )}
          <div className="catalog-card-header">
            <h3>{item.titulo}</h3>
            <div className="catalog-card-badges">
              <span className="badge badge-admin">{item.estado}</span>
              {renderDisponibilidad(item)}
            </div>
          </div>
          <p><strong>Actor principal:</strong> {item.actorPrincipal || 'No registrado'}</p>
          <p><strong>Género:</strong> {item.genero || 'No registrado'}</p>
          <p><strong>Valoración:</strong> {item.valoracion || 'Sin valoración'}</p>
          <p><strong>Usuario:</strong> {item.usuario?.usuario || 'Sin usuario'}</p>
          <div className="catalog-card-actions">{renderAccionEliminar(item)}</div>
        </div>
      );
    }

    return (
      <div className="catalog-card" key={item.id}>
        {item.portadaUrl && (
          <img className="catalog-cover" src={`http://localhost:8081${item.portadaUrl}`} alt={`Portada de ${item.titulo}`} />
        )}
        <div className="catalog-card-header">
          <h3>{item.titulo}</h3>
          <div className="catalog-card-badges">
            <span className="badge badge-admin">{item.estado}</span>
            {renderDisponibilidad(item)}
          </div>
        </div>
        <p><strong>Actor principal:</strong> {item.actorPrincipal || 'No registrado'}</p>
        <p><strong>Capítulos:</strong> {item.numeroCapitulos ?? 'No registrado'}</p>
        <p><strong>Género:</strong> {item.genero || 'No registrado'}</p>
        <p><strong>Valoración:</strong> {item.valoracion || 'Sin valoración'}</p>
        <p><strong>Usuario:</strong> {item.usuario?.usuario || 'Sin usuario'}</p>
        <div className="catalog-card-actions">{renderAccionEliminar(item)}</div>
      </div>
    );
  };

  if (!usuario) return null;

  return (
    <div className="admin-page">
      <section className="admin-header">
        <div>
          <p className="eyebrow">Panel administrador</p>
          <h1>Catálogo global de {categoriaLabel}</h1>
        </div>

        <div className="admin-actions">
          <button className="btn-secundario" type="button" onClick={() => navigate('/admin')}>
            Volver a usuarios
          </button>
          <button className="btn-primario" type="button" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-tabs">
          {CATEGORIAS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={categoria === item.key ? 'tab active' : 'tab'}
              onClick={() => cambiarCategoria(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="catalogo-controles">
          <label className="admin-campo-busqueda">
            <span className="sr-only">Buscar registros</span>
            <input
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Buscar por título, autor, género o usuario"
            />
          </label>
          <label>
            <span className="sr-only">Filtrar por estado</span>
            <select value={estadoFiltro} onChange={(event) => setEstadoFiltro(event.target.value)}>
              <option value="todos">Todos los estados</option>
              {estados.map((estado) => <option key={estado} value={estado}>{estado}</option>)}
            </select>
          </label>
          <label>
            <span className="sr-only">Filtrar por disponibilidad</span>
            <select
              value={disponibilidadFiltro}
              onChange={(event) => setDisponibilidadFiltro(event.target.value)}
            >
              <option value="todos">Todos los registros</option>
              <option value="existe">Activos</option>
              <option value="inexistente">Inexistentes</option>
            </select>
          </label>
          <span className="admin-total">{registrosFiltrados.length} registros</span>
        </div>

        {error && <p className="form-message error-message">{error}</p>}

        {cargando ? (
          <p className="estado-msg">Cargando registros...</p>
        ) : registrosFiltrados.length === 0 ? (
          <p className="estado-msg">No hay registros para esta categoría.</p>
        ) : (
          <div className="catalog-grid">{registrosFiltrados.map(renderItem)}</div>
        )}
      </section>
    </div>
  );
}

export default AdminCatalogo;
