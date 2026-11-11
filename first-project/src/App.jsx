import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Inicio from './pages/Inicio';
import Login from './pages/Login';
import Registro from './pages/Registro';

import Lectura from './pages/Lectura';
import LecturaNueva from './pages/LecturaNueva';
import LecturaDetalle from './pages/LecturaDetalle';
import LecturaEditar from './pages/LecturaEditar';

import Pelicula from './pages/Pelicula';
import PeliculaNueva from './pages/PeliculaNueva';
import PeliculaDetalle from './pages/PeliculaDetalle';
import PeliculaEditar from './pages/PeliculaEditar';

import Serie from './pages/Serie';
import SerieNueva from './pages/SerieNueva';
import SerieDetalle from './pages/SerieDetalle';
import SerieEditar from './pages/SerieEditar';

import AdminDashboard from './pages/AdminDashboard';
import AdminCatalogo from './pages/AdminCatalogo';
import AdminRegistroUsuario from './pages/AdminRegistroUsuario';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Inicio />} />
        <Route path="/inicio" element={<Inicio />} />

        <Route path="/lectura" element={<Lectura />} />
        <Route path="/lectura/nueva" element={<LecturaNueva />} />
        <Route path="/lectura/:id/editar" element={<LecturaEditar />} />
        <Route path="/lectura/:id" element={<LecturaDetalle />} />

        <Route path="/pelicula" element={<Pelicula />} />
        <Route path="/pelicula/nueva" element={<PeliculaNueva />} />
        <Route path="/pelicula/:id/editar" element={<PeliculaEditar />} />
        <Route path="/pelicula/:id" element={<PeliculaDetalle />} />

        <Route path="/serie" element={<Serie />} />
        <Route path="/serie/nueva" element={<SerieNueva />} />
        <Route path="/serie/:id/editar" element={<SerieEditar />} />
        <Route path="/serie/:id" element={<SerieDetalle />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/catalogo" element={<AdminCatalogo />} />
        <Route path="/admin/usuarios/nuevo" element={<AdminRegistroUsuario />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;