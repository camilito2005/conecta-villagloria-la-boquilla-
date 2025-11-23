import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./componentes/layouts.jsx";
import { Inicio } from "./paginas/inicio.jsx";
import { Admin } from "./paginas/admin.jsx";
import { ToursDisponibles } from "./paginas/reservas.jsx";
import { Marketplace } from "./paginas/catalogo.jsx";
import { Perfil } from "./paginas/perfil.jsx";
import {AdminUsuarioPerfil} from "./paginas/AdminUsuarioPerfil.jsx";
import { Registro } from "./paginas/registro.jsx";
import { Login } from "./paginas/login.jsx";
import { Contactanos } from "./paginas/contactanos.jsx";
import { Usuarios } from "./paginas/Usuarios.jsx";
import { Tablas } from "./paginas/tablas.jsx";
import { Agg_horarios } from "./paginas/Horarios.jsx";
import {AdminUsuariosInactivos} from "./paginas/AdminUsuariosInactivos.jsx";
import {GuiaReservasPendientes} from "./paginas/GuiaReservas.jsx";
import {TuristaEstadoReserva} from "./paginas/TuristaReserva.jsx";

import "./App.css";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/reservas" element={<ToursDisponibles />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/admin_usuario_perfil/:usuarioId" element={<AdminUsuarioPerfil />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/contacto" element={<Contactanos />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/ejercicio" element={<Tablas />} />
          <Route path="/agg_horarios" element={<Agg_horarios />} />
          <Route path="/usuarios/inactivos" element={<AdminUsuariosInactivos />} />
          <Route path="/usuarios/tours" element={<GuiaReservasPendientes />} />
          <Route path="/usuarios/mis_reservas" element={<TuristaEstadoReserva />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
