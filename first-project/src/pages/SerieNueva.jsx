import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormularioSerie from '../components/FormularioSerie';
import '../styles/Serie.css';

function SerieNueva() {
  const navigate = useNavigate();
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
    portadaUrl: '', // <-- AÑADIDO
  });

  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  useEffect(() => {
    if (!usuario) navigate('/login');
  }, [usuario, navigate]);

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
      numeroCapitulos: formData.numeroCapitulos ? Number(formData.numeroCapitulos) : null,
      valoracion: formData.valoracion || null,
      comentario: formData.comentario || null,
      portadaUrl: formData.portadaUrl || null, // <-- AÑADIDO
    };

    try {
      const response = await fetch(`http://localhost:8081/api/series?usuarioId=${usuario.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setMensaje({ texto: data.mensaje || 'No se pudo crear la serie', tipo: 'error' });
        setCargando(false);
        return;
      }

      navigate('/serie');
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
        <h1>Nueva serie</h1>
        <p>Completa los datos para añadir una serie a tu colección.</p>
        <div className="intro-line" />
        <p className="intro-note">Los campos con * son obligatorios</p>
      </section>

      <section className="serie-panel">
        <div className="panel-top">
          <div className="panel-heading">
            <div className="panel-mark">+</div>
            <div><p className="panel-kicker">Formulario</p><h2>Agregar serie</h2></div>
          </div>
          <div className="panel-acciones">
            <button type="button" className="btn-secundario" onClick={() => navigate('/serie')}>Volver a Series</button>
            <button type="button" className="btn-secundario" onClick={() => navigate('/')}>Inicio</button>
          </div>
        </div>

        <FormularioSerie formData={formData} onChange={handleChange} onSubmit={handleSubmit} cargando={cargando} mensaje={mensaje} />
      </section>
    </div>
  );
}

export default SerieNueva;