import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./componentes/layouts.jsx";
import { Inicio } from "./paginas/inicio.jsx";
import { Admin } from "./paginas/admin.jsx";
import { ToursDisponibles } from "./paginas/reservas.jsx";
import { Catalogo } from "./paginas/catalogo.jsx";
import { Perfil } from "./paginas/perfil.jsx";
import { AdminUsuarioPerfil } from "./paginas/AdminUsuarioPerfil.jsx";
import { Registro } from "./paginas/registro.jsx";
import { Login } from "./paginas/login.jsx";
import { Contactanos } from "./paginas/contactanos.jsx";
import { Usuarios } from "./paginas/Usuarios.jsx";
import { Agg_horarios } from "./paginas/Horarios.jsx";
import { AdminUsuariosInactivos } from "./paginas/AdminUsuariosInactivos.jsx";
import { GuiaReservasPendientes } from "./paginas/GuiaReservas.jsx";
import { TuristaEstadoReserva } from "./paginas/TuristaReserva.jsx";
import { GuiaGestionHorarios } from "./paginas/Toures.jsx";
import { Roles } from "./paginas/Roles.jsx";
import { GestionCategorias } from "./paginas/CategoriasySub.jsx";
import { GestionProductos } from "./paginas/Productos.jsx";
import { GestionNegocios } from "./paginas/Negocios.jsx";
import { CarritoProvider } from "./globales/CarritoContext.jsx";

import "./App.css";

function App() {
  return (
    < CarritoProvider >
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/reservas" element={<ToursDisponibles />} />
          <Route path="/marketplace" element={<Catalogo />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/admin_usuario_perfil/:usuarioId" element={<AdminUsuarioPerfil />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/contacto" element={<Contactanos />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/agg_horarios" element={<Agg_horarios />} />
          <Route path="/usuarios/inactivos" element={<AdminUsuariosInactivos />} />
          <Route path="/usuarios/tours" element={<GuiaReservasPendientes />} />
          <Route path="/usuarios/Roles" element={<Roles />} />
          <Route path="/usuarios/mis_reservas" element={<TuristaEstadoReserva />} />
          <Route path="/usuarios/Toures" element={<GuiaGestionHorarios />} />
          <Route path="/usuarios/categorias" element={<GestionCategorias />} />
          <Route path="/Productos" element={<GestionProductos />} />
          <Route path="/Negocios" element={<GestionNegocios />} />

        </Routes>
      </Layout>
    </Router>
    </CarritoProvider >
  );
}

export default App;
