import { useState } from "react";
const FormEjemplo = () =>{
    const [values, setValues] = useState({
        edad:'',
        correo: '',
        contraseña: ''
    })
    const handleChange = (e) =>{
        setValues({...values, [e.target.value]:values})
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(values) 
    }
    return(
        <form onSubmit={handleSubmit}>
            <label>Edad: </label>
            <input type="number" name="edad" onChange={(e) => {handleChange (e)}}/>

            <label>Correo: </label>
            <input type="email" name="correo" onChange={(e) => {handleChange (e)}}/>

            <label>Contraseña: </label>
            <input type="password" name="contraseña" onChange={(e) => {handleChange (e)}}/>

            <button type="submit">
                Enviar
            </button>
        </form>
    )
}
export default FormEjemplo;
