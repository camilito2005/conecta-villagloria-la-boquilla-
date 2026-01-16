import React, { useEffect, useState } from "react";
import { Getdata } from "../servicios/Apis.js";
import { Modal } from "../componentes/Modal.jsx";
import { useVerificarSesion } from "../servicios/Auth.js";
import { useNavigate } from "react-router-dom";

import "../css/TuristaReservas.css";

export function TuristaEstadoReserva() {
  const [reservas, setReservas] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [vistaActual, setVistaActual] = useState("activas"); //  Consistente

  const navigate = useNavigate();

  useVerificarSesion({ setUsuario, setModalData, navigate });

  function formatearFecha(fechaISO) {
    const [fecha] = fechaISO.split('T');
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  }

  function formatearHora(hora) {
    const [h, m] = hora.split(":");
    const fechaTemp = new Date();
    fechaTemp.setHours(h, m, 0);

    return fechaTemp.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }

  const id_turista = usuario?.id;

  const cargarReservas = async () => {
    //  Mapeo claro entre vista y endpoint
    const endpoint = vistaActual === "activas" 
      ? `reservas/activas/${id_turista}` 
      : `reservas/historial/${id_turista}`;

    const data = await Getdata(endpoint);
    
    if (data?.showModal) {
      setModalData({
        title: data.modal.title,
        message: data.modal.message,
        type: data.modal.type,
      });
    }

    setReservas(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (usuario?.id) {
      cargarReservas();
    }
  }, [usuario, vistaActual]);

  const estadoColor = (estado) => {
    if (estado === "confirmada") return "estado-confirmada";
    if (estado === "cancelada") return "estado-cancelada";
    return "estado-pendiente";
  };

  return (
    <div className="panel-turista">
      <h2>Mis Reservas</h2>

      {/* Pestañas */}
      <div className="tabs-reservas">
        <button
          className={`tab ${vistaActual === "activas" ? "tab-activa" : ""}`}
          onClick={() => setVistaActual("activas")}
        >
          Activas
        </button>
        <button
          className={`tab ${vistaActual === "historial" ? "tab-activa" : ""}`}
          onClick={() => setVistaActual("historial")}
        >
          Historial
        </button>
      </div>

      <div className="reservas-list">
        {reservas.length === 0 && (
          <p className="sin-reservas">
            {vistaActual === "activas"
              ? "No tienes reservas activas."
              : "No tienes reservas en el historial."}
          </p>
        )}

        {reservas.map((r) => (
          <div key={r.id_reserva} className="item-reserva">
            <div className="reserva-header">
              <h3 className="reserva-fecha">
                {formatearFecha(r.fecha)} - {formatearHora(r.hora)}
              </h3>
              <span className={`estado ${estadoColor(r.estado)}`}>
                {r.estado.toUpperCase()}
              </span>
            </div>

            <div className="reserva-detalles">
              <p>
                <strong>Guía:</strong> {r.nombre_guia}
              </p>
              <p>
                <strong>Precio:</strong> ${new Intl.NumberFormat("es-CO").format(r.precio)}
              </p>
            </div>
          </div>
        ))}
      </div>

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