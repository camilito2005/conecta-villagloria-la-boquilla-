import React, { useEffect, useState } from "react";
import { Getdata, Putdata, Postdata } from "../servicios/Apis.js";
import { Modal } from "../componentes/Modal.jsx";
import { useVerificarSesion } from "../servicios/Auth.js";
import { useNavigate } from "react-router-dom";

import "../css/ReservasGuias.css";

export function GuiaReservasPendientes() {
  const [reservas, setReservas] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [usuario, setUsuario] = useState(null);

  const navigate = useNavigate();

  useVerificarSesion({ setUsuario, setModalData, navigate });
  const id_guia = usuario?.id;

  const cargarReservas = async () => {
    const data = await Getdata(`reservas/pendientes_guia/${id_guia}`);
    const formateados = data.reservas.map((r) => ({
      ...r,
      fecha_horario: r.fecha_horario.split("T")[0],
    }));
    setReservas(Array.isArray(formateados) ? formateados : []);
  };

  useEffect(() => {
    if (usuario?.id) cargarReservas();
  }, [usuario]);

  const actualizarEstado = async (id_reserva,id_horario, nuevoEstado) => {

    const res = await Putdata(`reservas/actualizar_estado/${id_reserva}`, {
      estado: nuevoEstado,
      id_horario,
    });
    console.log("respuesta del servidor", res);
    if (res.showModal) {
      setModalData({
        title: res.modal.title,
        message: res.modal.message,
        type: res.modal.type,
      });
    }

    if (res) cargarReservas();
  };

  return (
    <div className="panel">
      <h2>Reservas Pendientes</h2>

      <div className="reservas-grid">
        {reservas.length === 0 && <p>No hay reservas pendientes.</p>}

        {reservas.map((r) => (
          <div key={r.id_reserva} className="reserva-card">
            <h3>{r.fecha_horario}</h3>
            <p>
              <strong>Hora:</strong> {r.hora_horario}
            </p>
            <p>
              <strong>Precio:</strong> $
              {new Intl.NumberFormat("es-CO").format(r.precio_horario)}
            </p>
            <p>
              <strong>Turista:</strong> {r.nombre_turista}
            </p>
            <p>
              <strong>Correo:</strong> {r.email_turista}
            </p>
            <p>
              <strong>Teléfono:</strong> {r.telefono_turista}
            </p>
            <p>
              <strong>Comentarios:</strong> {r.comentarios || "Sin comentarios"}
            </p>
            {/* <p>
              <strong>Id del horario :</strong> {r.id_horario || "Sin comentarios"}
            </p> */}
            <p >
              <strong>Estado:</strong> {r.estado}
            </p>
            <p>
              <strong>Fecha creación:</strong>{" "}
              {new Date(r.fecha_creacion).toLocaleString()}
            </p>

            <div className="acciones">
              <button
                className="btn-confirmar"
                onClick={() => actualizarEstado(r.id_reserva,r.id_horario, "confirmada")}
              >
                Confirmar
              </button>
              <button
                className="btn-cancelar"
                onClick={() => actualizarEstado(r.id_reserva,r.id_horario, "cancelada")}
              >
                Cancelar
              </button>
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
