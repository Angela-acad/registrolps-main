function FormularioSerie({ formData, onChange, onSubmit, cargando, mensaje }) {
  return (
    <form className="formulario-serie" onSubmit={onSubmit}>
      <div className="field-group">
        <label htmlFor="titulo">Título *</label>
        <input id="titulo" name="titulo" value={formData.titulo} onChange={onChange} required />
      </div>
      <div className="field-group">
        <label htmlFor="actorPrincipal">Actor principal</label>
        <input id="actorPrincipal" name="actorPrincipal" value={formData.actorPrincipal} onChange={onChange} />
      </div>
      <div className="field-group">
        <label htmlFor="genero">Género</label>
        <input id="genero" name="genero" value={formData.genero} onChange={onChange} />
      </div>
      <div className="field-group">
        <label htmlFor="numeroCapitulos">Número de capítulos</label>
        <input id="numeroCapitulos" type="number" name="numeroCapitulos" min="0" value={formData.numeroCapitulos} onChange={onChange} />
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
        <label htmlFor="comentario">Comentario</label>
        <textarea id="comentario" name="comentario" rows="4" value={formData.comentario} onChange={onChange} />
      </div>
      {mensaje.texto && <p className={`form-message ${mensaje.tipo === 'error' ? 'error-message' : 'success-message'}`}>{mensaje.texto}</p>}
      <button type="submit" className="submit-button" disabled={cargando}>
        <span>{cargando ? 'Guardando…' : 'Crear registro'}</span><span>→</span>
      </button>
    </form>
  );
}

export default FormularioSerie;