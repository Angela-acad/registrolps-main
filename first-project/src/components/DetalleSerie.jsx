function DetalleSerie({ serie, onEliminar, eliminando }) {
  if (!serie) return null;

  const filas = [
    { etiqueta: 'Título', valor: serie.titulo },
    { etiqueta: 'Actor principal', valor: serie.actorPrincipal },
    { etiqueta: 'Género', valor: serie.genero },
    { etiqueta: 'Capítulos', valor: serie.numeroCapitulos },
    { etiqueta: 'Estado', valor: serie.estado?.replaceAll('_', ' ') },
    { etiqueta: 'Valoración', valor: serie.valoracion?.replaceAll('_', ' ') },
    { etiqueta: 'Fecha de registro', valor: serie.fechaCreacion ? new Date(serie.fechaCreacion).toLocaleString('es-ES') : null },
  ];

  return (
    <div className="detalle-serie">
      
      {/* NUEVO CONTENEDOR FLEX PARA IMAGEN + DATOS */}
      <div className="detalle-contenido">
        
        {/* IMAGEN A LA IZQUIERDA */}
        {serie.portadaUrl && (
          <div className="detalle-imagen">
            <img 
              src={`http://localhost:8081${serie.portadaUrl}`} 
              alt={`Portada de ${serie.titulo}`} 
            />
          </div>
        )}

        {/* DATOS A LA DERECHA */}
        <div className="detalle-lista">
          {filas.map((fila) => fila.valor != null && fila.valor !== '' && (
            <div key={fila.etiqueta} className="detalle-fila">
              <span className="detalle-etiqueta">{fila.etiqueta}</span>
              <span className="detalle-valor">{fila.valor}</span>
            </div>
          ))}
        </div>
        
      </div>

      {/* COMENTARIO */}
      {serie.comentario && (
        <div className="detalle-comentario">
          <span className="detalle-etiqueta">Comentario</span>
          <p>{serie.comentario}</p>
        </div>
      )}

      {/* BOTONES DE ACCIÓN */}
      <div className="detalle-acciones" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #d8d0c3', display: 'flex', gap: '10px' }}>
        <button 
          type="button" 
          className="btn-primario" 
          onClick={() => window.location.href = `/serie/${serie.id}/editar`}
        >
          Modificar serie
        </button>
        <button 
          type="button" 
          className="btn-peligro" 
          onClick={() => onEliminar(serie.id)}
          disabled={eliminando}
        >
          {eliminando ? 'Eliminando…' : 'Eliminar serie'}
        </button>
      </div>
    </div>
  );
}

export default DetalleSerie;