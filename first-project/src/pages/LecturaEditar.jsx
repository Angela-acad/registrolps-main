import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormularioLectura from '../components/FormularioLectura';
import '../styles/LecturaNueva.css';

function LecturaEditar() {
  const navigate = useNavigate();
  const { id } = useParams();

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

  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
      return;
    }

    let cancelado = false;

    async function cargarLectura() {
      try {
        const response = await fetch(
          `http://localhost:8080/api/lecturas/${id}?usuarioId=${usuario.id}`
        );
        if (!response.ok) throw new Error('No encontrada');
        const data = await response.json();

        if (!cancelado) {
          setFormData({
            titulo: data.titulo || '',
            autor: data.autor || '',
            tipo: data.tipo || '',
            estado: data.estado || '',
            valoracion: data.valoracion || '',
            numeroVolumenes: data.numeroVolumenes ?? '',
            numeroCapitulos: data.numeroCapitulos ?? '',
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

    cargarLectura();

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
      autor: formData.autor || null,
      tipo: formData.tipo,
      estado: formData.estado,
      valoracion: formData.valoracion || null,
      numeroVolumenes:
        formData.numeroVolumenes !== '' ? Number(formData.numeroVolumenes) : null,
      numeroCapitulos:
        formData.numeroCapitulos !== '' ? Number(formData.numeroCapitulos) : null,
      comentario: formData.comentario || null,
    };

    try {
      const response = await fetch(
        `http://localhost:8080/api/lecturas/${id}?usuarioId=${usuario.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setMensaje({
          texto: data.mensaje || 'No se pudo actualizar la lectura',
          tipo: 'error',
        });
        setCargando(false);
        return;
      }

      navigate(`/lectura/${id}`);
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
        <h1>Editar lectura</h1>
        <p>Modifica los datos del registro y guarda los cambios.</p>
        <div className="intro-line" />
        <p className="intro-note">Los campos con * son obligatorios</p>
      </section>

      <section className="lectura-nueva-panel">
        <div className="panel-top">
          <div className="panel-heading">
            <div className="panel-mark">E</div>
            <div>
              <p className="panel-kicker">Formulario</p>
              <h2>Modificar lectura</h2>
            </div>
          </div>

          <div className="panel-acciones">
            <button
              type="button"
              className="btn-secundario"
              onClick={() => navigate(`/lectura/${id}`)}
            >
              Volver al detalle
            </button>
            <button
              type="button"
              className="btn-secundario"
              onClick={() => navigate('/lectura')}
            >
              Volver a Lectura
            </button>
          </div>
        </div>

        {cargandoDatos && <p className="estado-msg">Cargando datos…</p>}

        {!cargandoDatos && (
          <FormularioLectura
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

export default LecturaEditar;