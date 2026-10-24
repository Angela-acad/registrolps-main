import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormularioSerie from '../components/FormularioSerie';
import '../styles/Serie.css';

function SerieEditar() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [usuario] = useState(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  const [formData, setFormData] = useState({
    titulo: '',
    actorPrincipal: '',
    numeroCapitulos: '',
    genero: '',
    estado: '',
    valoracion: '',
    comentario: '',
    portadaUrl: '', // <-- IMPORTANTE
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

    async function cargarSerie() {
      try {
        const response = await fetch(`http://localhost:8081/api/series/${id}?usuarioId=${usuario.id}`);
        if (!response.ok) throw new Error('No encontrada');
        const data = await response.json();

        if (!cancelado) {
          setFormData({
            titulo: data.titulo || '',
            actorPrincipal: data.actorPrincipal || '',
            numeroCapitulos: data.numeroCapitulos ?? '',
            genero: data.genero || '',
            estado: data.estado || '',
            valoracion: data.valoracion || '',
            comentario: data.comentario || '',
            portadaUrl: data.portadaUrl || '', // <-- IMPORTANTE
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

    cargarSerie();

    return () => {
      cancelado = true;
    };
  }, [usuario, navigate, id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((actual) => ({ ...actual, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setCargando(true);
    setMensaje({ texto: '', tipo: '' });

    const body = {
      ...formData,
      actorPrincipal: formData.actorPrincipal || null,
      numeroCapitulos: formData.numeroCapitulos !== '' ? Number(formData.numeroCapitulos) : null,
      valoracion: formData.valoracion || null,
      comentario: formData.comentario || null,
      portadaUrl: formData.portadaUrl || null, // <-- IMPORTANTE
    };

    try {
      const response = await fetch(`http://localhost:8081/api/series/${id}?usuarioId=${usuario.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setMensaje({ texto: data.mensaje || 'No se pudo actualizar la serie', tipo: 'error' });
        setCargando(false);
        return;
      }

      navigate(`/serie/${id}`);
    } catch {
      setMensaje({ texto: 'Error de conexión con el servidor', tipo: 'error' });
      setCargando(false);
    }
  };

  if (!usuario) return null;

  return (
    <div className="serie-page">
      <section className="serie-intro">
        <p className="eyebrow">Registro LPS</p>
        <h1>Editar serie</h1>
        <p>Modifica los datos del registro y guarda los cambios.</p>
        <div className="intro-line" />
        <p className="intro-note">Los campos con * son obligatorios</p>
      </section>

      <section className="serie-panel">
        <div className="panel-top">
          <div className="panel-heading">
            <div className="panel-mark">E</div>
            <div><p className="panel-kicker">Formulario</p><h2>Modificar serie</h2></div>
          </div>
          <div className="panel-acciones">
            <button type="button" className="btn-secundario" onClick={() => navigate(`/serie/${id}`)}>Volver al detalle</button>
            <button type="button" className="btn-secundario" onClick={() => navigate('/serie')}>Volver a Series</button>
          </div>
        </div>

        {cargandoDatos && <p className="estado-msg">Cargando datos…</p>}

        {!cargandoDatos && (
          <FormularioSerie 
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

export default SerieEditar;