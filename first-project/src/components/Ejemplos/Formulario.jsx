import { useState } from "react";

function Formulario() {
    
    const [values, setValues] = useState ({
        titulo: '',
        tipo: '',
        estado: ''   
    })

    const [errors, setErrors] = useState({});

    const handleChanges = (e) => {
        setValues({...values, [e.target.name]:e.target.value})
        
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    }

    const validate = (values) => {
        const errors = {};
        
        if (!values.titulo) {
            errors.titulo = "El titulo es obligatorio";
        }

        if (!values.tipo) {
            errors.tipo = "El tipo es obligatorio";
        }

        if (!values.estado) {
            errors.estado = "El estado es obligatorio";
        }
        
        return errors;
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        
        const validationErrors = validate(values);
        
        setErrors(validationErrors);
        
        if (Object.keys(validationErrors).length === 0) {
            console.log("Datos enviados:", values);
            alert("Formulario enviado correctamente");
        }
    }
    
    return (
    <div>
        <h1 className="titulo">Formulario</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="titulo"> Titulo: </label>
            <input id="titulo" name="titulo" placeholder="Ingrese el titulo de su lectura" type="text" 
            onChange={(e) => handleChanges(e)} value={values.titulo}/>
           
            {errors.titulo && <p>{errors.titulo}</p>}
            
            <label htmlFor="tipo"> Tipo: </label>
            <select id="tipo" name="tipo" onChange={(e) => handleChanges(e)} value={values.tipo}>
                <option value="" disabled>Seleccione un género</option>
                <option value="Novela"> Novela </option>
                <option value="Libro"> Libro </option>
                <option value="Manga"> Manga </option>
                <option value="Manhwa"> Manhwa </option>
                <option value="Manhua"> Manhua </option>
            </select>
            {errors.tipo && <p>{errors.tipo}</p>}
            
            <label> Estado: </label>
            <div className="contenedorRadio">
                <input type="radio" value="Pendiente" name="estado" 
                onChange={(e) => handleChanges(e)} checked={values.estado === "Pendiente"}/> Pendiente
                <input type="radio" value="Proceso" name="estado" 
                onChange={(e) => handleChanges(e)} checked={values.estado === "Proceso"}/> Proceso
                <input type="radio" value="Finalizado" name="estado" 
                onChange={(e) => handleChanges(e)} checked={values.estado === "Finalizado"}/> Finalizado
                <input type="radio" value="Abandonado" name="estado" 
                onChange={(e) => handleChanges(e)} checked={values.estado === "Abandonado"}/> Abandonado
            </div>
            {errors.estado && <p>{errors.estado}</p>}

            <div className="contenedorBoton">
                <button type="submit"> Enviar </button>
            </div>  
        </form>
    </div>
  );
};
export default Formulario;

