function BarraBusqueda({ campo, valor, onCampoChange, onValorChange, onBuscar, onLimpiar, opcionesCampo }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onBuscar();
  };

  // Definimos las opciones para los desplegables de Estado y Valoración
  const opcionesEstado = [
    { valor: 'Pendiente', etiqueta: 'Pendiente' },
    { valor: 'En_proceso', etiqueta: 'En proceso' },
    { valor: 'Finalizado', etiqueta: 'Finalizado' },
    { valor: 'Abandonado', etiqueta: 'Abandonado' },
  ];

  const opcionesValoracion = [
    { valor: 'Muy_malo', etiqueta: 'Muy malo' },
    { valor: 'Malo', etiqueta: 'Malo' },
    { valor: 'Regular', etiqueta: 'Regular' },
    { valor: 'Bueno', etiqueta: 'Bueno' },
    { valor: 'Excelente', etiqueta: 'Excelente' },
  ];

  // Determinamos qué opciones usar según el campo seleccionado
  let opcionesSelect = [];
  if (campo === 'estado') opcionesSelect = opcionesEstado;
  if (campo === 'valoracion') opcionesSelect = opcionesValoracion;

  return (
    <form className="barra-busqueda" onSubmit={handleSubmit}>
      <p className="panel-kicker">Búsqueda</p>

      <div className="busqueda-fila">
        {/* SELECTOR DE CAMPO (Título, Estado, Valoración...) */}
        <select
          className="busqueda-select"
          value={campo}
          onChange={(e) => {
            onCampoChange(e.target.value);
            onValorChange(''); // Limpiamos el valor al cambiar de campo
          }}
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

        {/* INPUT DINÁMICO: Si es estado/valoración muestra un select, si no, un input de texto */}
        {campo === 'estado' || campo === 'valoracion' ? (
          <select
            className="busqueda-input" // Usamos la misma clase para mantener el estilo
            value={valor}
            onChange={(e) => onValorChange(e.target.value)}
          >
            <option value="">Selecciona una opción...</option>
            {opcionesSelect.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.etiqueta}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            className="busqueda-input"
            placeholder="Escribe tu búsqueda…"
            value={valor}
            onChange={(e) => onValorChange(e.target.value)}
          />
        )}

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
