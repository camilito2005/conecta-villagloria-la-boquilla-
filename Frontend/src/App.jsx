import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./componentes/layouts.jsx";
import { Inicio } from "./paginas/inicio.jsx";
import { Admin } from "./paginas/admin.jsx";
import { Reservas } from "./paginas/reservas.jsx";
import { Marketplace } from "./paginas/catalogo.jsx";
import { Perfil } from "./paginas/perfil.jsx";
import { Registro } from "./paginas/registro.jsx";
import { Login } from "./paginas/login.jsx";
import { Contactanos } from "./paginas/contactanos.jsx";
import { Usuarios } from "./paginas/Usuarios.jsx";
import "./App.css";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/contacto" element={<Contactanos />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/usuarios" element={<Usuarios />} />
          
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
