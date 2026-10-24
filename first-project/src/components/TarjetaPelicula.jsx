function TarjetaPelicula({ pelicula, onClick }) {
  return (
    <button type="button" className="tarjeta-pelicula" onClick={() => onClick(pelicula.id)}>
      <div className="tarjeta-cabecera">
        <h3>{pelicula.titulo}</h3>
        <span className="tarjeta-estado">{pelicula.estado}</span>
      </div>

      {/* NUEVO: Imagen de portada */}
      {pelicula.portadaUrl && (
        <img 
          src={`http://localhost:8081${pelicula.portadaUrl}`} 
          alt={`Portada de ${pelicula.titulo}`} 
          style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', marginBottom: '10px' }} 
        />
      )}

      <div className="tarjeta-meta">
        {pelicula.actorPrincipal && <span>Actor: {pelicula.actorPrincipal}</span>}
        {pelicula.genero && <span>Género: {pelicula.genero}</span>}
        {pelicula.duracionMinutos && <span>Duración: {pelicula.duracionMinutos} min</span>}
        {pelicula.valoracion && <span>Valoración: {pelicula.valoracion}</span>}
      </div>

      {pelicula.comentario && <p className="tarjeta-comentario">{pelicula.comentario}</p>}

      <span className="tarjeta-accion">Ver detalle →</span>
    </button>
  );
}
export default TarjetaPelicula;
