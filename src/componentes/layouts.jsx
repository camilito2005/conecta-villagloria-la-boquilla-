
import { Link } from "react-router-dom";

import "../css/layouts.css";

export function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-sans">
      {/* Navbar */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          {/* Logo */}
          <h1 className="text-2xl font-extrabold text-blue-900 flex items-center gap-2 tracking-wide">
            <span role="img" aria-label="logo" className="text-3xl">🚤</span>
            Conecta con <span className="text-blue-600">La Boquilla</span>
          </h1>

          {/* Links */}
          <nav className="flex gap-6 items-center text-gray-700 font-medium">
            <Link to="/" className="hover:text-blue-600 transition">Inicio</Link>
            <Link to="/reservas" className="hover:text-blue-600 transition">Reservas</Link>
            <Link to="/marketplace" className="hover:text-blue-600 transition">Marketplace</Link>
            <Link to="/perfil" className="hover:text-blue-600 transition">Perfil</Link>
            <Link to="/admin" className="hover:text-blue-600 transition">Admin</Link>
            <Link to="/contacto" className="hover:underline">Contacto</Link>
            <Link 
              to="/login" 
              className="border border-blue-900 text-blue-900 px-4 py-2 rounded-lg font-semibold hover:bg-blue-900 hover:text-white transition"
            >
              Iniciar Sesión
            </Link>
          </nav>
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-6 text-center text-sm mt-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 px-6">
          <p>© 2025 ViveBoquilla — Vive la experiencia, apoya a la comunidad</p>
        </div>
      </footer>
    </div>
  );
}
