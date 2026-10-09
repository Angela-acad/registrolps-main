function DetalleSerie({ serie }) {
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
      <div className="detalle-lista">
        {filas.map((fila) => fila.valor != null && fila.valor !== '' && (
          <div key={fila.etiqueta} className="detalle-fila">
            <span className="detalle-etiqueta">{fila.etiqueta}</span>
            <span className="detalle-valor">{fila.valor}</span>
          </div>
        ))}
      </div>
      {serie.comentario && <div className="detalle-comentario"><span className="detalle-etiqueta">Comentario</span><p>{serie.comentario}</p></div>}
    </div>
  );
}

export default DetalleSerie;