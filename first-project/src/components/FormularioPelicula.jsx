function FormularioPelicula({ formData, onChange, onSubmit, cargando, mensaje, textoBoton = 'Añadir' }) {
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Creamos un objeto FormData para enviar el archivo
    const data = new FormData();
    data.append('archivo', file);

    try {
      // Subimos la imagen al backend
      const response = await fetch('http://localhost:8081/api/upload', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) throw new Error('Error al subir la imagen');

      const result = await response.json();
      
      // Actualizamos el formData con la URL devuelta por el backend
      // Simulamos un evento similar al de los inputs de texto
      onChange({ target: { name: 'portadaUrl', value: result.url } });

    } catch (error) {
       alert(`No se pudo subir la imagen: ${error.message}`);
    }
  };

  return (
    <form className="formulario-pelicula" onSubmit={onSubmit}>
      <div className="field-group">
        <label htmlFor="titulo">Título *</label>
        <input id="titulo" type="text" name="titulo" value={formData.titulo} onChange={onChange} required />
      </div>

      <div className="field-group">
        <label htmlFor="actorPrincipal">Actor Principal</label>
        <input id="actorPrincipal" type="text" name="actorPrincipal" value={formData.actorPrincipal} onChange={onChange} />
      </div>

      <div className="field-group">
        <label htmlFor="genero">Género *</label>
        <select id="genero" name="genero" value={formData.genero} onChange={onChange} required>
          <option value="">Selecciona un género</option>
          <option value="Accion">Acción</option>
          <option value="Comedia">Comedia</option>
          <option value="Drama">Drama</option>
          <option value="Terror">Terror</option>
          <option value="Ciencia_Ficcion">Ciencia Ficción</option>
        </select>
      </div>

      <div className="field-group">
        <label htmlFor="estado">Estado *</label>
        <select id="estado" name="estado" value={formData.estado} onChange={onChange} required>
          <option value="">Selecciona un estado</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En_proceso">En proceso</option>
          <option value="Finalizado">Finalizado</option>
          <option value="Abandonado">Abandonado</option>
        </select>
      </div>

      <div className="field-group">
        <label htmlFor="valoracion">Valoración</label>
        <select id="valoracion" name="valoracion" value={formData.valoracion} onChange={onChange}>
          <option value="">Sin valoración</option>
          <option value="Muy_malo">Muy malo</option>
          <option value="Malo">Malo</option>
          <option value="Regular">Regular</option>
          <option value="Bueno">Bueno</option>
          <option value="Excelente">Excelente</option>
        </select>
      </div>

      <div className="field-group">
        <label htmlFor="duracionMinutos">Duración (minutos)</label>
        <input id="duracionMinutos" type="number" name="duracionMinutos" min="0" value={formData.duracionMinutos} onChange={onChange} />
      </div>

      {/* NUEVO: Campo para subir la portada */}
      <div className="field-group">
        <label htmlFor="portada">Portada (imagen)</label>
        <input id="portada" type="file" accept="image/*" onChange={handleFileChange} />
        {formData.portadaUrl && (
          <div>
            <p style={{ fontSize: '12px', color: 'green' }}>✓ Imagen subida correctamente</p>
            <img
              src={`http://localhost:8081${formData.portadaUrl}`}
              alt="Vista previa de la portada"
              style={{ display: 'block', width: '120px', maxHeight: '180px', objectFit: 'cover', marginTop: '8px' }}
            />
          </div>
        )}
      </div>

      <div className="field-group">
        <label htmlFor="comentario">Comentario</label>
        <textarea id="comentario" name="comentario" rows="4" value={formData.comentario} onChange={onChange} />
      </div>

      {mensaje.texto && (
        <p className={`form-message ${mensaje.tipo === 'error' ? 'error-message' : 'success-message'}`}>
          {mensaje.texto}
        </p>
      )}

      <button type="submit" className="submit-button" disabled={cargando}>
        <span>{cargando ? 'Guardando…' : textoBoton}</span>
        <span>→</span>
      </button>
    </form>
  );
}

export default FormularioPelicula;