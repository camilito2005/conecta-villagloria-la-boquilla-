import React from "react";

export function Artesanias() {
  return (
    <section>
      <h2 className="text-3xl font-bold text-blue-800 mb-6">Artesanías</h2>
      <p className="text-gray-600 mb-6">
        Apoya a los artesanos locales comprando productos hechos a mano.  
        Cada compra impulsa el crecimiento económico de la comunidad.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {/* Producto */}
        <div className="bg-white shadow rounded-xl p-4 text-center hover:shadow-lg transition">
          <img src="/sombrero.jpg" alt="Sombrero" className="w-full h-32 object-cover rounded mb-3" />
          <h3 className="font-medium">Sombrero de Palma</h3>
          <p className="text-sm text-gray-500">$35.000 COP</p>
        </div>
      </div>
    </section>
  );
}
