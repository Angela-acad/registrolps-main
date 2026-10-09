function TarjetaSerie({ serie, onClick }) {
  return (
    <button type="button" className="tarjeta-serie" onClick={() => onClick(serie.id)}>
      <div className="tarjeta-cabecera">
        <h3>{serie.titulo}</h3>
        <span className="tarjeta-estado">{serie.estado?.replaceAll('_', ' ')}</span>
      </div>
      <div className="tarjeta-meta">
        {serie.actorPrincipal && <span>Actor: {serie.actorPrincipal}</span>}
        {serie.genero && <span>Género: {serie.genero}</span>}
        {serie.numeroCapitulos != null && <span>{serie.numeroCapitulos} capítulos</span>}
        {serie.fechaCreacion && <span>{new Date(serie.fechaCreacion).toLocaleDateString('es-ES')}</span>}
      </div>
      {serie.comentario && <p className="tarjeta-comentario">{serie.comentario}</p>}
      <span className="tarjeta-accion">Ver detalle →</span>
    </button>
  );
}

export default TarjetaSerie;