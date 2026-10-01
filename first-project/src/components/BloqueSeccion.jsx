function BloqueSeccion({ titulo, descripcion, onClick, variante }) {
  return (
    <button
      type="button"
      className={`bloque-seccion bloque-${variante}`}
      onClick={onClick}
    >
      <span className="bloque-kicker">Sección</span>
      <h2>{titulo}</h2>
      <p>{descripcion}</p>
      <span className="bloque-accion">Entrar →</span>
    </button>
  );
}

export default BloqueSeccion;