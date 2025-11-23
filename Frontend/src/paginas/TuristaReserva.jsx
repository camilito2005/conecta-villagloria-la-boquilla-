import React, { useEffect, useState } from "react";
import { Getdata } from "../servicios/Apis.js";
import "../css/TuristaReservas.css";

export function TuristaEstadoReserva() {
  const [reservas, setReservas] = useState([]);

  const cargarReservas = async () => {
    const data = await Getdata("reservas/estado_turista");
    setReservas(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const estadoColor = (estado) => {
    if (estado === "confirmada") return "estado-confirmada";
    if (estado === "cancelada") return "estado-cancelada";
    return "estado-pendiente";
  };

  return (
    <div className="panel-turista">
      <h2>Mis Reservas</h2>

      <div className="reservas-list">
        {reservas.length === 0 && <p>No tienes reservas.</p>}

        {reservas.map((r) => (
          <div key={r.id_reserva} className="item-reserva">
            <h3>{r.fecha} - {r.hora}</h3>

            <span className={`estado ${estadoColor(r.estado)}`}>
              {r.estado.toUpperCase()}
            </span>

            <p><strong>Guía:</strong> {r.nombre_guia}</p>
            <p><strong>Precio:</strong> ${r.precio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
