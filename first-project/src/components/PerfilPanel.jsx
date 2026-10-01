import { useState } from 'react';

function PerfilPanel({ usuario, onActualizar, onEliminar, onCerrarSesion }) {
  const [abierto, setAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [formData, setFormData] = useState({
    usuario: usuario?.usuario || '',
    password: '',
  });
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [cargando, setCargando] = useState(false);

  const togglePanel = () => {
    setAbierto((prev) => !prev);
    setModoEdicion(false);
    setMensaje({ texto: '', tipo: '' });
    setFormData({ usuario: usuario?.usuario || '', password: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuardar = async () => {
    setCargando(true);
    setMensaje({ texto: '', tipo: '' });

    const resultado = await onActualizar(formData);

    if (resultado.ok) {
      setMensaje({ texto: 'Perfil actualizado correctamente', tipo: 'success' });
      setModoEdicion(false);
      setFormData((prev) => ({ ...prev, password: '' }));
    } else {
      setMensaje({ texto: resultado.mensaje || 'Error al actualizar', tipo: 'error' });
    }

    setCargando(false);
  };

  const handleEliminar = async () => {
    const confirmar = window.confirm(
      '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.'
    );
    if (!confirmar) return;

    setCargando(true);
    await onEliminar();
    setCargando(false);
  };

  if (!usuario) return null;

  return (
    <div className="perfil-panel">
      <button type="button" className="btn-perfil" onClick={togglePanel}>
        Perfil
      </button>

      {abierto && (
        <div className="perfil-desplegable">
          <p className="panel-kicker">Tu cuenta</p>

          {modoEdicion ? (
            <>
              <div className="field-group">
                <label htmlFor="perfil-usuario">Usuario</label>
                <input
                  id="perfil-usuario"
                  type="text"
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleChange}
                />
              </div>

              <div className="field-group">
                <label htmlFor="perfil-password">Nueva contraseña</label>
                <input
                  id="perfil-password"
                  type="password"
                  name="password"
                  placeholder="Dejar vacío si no cambia"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </>
          ) : (
            <div className="perfil-datos">
              <p><strong>Usuario:</strong> {usuario.usuario}</p>
              <p><strong>Tipo:</strong> {usuario.tipo}</p>
              <p><strong>Contraseña:</strong> ••••••••</p>
            </div>
          )}

          {mensaje.texto && (
            <p className={`form-message ${mensaje.tipo === 'error' ? 'error-message' : 'success-message'}`}>
              {mensaje.texto}
            </p>
          )}

          <div className="perfil-acciones">
            {modoEdicion ? (
              <>
                <button
                  type="button"
                  className="btn-secundario"
                  onClick={() => setModoEdicion(false)}
                  disabled={cargando}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn-primario"
                  onClick={handleGuardar}
                  disabled={cargando}
                >
                  {cargando ? 'Guardando…' : 'Guardar'}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-primario"
                  onClick={() => setModoEdicion(true)}
                >
                  Modificar
                </button>
                <button
                  type="button"
                  className="btn-peligro"
                  onClick={handleEliminar}
                  disabled={cargando}
                >
                  Eliminar
                </button>
              </>
            )}
          </div>
          {!modoEdicion && (
            <button
              type="button"
              className="btn-cerrar-sesion"
              onClick={onCerrarSesion}
            >
              Cerrar sesión
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default PerfilPanel;