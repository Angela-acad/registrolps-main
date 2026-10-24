import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormularioPelicula from '../components/FormularioPelicula';
import '../styles/PeliculaNueva.css';

function PeliculaNueva() {
  const navigate = useNavigate();

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

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
    }
  }, [usuario, navigate]);

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
      duracionMinutos: formData.duracionMinutos ? Number(formData.duracionMinutos) : null,
      comentario: formData.comentario || null,
      portadaUrl: formData.portadaUrl || null,
    };

    try {
      const response = await fetch(
        `http://localhost:8081/api/peliculas?usuarioId=${usuario.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setMensaje({
          texto: data.mensaje || 'No se pudo crear la película',
          tipo: 'error',
        });
        setCargando(false);
        return;
      }

      navigate('/pelicula');
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
        <h1>Nueva película</h1>
        <p>
          Completa el formulario para guardar un nuevo registro en tu filmoteca.
        </p>
        <div className="intro-line" />
        <p className="intro-note">Los campos con * son obligatorios</p>
      </section>

      <section className="pelicula-nueva-panel">
        <div className="panel-top">
          <div className="panel-heading">
            <div className="panel-mark">+</div>
            <div>
              <p className="panel-kicker">Formulario</p>
              <h2>Agregar película</h2>
            </div>
          </div>

          <div className="panel-acciones">
            <button
              type="button"
              className="btn-secundario"
              onClick={() => navigate('/pelicula')}
            >
              Volver a Películas
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

        <FormularioPelicula
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          cargando={cargando}
          mensaje={mensaje}
        />
      </section>
    </div>
  );
}

export default PeliculaNueva;