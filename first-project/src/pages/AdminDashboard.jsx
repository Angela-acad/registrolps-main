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
        const response = await fetch('http://localhost:8081/api/usuario');
        if (!response.ok) {
          throw new Error('No se pudieron cargar los usuarios');
        }
        const data = await response.json();
        setUsuarios(data);
      } catch (error) {
        console.error(error);
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
      return coincideNombre && coincideTipo;
    });
  }, [usuarios, busqueda, tipoFiltro]);

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
          <button
            className="btn-secundario"
            type="button"
            onClick={() => navigate('/admin/catalogo')}
          >
            Ver catálogo global
          </button>
          <button
            className="btn-primario"
            type="button"
            onClick={() => navigate('/admin/usuarios/nuevo')}
          >
            Crear usuario
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
            <span>{usuarios.filter((item) => item.tipo === 'Usuario_estandar').length}</span>
            <p>Cuentas estándar</p>
          </div>
          <div className="resumen-cifra">
            <span>{usuarios.filter((item) => item.tipo === 'Administrador').length}</span>
            <p>Administradores</p>
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
        </div>

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
