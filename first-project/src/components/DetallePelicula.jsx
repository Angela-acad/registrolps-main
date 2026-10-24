function DetallePelicula({ pelicula, onEliminar, onModificar, eliminando }) {
  if (!pelicula) return null;

  const filas = [
    { etiqueta: 'Título', valor: pelicula.titulo },
    { etiqueta: 'Actor Principal', valor: pelicula.actorPrincipal },
    { etiqueta: 'Género', valor: pelicula.genero },
    { etiqueta: 'Duración', valor: pelicula.duracionMinutos ? `${pelicula.duracionMinutos} min` : null },
    { etiqueta: 'Estado', valor: pelicula.estado?.replaceAll('_', ' ') },
    { etiqueta: 'Valoración', valor: pelicula.valoracion?.replaceAll('_', ' ') },
    { etiqueta: 'Fecha de registro', valor: pelicula.fechaCreacion ? new Date(pelicula.fechaCreacion).toLocaleString('es-ES') : null },
  ];

  return (
    <div className="detalle-pelicula">
      <div className="detalle-contenido">
        {pelicula.portadaUrl && (
          <div className="detalle-imagen">
            <img src={`http://localhost:8081${pelicula.portadaUrl}`} alt={`Portada de ${pelicula.titulo}`} />
          </div>
        )}
        <div className="detalle-lista">
          {filas.map((fila) => fila.valor != null && fila.valor !== '' && (
            <div key={fila.etiqueta} className="detalle-fila">
              <span className="detalle-etiqueta">{fila.etiqueta}</span>
              <span className="detalle-valor">{fila.valor}</span>
            </div>
          ))}
        </div>
      </div>

      {pelicula.comentario && (
        <div className="detalle-comentario">
          <span className="detalle-etiqueta">Comentario</span>
          <p>{pelicula.comentario}</p>
        </div>
      )}

      <div className="detalle-acciones" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #d8d0c3', display: 'flex', gap: '10px' }}>
        <button type="button" className="btn-primario" onClick={onModificar}>
          Modificar película
        </button>
        <button type="button" className="btn-peligro" onClick={onEliminar} disabled={eliminando}>
          {eliminando ? 'Eliminando…' : 'Eliminar película'}
        </button>
      </div>
    </div>
  );
}
export default DetallePelicula;