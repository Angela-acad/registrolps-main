import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormularioLectura from '../components/FormularioLectura';
import '../styles/LecturaNueva.css';

function LecturaNueva() {
  const navigate = useNavigate();

  const [usuario] = useState(() => {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado) : null;
  });

  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    tipo: '',
    estado: '',
    valoracion: '',
    numeroVolumenes: '',
    numeroCapitulos: '',
    comentario: '',
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
      autor: formData.autor || null,
      tipo: formData.tipo,
      estado: formData.estado,
      valoracion: formData.valoracion || null,
      numeroVolumenes: formData.numeroVolumenes ? Number(formData.numeroVolumenes) : null,
      numeroCapitulos: formData.numeroCapitulos ? Number(formData.numeroCapitulos) : null,
      comentario: formData.comentario || null,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/lecturas?usuarioId=${usuario.id}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setMensaje({
          texto: data.mensaje || 'No se pudo crear la lectura',
          tipo: 'error',
        });
        setCargando(false);
        return;
      }

      // Éxito → volver al listado (el nuevo registro aparecerá primero)
      navigate('/lectura');
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
    <div className="lectura-nueva-page">
      <section className="lectura-nueva-intro">
        <p className="eyebrow">Registro LPS</p>
        <h1>Nueva lectura</h1>
        <p>
          Completa el formulario para guardar un nuevo registro en tu biblioteca.
        </p>
        <div className="intro-line" />
        <p className="intro-note">Los campos con * son obligatorios</p>
      </section>

      <section className="lectura-nueva-panel">
        <div className="panel-top">
          <div className="panel-heading">
            <div className="panel-mark">+</div>
            <div>
              <p className="panel-kicker">Formulario</p>
              <h2>Agregar lectura</h2>
            </div>
          </div>

          <div className="panel-acciones">
            <button
              type="button"
              className="btn-secundario"
              onClick={() => navigate('/lectura')}
            >
              Volver a Lectura
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

        <FormularioLectura
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

export default LecturaNueva;