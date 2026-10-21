function DetalleLectura({ lectura, onEliminar, onModificar, eliminando }) {
  if (!lectura) return null;

  const filas = [
    { etiqueta: 'Título', valor: lectura.titulo },
    { etiqueta: 'Autor', valor: lectura.autor },
    { etiqueta: 'Tipo', valor: lectura.tipo },
    { etiqueta: 'Estado', valor: lectura.estado?.replaceAll('_', ' ') },
    { etiqueta: 'Valoración', valor: lectura.valoracion?.replaceAll('_', ' ') },
    { etiqueta: 'Nº volúmenes', valor: lectura.numeroVolumenes },
    { etiqueta: 'Nº capítulos', valor: lectura.numeroCapitulos },
    { etiqueta: 'Fecha de registro', valor: lectura.fechaCreacion ? new Date(lectura.fechaCreacion).toLocaleString('es-ES') : null },
  ];

  return (
    <div className="detalle-lectura">
      <div className="detalle-contenido">
        {lectura.portadaUrl && (
          <div className="detalle-imagen">
            <img src={`http://localhost:8081${lectura.portadaUrl}`} alt={`Portada de ${lectura.titulo}`} />
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

      {lectura.comentario && (
        <div className="detalle-comentario">
          <span className="detalle-etiqueta">Comentario</span>
          <p>{lectura.comentario}</p>
        </div>
      )}

      <div className="detalle-acciones" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #d8d0c3', display: 'flex', gap: '10px' }}>
        <button type="button" className="btn-primario" onClick={onModificar}>
          Modificar lectura
        </button>
        <button type="button" className="btn-peligro" onClick={onEliminar} disabled={eliminando}>
          {eliminando ? 'Eliminando…' : 'Eliminar lectura'}
        </button>
      </div>
    </div>
  );
}
export default DetalleLectura;