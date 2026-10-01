//Funcion Flecha Componente

const ReactComponente = (props) => {
  const mensaje = `Hola ${props.nombre}`;
  const precioConIVA = props.precio * 1.19;

  return (
    <div>
      <h2 className="titulo">{mensaje}</h2>
      <p>Precio: {precioConIVA}</p>
    </div>
  );
};

export default ReactComponente