import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Lectura from './pages/Lectura';
import LecturaNueva from './pages/LecturaNueva';
import LecturaDetalle from './pages/LecturaDetalle';
import LecturaEditar from './pages/LecturaEditar';
import Login from './pages/Login';
import Registro from './pages/Registro';

// --- IMPORTS DE PELÍCULA ---
import Pelicula from './pages/Pelicula';
import PeliculaNueva from './pages/PeliculaNueva';
import PeliculaDetalle from './pages/PeliculaDetalle';
import PeliculaEditar from './pages/PeliculaEditar';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Inicio />} />
        <Route path="/inicio" element={<Inicio />} />

        {/* LECTURA */}
        <Route path="/lectura" element={<Lectura />} />
        <Route path="/lectura/nueva" element={<LecturaNueva />} />
        <Route path="/lectura/:id/editar" element={<LecturaEditar />} />
        <Route path="/lectura/:id" element={<LecturaDetalle />} />

        {/* PELÍCULA (las 4 rutas reales) */}
        <Route path="/pelicula" element={<Pelicula />} />
        <Route path="/pelicula/nueva" element={<PeliculaNueva />} />
        <Route path="/pelicula/:id/editar" element={<PeliculaEditar />} />
        <Route path="/pelicula/:id" element={<PeliculaDetalle />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;



/*
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Inicio from './components/Inicio';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
*/