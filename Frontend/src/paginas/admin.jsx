import React from "react";
import { Link } from "react-router-dom";

import "../css/admin.css";

export function Admin() {
  return (
    <section className="max-w-5xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-blue-800 text-center mb-6">
        Panel Administrador
      </h2>
      <p className="text-gray-600 text-center mb-8">
        Gestiona usuarios, reservas, estadísticas y mantén el control del
        sistema.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <Link to="/usuarios" className="hover:text-blue-600 transition">
          <div className="bg-white shadow rounded-xl p-6 text-center hover:shadow-lg transition cursor-pointer">
            <h3 className="font-semibold text-lg text-blue-700">Usuarios</h3>
            <p className="text-gray-600">Gestión de registros</p>
          </div>
        </Link>

        <Link to="/artesanias" className="hover:text-blue-600 transition">
          <div className="bg-white shadow rounded-xl p-6 text-center hover:shadow-lg transition cursor-pointer">
            <h3 className="font-semibold text-lg text-blue-700">Artesanias</h3>
            <p className="text-gray-600">Gestion de artesanias</p>
          </div>
        </Link>
        <Link to="/reservas" className="hover:text-blue-600 transition">
          <div className="bg-white shadow rounded-xl p-6 text-center hover:shadow-lg transition cursor-pointer">
            <h3 className="font-semibold text-lg text-blue-700">Reservas</h3>
            <p className="text-gray-600">Control de experiencias</p>
          </div>
        </Link>

        <Link to="/estadisticas" className="hover:text-blue-600 transition">
          <div className="bg-white shadow rounded-xl p-6 text-center hover:shadow-lg transition cursor-pointer">
            <h3 className="font-semibold text-lg text-blue-700">
              Estadísticas
            </h3>
            <p className="text-gray-600">Reportes y métricas</p>
          </div>
        </Link>

        <Link to="/configuracion" className="hover:text-blue-600 transition">
          <div className="bg-white shadow rounded-xl p-6 text-center hover:shadow-lg transition cursor-pointer">
            <h3 className="font-semibold text-lg text-blue-700">
              Configuración
            </h3>
            <p className="text-gray-600">Ajustes generales</p>
          </div>
        </Link>
      </div>
    </section>
  );
}
