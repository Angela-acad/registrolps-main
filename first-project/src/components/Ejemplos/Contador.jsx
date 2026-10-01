import { useState } from "react";

function Contador() {
  const [cantidad, contador] = useState(0);

  const handleClick = () => {
  contador(cantidad + 1);
  };

  return (
    <div>
      <button className="boton" onClick={handleClick}>Haz clic aquí</button>
      <p>Has presionado el botón {cantidad} veces.</p>
    </div>
  );
}

export default Contador;
