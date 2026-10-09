function BarraBusqueda({ campo, valor, onCampoChange, onValorChange, onBuscar, onLimpiar, opcionesCampo }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onBuscar();
  };

  return (
    <form className="barra-busqueda" onSubmit={handleSubmit}>
      <p className="panel-kicker">Búsqueda</p>

      <div className="busqueda-fila">
        <select
          className="busqueda-select"
          value={campo}
          onChange={(e) => onCampoChange(e.target.value)}
          aria-label="Campo de búsqueda"
        >
          {(opcionesCampo ?? [
            { valor: 'titulo', etiqueta: 'Título' },
            { valor: 'estado', etiqueta: 'Estado' },
            { valor: 'valoracion', etiqueta: 'Valoración' },
          ]).map((opcion) => (
            <option key={opcion.valor} value={opcion.valor}>{opcion.etiqueta}</option>
          ))}
        </select>

        <input
          type="text"
          className="busqueda-input"
          placeholder="Escribe tu búsqueda…"
          value={valor}
          onChange={(e) => onValorChange(e.target.value)}
        />

        <button type="submit" className="btn-buscar">
          Buscar
        </button>

        <button type="button" className="btn-limpiar" onClick={onLimpiar}>
          Limpiar
        </button>
      </div>
    </form>
  );
}

export default BarraBusqueda;
