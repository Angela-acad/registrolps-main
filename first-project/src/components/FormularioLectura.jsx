function FormularioLectura({
  formData,
  onChange,
  onSubmit,
  cargando,
  mensaje,
  textoBoton = 'Añadir',
}) {
  return (
    <form className="formulario-lectura" onSubmit={onSubmit}>
      <div className="field-group">
        <label htmlFor="titulo">Título *</label>
        <input
          id="titulo"
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={onChange}
          required
        />
      </div>

      <div className="field-group">
        <label htmlFor="autor">Autor</label>
        <input
          id="autor"
          type="text"
          name="autor"
          value={formData.autor}
          onChange={onChange}
        />
      </div>

      <div className="field-group">
        <label htmlFor="tipo">Tipo de lectura *</label>
        <select
          id="tipo"
          name="tipo"
          value={formData.tipo}
          onChange={onChange}
          required
        >
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
        <select
          id="estado"
          name="estado"
          value={formData.estado}
          onChange={onChange}
          required
        >
          <option value="">Selecciona un estado</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En_proceso">En proceso</option>
          <option value="Finalizado">Finalizado</option>
          <option value="Abandonado">Abandonado</option>
        </select>
      </div>

      <div className="field-group">
        <label htmlFor="valoracion">Valoración</label>
        <select
          id="valoracion"
          name="valoracion"
          value={formData.valoracion}
          onChange={onChange}
        >
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
          <input
            id="numeroVolumenes"
            type="number"
            name="numeroVolumenes"
            min="0"
            value={formData.numeroVolumenes}
            onChange={onChange}
          />
        </div>

        <div className="field-group">
          <label htmlFor="numeroCapitulos">Nº capítulos</label>
          <input
            id="numeroCapitulos"
            type="number"
            name="numeroCapitulos"
            min="0"
            value={formData.numeroCapitulos}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="field-group">
        <label htmlFor="comentario">Comentario</label>
        <textarea
          id="comentario"
          name="comentario"
          rows="4"
          value={formData.comentario}
          onChange={onChange}
        />
      </div>

      {mensaje.texto && (
        <p
          className={`form-message ${
            mensaje.tipo === 'error' ? 'error-message' : 'success-message'
          }`}
        >
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