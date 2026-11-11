import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Admin.css';

const CATEGORIAS = [
  { key: 'lecturas', label: 'Libros', descripcion: 'Registros de lectura' },
  { key: 'peliculas', label: 'Películas', descripcion: 'Registros de películas' },
  { key: 'series', label: 'Series', descripcion: 'Registros de series' },
];

function AdminDashboard() {
  const navigate = useNavigate();

  const [usuario] = useState(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('todos');
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

    const cargarUsuarios = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/api/usuario?administradorId=${usuario.id}`
        );
        if (!response.ok) {
          throw new Error('No se pudieron cargar los usuarios');
        }
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error(error);
        setError('No se pudieron cargar las cuentas. Verifica la conexión con el servidor.');
      } finally {
        setCargando(false);
      }
    };

    cargarUsuarios();
  }, [usuario, navigate]);

  const cerrarSesion = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const usuariosFiltrados = useMemo(() => {
    const consulta = busqueda.trim().toLocaleLowerCase();
    return usuarios.filter((item) => {
      const coincideNombre = (item.usuario || '').toLocaleLowerCase().includes(consulta);
      const coincideTipo = tipoFiltro === 'todos' || item.tipo === tipoFiltro;
      const coincideDisponibilidad = disponibilidadFiltro === 'todos'
        || item.disponibilidad === disponibilidadFiltro;
      return coincideNombre && coincideTipo && coincideDisponibilidad;
    });
  }, [usuarios, busqueda, tipoFiltro, disponibilidadFiltro]);

  const eliminarUsuario = async (item) => {
    const confirmado = window.confirm(
      `¿Marcar la cuenta de ${item.usuario} como inexistente? Sus registros también quedarán inactivos y visibles para administración.`
    );
    if (!confirmado) return;

    setEliminandoId(item.id);
    setError('');
    try {
      const response = await fetch(
        `http://localhost:8081/api/usuario/admin/${item.id}?administradorId=${usuario.id}`,
        { method: 'DELETE' }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.mensaje || 'No se pudo eliminar la cuenta.');
      }

      if (item.id === usuario.id) {
        localStorage.removeItem('usuario');
        navigate('/login', { replace: true });
        return;
      }

      setUsuarios((actuales) => actuales.map((cuenta) => (
        cuenta.id === item.id ? { ...cuenta, disponibilidad: 'inexistente' } : cuenta
      )));
    } catch (error) {
      setError(error.message || 'No se pudo eliminar la cuenta.');
    } finally {
      setEliminandoId(null);
    }
  };

  if (!usuario) return null;

  return (
    <div className="admin-page">
      <section className="admin-header">
        <div>
          <p className="eyebrow">Panel administrador</p>
          <h1>Usuarios del sistema</h1>
          <p className="admin-subtitulo">Vista general de cuentas y registros</p>
        </div>

        <div className="admin-actions">
          <button className="btn-secundario" type="button" onClick={() => navigate('/admin/catalogo')}>
            Ver catálogo global
          </button>
          <button className="btn-primario" type="button" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-resumen">
          <div className="resumen-cifra">
            <span>{usuarios.length}</span>
            <p>Usuarios registrados</p>
          </div>
          <div className="resumen-cifra">
            <span>{usuarios.filter((item) => item.disponibilidad === 'existe').length}</span>
            <p>Cuentas activas</p>
          </div>
          <div className="resumen-cifra">
            <span>{usuarios.filter((item) => item.disponibilidad === 'inexistente').length}</span>
            <p>Cuentas inexistentes</p>
          </div>
        </div>

        <div className="admin-section-heading">
          <div>
            <p className="panel-kicker">Explorar registros</p>
            <h2>Catálogo global</h2>
          </div>
          <span className="admin-total">3 categorías</span>
        </div>

        <div className="admin-categorias">
          {CATEGORIAS.map((item, index) => (
            <button
              className="categoria-link"
              key={item.key}
              type="button"
              onClick={() => navigate(`/admin/catalogo?categoria=${item.key}`)}
            >
              <span className="categoria-indice">0{index + 1}</span>
              <span className="categoria-texto">
                <strong>{item.label}</strong>
                <small>{item.descripcion}</small>
              </span>
              <span className="categoria-flecha" aria-hidden="true">→</span>
            </button>
          ))}
        </div>

        <div className="admin-section-heading usuarios-heading">
          <div>
            <p className="panel-kicker">Tu cuenta</p>
            <h2>Mis registros</h2>
          </div>
          <span className="admin-total">Crear, modificar y eliminar los tuyos</span>
        </div>

        <div className="admin-mis-registros">
          <button className="btn-secundario" type="button" onClick={() => navigate('/lectura')}>
            Gestionar mis libros
          </button>
          <button className="btn-secundario" type="button" onClick={() => navigate('/pelicula')}>
            Gestionar mis películas
          </button>
          <button className="btn-secundario" type="button" onClick={() => navigate('/serie')}>
            Gestionar mis series
          </button>
        </div>

        <div className="admin-section-heading usuarios-heading">
          <div>
            <p className="panel-kicker">Administración</p>
            <h2>Usuarios</h2>
          </div>
          <span className="admin-total">{usuariosFiltrados.length} resultados</span>
        </div>

        <div className="admin-filtros">
          <label className="admin-campo-busqueda">
            <span className="sr-only">Buscar usuario</span>
            <input
              type="search"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              placeholder="Buscar por nombre de usuario"
            />
          </label>
          <label>
            <span className="sr-only">Filtrar por tipo de usuario</span>
            <select value={tipoFiltro} onChange={(event) => setTipoFiltro(event.target.value)}>
              <option value="todos">Todos los roles</option>
              <option value="Administrador">Administrador</option>
              <option value="Usuario_estandar">Usuario estándar</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Filtrar por disponibilidad de cuenta</span>
            <select
              value={disponibilidadFiltro}
              onChange={(event) => setDisponibilidadFiltro(event.target.value)}
            >
              <option value="todos">Cualquier estado</option>
              <option value="existe">Activas</option>
              <option value="inexistente">Inexistentes</option>
            </select>
          </label>
        </div>

        {error && <p className="form-message error-message">{error}</p>}

        {cargando ? (
          <p className="estado-msg">Cargando usuarios...</p>
        ) : (
          <div className="admin-lista">
            {usuariosFiltrados.length === 0 ? (
              <p className="estado-msg">No hay usuarios que coincidan con la búsqueda.</p>
            ) : (
              usuariosFiltrados.map((item) => (
                <div className="admin-card" key={item.id}>
                  <div>
                    <p className="admin-card-label">Usuario</p>
                    <h3>{item.usuario}</h3>
                  </div>

                  <div>
                    <p className="admin-card-label">Tipo</p>
                    <span className={`badge ${item.tipo === 'Administrador' ? 'badge-admin' : 'badge-user'}`}>
                      {item.tipo}
                    </span>
                  </div>

                  <div className="admin-card-actions">
                    <span className={`badge ${item.disponibilidad === 'existe' ? 'badge-active' : 'badge-inactive'}`}>
                      {item.disponibilidad === 'existe' ? 'Activo' : 'Inexistente'}
                    </span>
                    {item.disponibilidad === 'existe' && (
                      <button
                        className="btn-peligro"
                        type="button"
                        onClick={() => eliminarUsuario(item)}
                        disabled={eliminandoId === item.id}
                      >
                        {eliminandoId === item.id ? 'Eliminando…' : 'Eliminar cuenta'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
