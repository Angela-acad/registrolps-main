function BarraBusqueda({ campo, valor, onCampoChange, onValorChange, onBuscar, onLimpiar }) {
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
          <option value="titulo">Título</option>
          <option value="estado">Estado</option>
          <option value="valoracion">Valoración</option>
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
