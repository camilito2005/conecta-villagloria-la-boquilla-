import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Postdata } from "../servicios/Apis.js";
import { Modal } from "../componentes/Modal.jsx";
import { useNavigate } from "react-router-dom";

import "../css/layouts.css";

export function Layout({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [modalData, setModalData] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarSesion = async () => {
      const result = await Postdata("usuarios/verificar", { enviarJson: true });

      if (result?.usuario) {
        setUsuario(result.usuario);
      } else {
        setUsuario(null);
      }
       setLoading(false);
    };  // Escucha los cambios de sesión

    // 🔹 Verificamos la sesión al montar el componente
  verificarSesion();

    const actualizarSesion = () => {
      verificarSesion();
    };

    window.addEventListener("sesion-cambio", actualizarSesion);

    return () => {
      window.removeEventListener("sesion-cambio", actualizarSesion);
    };
  }, []);
  
  if (loading) return <div>Cargando...</div>;

  const cerrarSesion = async () => {
    const resultado = await Postdata("usuarios/logout", {});
    if (resultado.showModal) {
      localStorage.removeItem("sesionActiva"); // elimina marca de sesión
      window.dispatchEvent(new Event("sesion-cambio")); // 🔔 notifica cambio
      setModalData(resultado.modal);
      setTimeout(() => navigate("/login"), 2000);
    }
  };
  // Mensaje de bienvenida
  const Bienvenida = usuario ? `Hola, ${usuario.nombre.split(" ")[0]}` : "";


  const esTurista = usuario?.rol === 1;
  const esGuia = usuario?.rol === 2;
  const esArtesano = usuario?.rol === 3;
  const esAdmin = usuario?.rol === 4;
  const esRestaurantero = usuario?.rol === 5;
  const esSuperadmin = usuario?.rol === 13;
 

  // Estado de sesión Si hay usuario, hay sesión.
  const haySesion = !!usuario;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-extrabold text-blue-900 flex items-center gap-2 tracking-wide">
            <span role="img" aria-label="logo" className="text-3xl">
              {Bienvenida} 🚤
            </span>
            Conecta con <span className="text-blue-600">La Boquilla</span>
          </h1>

          <nav className="flex gap-6 items-center text-gray-700 font-medium">
            <Link to="/" className="hover:text-blue-600 transition">
              Inicio
            </Link>

            {haySesion && (
              <>
              {esGuia && (
                <>
                <Link to="/usuarios/Toures" className="hover:text-blue-600 transition">
                    Toures
                  </Link>

                  <Link to="/usuarios/tours" className="hover:text-blue-600 transition">
                    Mis tours
                  </Link>

                  <Link to="/agg_horarios" className="hover:text-blue-600 transition">
                    Horarios disponibles
                  </Link>
                </>
            )}
            {esTurista && (
             <> 
              <Link to="/usuarios/mis_reservas" className="hover:text-blue-600 transition">
                Mis reservas
              </Link>
            
                <Link to="/reservas" className="hover:text-blue-600 transition">
                  Reservar
                </Link>
                
                </>
                )}
                {esTurista || esAdmin || esArtesano && (
                <Link
                  to="/marketplace"
                  className="hover:text-blue-600 transition"
                >
                  Marketplace
                </Link>
                )}

                <Link to="/perfil" className="hover:text-blue-600 transition">
                  Perfil
                </Link>
                {esAdmin || esSuperadmin  && (
                  <Link to="/admin" className="hover:text-blue-600 transition">
                    Admin
                  </Link>
                )}
                <button
                  onClick={cerrarSesion}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Cerrar Sesión
                </button>
              </>
            )}

            {!haySesion && (
              <>
              <Link
                to="/registro"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Registrar
              </Link>
              
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Iniciar Sesión
              </Link>
              </>
              
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-blue-900 text-white py-6 text-center text-sm mt-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 px-6">
          <p>© 2025 ViveBoquilla — Vive la experiencia, apoya a la comunidad</p>
        </div>
      </footer>

      {modalData && (
        <Modal
          title={modalData.title}
          message={modalData.message}
          type={modalData.type}
          onClose={() => setModalData(null)}
        />
      )}
    </div>
  );
}
