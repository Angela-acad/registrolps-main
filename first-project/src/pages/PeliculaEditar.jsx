import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormularioPelicula from '../components/FormularioPelicula';
import '../styles/PeliculaNueva.css';

function PeliculaEditar() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [usuario] = useState(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  const [formData, setFormData] = useState({
    titulo: '',
    actorPrincipal: '',
    genero: '',
    estado: '',
    valoracion: '',
    duracionMinutos: '',
    comentario: '',
    portadaUrl: '',
  });

  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
      return;
    }

    let cancelado = false;

    async function cargarPelicula() {
      try {
        const response = await fetch(
          `http://localhost:8081/api/peliculas/${id}?usuarioId=${usuario.id}`
        );
        if (!response.ok) throw new Error('No encontrada');
        const data = await response.json();

        if (!cancelado) {
          setFormData({
            titulo: data.titulo || '',
            actorPrincipal: data.actorPrincipal || '',
            genero: data.genero || '',
            estado: data.estado || '',
            valoracion: data.valoracion || '',
            duracionMinutos: data.duracionMinutos ?? '',
            comentario: data.comentario || '',
          });
        }
      } catch {
        if (!cancelado) {
          setMensaje({ texto: 'No se pudo cargar el registro', tipo: 'error' });
        }
      } finally {
        if (!cancelado) {
          setCargandoDatos(false);
        }
      }
    }

    cargarPelicula();

    return () => {
      cancelado = true;
    };
  }, [usuario, navigate, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensaje({ texto: '', tipo: '' });

    const body = {
      titulo: formData.titulo,
      actorPrincipal: formData.actorPrincipal || null,
      genero: formData.genero,
      estado: formData.estado,
      valoracion: formData.valoracion || null,
      duracionMinutos:
        formData.duracionMinutos !== '' ? Number(formData.duracionMinutos) : null,
      comentario: formData.comentario || null,
      portadaUrl: formData.portadaUrl || null,
    };

    try {
      const response = await fetch(
        `http://localhost:8081/api/peliculas/${id}?usuarioId=${usuario.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setMensaje({
          texto: data.mensaje || 'No se pudo actualizar la película',
          tipo: 'error',
        });
        setCargando(false);
        return;
      }

      navigate(`/pelicula/${id}`);
    } catch {
      setMensaje({
        texto: 'Error de conexión con el servidor',
        tipo: 'error',
      });
      setCargando(false);
    }
  };

  if (!usuario) return null;

  return (
    <div className="pelicula-nueva-page">
      <section className="pelicula-nueva-intro">
        <p className="eyebrow">Registro LPS</p>
        <h1>Editar película</h1>
        <p>Modifica los datos del registro y guarda los cambios.</p>
        <div className="intro-line" />
        <p className="intro-note">Los campos con * son obligatorios</p>
      </section>

      <section className="pelicula-nueva-panel">
        <div className="panel-top">
          <div className="panel-heading">
            <div className="panel-mark">E</div>
            <div>
              <p className="panel-kicker">Formulario</p>
              <h2>Modificar película</h2>
            </div>
          </div>

          <div className="panel-acciones">
            <button
              type="button"
              className="btn-secundario"
              onClick={() => navigate(`/pelicula/${id}`)}
            >
              Volver al detalle
            </button>
            <button
              type="button"
              className="btn-secundario"
              onClick={() => navigate('/pelicula')}
            >
              Volver a Películas
            </button>
          </div>
        </div>

        {cargandoDatos && <p className="estado-msg">Cargando datos…</p>}

        {!cargandoDatos && (
          <FormularioPelicula
            formData={formData}
            onChange={handleChange}
            onSubmit={handleSubmit}
            cargando={cargando}
            mensaje={mensaje}
            textoBoton="Guardar cambios"
          />
        )}
      </section>
    </div>
  );
}

export default PeliculaEditar;