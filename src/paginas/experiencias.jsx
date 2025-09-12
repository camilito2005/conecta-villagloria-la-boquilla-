import React from "react";

export function Experiencias() {
  return (
    <section>
      <h2 className="text-3xl font-bold text-blue-800 mb-6">Experiencias</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card de experiencia */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition">
          <img src="/canoa.jpg" alt="Canoa" className="w-full h-40 object-cover" />
          <div className="p-4">
            <h3 className="font-semibold text-lg">Paseo en Canoa</h3>
            <p className="text-sm text-gray-600 mb-3">
              Recorre los manglares con guías locales que te contarán historias de La Boquilla.
            </p>
            <button className="btn-submit bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Reservar
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
