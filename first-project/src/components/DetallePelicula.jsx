function DetallePelicula({ pelicula, onEliminar, onModificar, eliminando }) {
  if (!pelicula) return null;

  const filas = [
    { etiqueta: 'Título', valor: pelicula.titulo },
    { etiqueta: 'Actor Principal', valor: pelicula.actorPrincipal },
    { etiqueta: 'Género', valor: pelicula.genero },
    { etiqueta: 'Duración', valor: pelicula.duracionMinutos ? `${pelicula.duracionMinutos} min` : null },
    { etiqueta: 'Estado', valor: pelicula.estado },
    { etiqueta: 'Valoración', valor: pelicula.valoracion },
    { etiqueta: 'Fecha de registro', valor: pelicula.fechaCreacion ? new Date(pelicula.fechaCreacion).toLocaleString('es-ES') : null },
  ];

  return (
    <div className="detalle-pelicula">
      <div className="detalle-lista">
        {filas.map((fila) => fila.valor != null && fila.valor !== '' && (
          <div key={fila.etiqueta} className="detalle-fila">
            <span className="detalle-etiqueta">{fila.etiqueta}</span>
            <span className="detalle-valor">{fila.valor}</span>
          </div>
        ))}
      </div>

      {pelicula.comentario && (
        <div className="detalle-comentario">
          <span className="detalle-etiqueta">Comentario</span>
          <p>{pelicula.comentario}</p>
        </div>
      )}

      <div className="detalle-acciones">
        <button type="button" className="btn-primario" onClick={onModificar}>Modificar</button>
        <button type="button" className="btn-peligro" onClick={onEliminar} disabled={eliminando}>
          {eliminando ? 'Eliminando…' : 'Eliminar registro'}
        </button>
      </div>
    </div>
  );
}
export default DetallePelicula;