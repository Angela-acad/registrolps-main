function TarjetaLectura({ lectura, onClick }) {
  return (
    <button type="button" className="tarjeta-lectura" onClick={() => onClick(lectura.id)}>
      <div className="tarjeta-cabecera">
        <h3>{lectura.titulo}</h3>
        <span className="tarjeta-estado">{lectura.estado}</span>
      </div>

      <div className="tarjeta-meta">
        {lectura.autor && <span>Autor: {lectura.autor}</span>}
        {lectura.tipo && <span>Tipo: {lectura.tipo}</span>}
        {lectura.valoracion && <span>Valoración: {lectura.valoracion}</span>}
      </div>

      {lectura.comentario && (
        <p className="tarjeta-comentario">{lectura.comentario}</p>
      )}

      <span className="tarjeta-accion">Ver detalle →</span>
    </button>
  );
}

export default TarjetaLectura;