function FormularioLectura({ formData, onChange, onSubmit, cargando, mensaje, textoBoton = 'Añadir' }) {
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('archivo', file);

    try {
      const response = await fetch('http://localhost:8081/api/upload', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) throw new Error('Error al subir la imagen');

      const result = await response.json();
      onChange({ target: { name: 'portadaUrl', value: result.url } });

    } catch (error) {
      alert(`No se pudo subir la imagen: ${error.message}`);
    }
  };

  return (
    <form className="formulario-lectura" onSubmit={onSubmit}>
      <div className="field-group">
        <label htmlFor="titulo">Título *</label>
        <input id="titulo" type="text" name="titulo" value={formData.titulo} onChange={onChange} required />
      </div>

      <div className="field-group">
        <label htmlFor="autor">Autor</label>
        <input id="autor" type="text" name="autor" value={formData.autor} onChange={onChange} />
      </div>

      <div className="field-group">
        <label htmlFor="tipo">Tipo de lectura *</label>
        <select id="tipo" name="tipo" value={formData.tipo} onChange={onChange} required>
          <option value="">Selecciona un tipo</option>
          <option value="Libro">Libro</option>
          <option value="Novela">Novela</option>
          <option value="Manga">Manga</option>
          <option value="Manhwa">Manhwa</option>
          <option value="Manhua">Manhua</option>
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

      <div className="campos-numericos">
        <div className="field-group">
          <label htmlFor="numeroVolumenes">Nº volúmenes</label>
          <input id="numeroVolumenes" type="number" name="numeroVolumenes" min="0" value={formData.numeroVolumenes} onChange={onChange} />
        </div>

        <div className="field-group">
          <label htmlFor="numeroCapitulos">Nº capítulos</label>
          <input id="numeroCapitulos" type="number" name="numeroCapitulos" min="0" value={formData.numeroCapitulos} onChange={onChange} />
        </div>
      </div>

      {/* NUEVO: Campo para subir la portada */}
      <div className="field-group">
        <label htmlFor="portada">Portada (imagen)</label>
        <input id="portada" type="file" accept="image/*" onChange={handleFileChange} />
        {formData.portadaUrl && (
          <p style={{ fontSize: '12px', color: 'green', marginTop: '5px' }}>✓ Imagen subida correctamente</p>
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

export default FormularioLectura;