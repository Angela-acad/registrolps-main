const Boton = () => {

  
  return (
    <button className="boton" type="submit">
      Agregar
    </button>
  );
};

export default Boton;




/*
function Boton() {
  const handleClick = () => {
    alert('Usted ha saludado');
  };

  return (
    <button className="boton" onClick={handleClick}>
        Salude al hacer clic
    </button>
  );
}
export default Boton;

function Boton() {
  return (
    <button className="boton" onClick={() => {alert ("Usted ha saludado")}}>
      Salude al hacer clic
    </button>
  )
}
export default Boton;



function Boton() {
  const handleClick = () => {
    alert('Hola, a ti también');
  };

  return (
    <button className="boton" onClick={handleClick}>Haga clic para saludar</button>
  );
}

export default Boton;
*/