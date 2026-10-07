function FormularioPelicula({ formData, onChange, onSubmit, cargando, mensaje, textoBoton = 'Añadir' }) {
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