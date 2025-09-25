import React from "react";

export function Comunidad() {
  return (
    <section>
      <h2 className="text-3xl font-bold text-blue-800 mb-6">Panel Comunidad</h2>
      <p className="text-gray-600 mb-4">
        Espacio para que guías, pescadores y artesanos registren sus servicios y productos directamente.
      </p>
      <button className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition">
        ➕ Agregar nuevo servicio
      </button>
    </section>
  );
}
