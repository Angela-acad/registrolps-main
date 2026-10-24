function TarjetaSerie({ serie, onClick }) {
  return (
    <button type="button" className="tarjeta-serie" onClick={() => onClick(serie.id)}>
      <div className="tarjeta-cabecera">
        <h3>{serie.titulo}</h3>
        <span className="tarjeta-estado">{serie.estado?.replaceAll('_', ' ')}</span>
      </div>

      {/* NUEVO: Imagen de portada */}
      {serie.portadaUrl && (
        <img 
          src={`http://localhost:8081${serie.portadaUrl}`} 
          alt={`Portada de ${serie.titulo}`} 
          style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginBottom: '10px', borderRadius: '4px' }} 
        />
      )}

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