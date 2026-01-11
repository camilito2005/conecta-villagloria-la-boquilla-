import React, { useEffect, useState } from "react";
import { Getdata, Putdata } from "../servicios/Apis.js";
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

  // Formatear fecha para mostrar
  function formatearFecha(fechaISO) {
    const [fecha] = fechaISO.split('T');
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  }

  // Formatear hora para mostrar
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

  const cargarReservas = async () => {
    if (!id_guia) return;

    const data = await Getdata(`reservas/pendientes_guia/${id_guia}`);

    // ✅ CORRECCIÓN: Acceder a data.reservas
    if (data?.reservas) {
      setReservas(Array.isArray(data.reservas) ? data.reservas : []);
    } else if (Array.isArray(data)) {
      // Por si acaso el backend cambia y devuelve array directo
      setReservas(data);
    } else {
      setReservas([]);
    }

    if (data?.showModal) {
      setModalData({
        title: data.modal.title,
        message: data.modal.message,
        type: data.modal.type,
      });
    }
  };

  useEffect(() => {
    if (usuario?.id) {
      cargarReservas();
    }
  }, [usuario]);

  const actualizarEstado = async (id_reserva, id_horario, nuevoEstado) => {
    const res = await Putdata(`reservas/actualizar_estado/${id_reserva}`, {
      estado: nuevoEstado,
      id_horario,
    });
    

    if (res?.showModal) {
      setModalData({
        title: res.modal.title,
        message: res.modal.message,
        type: res.modal.type,
      });
    }

    // Recargar reservas después de actualizar
    if (res) {
      cargarReservas();
    }
  };

  return (
    <div className="panel">
      <h2>Reservas Pendientes</h2>

      <div className="reservas-grid">
        {reservas.length === 0 && (
          <p className="sin-reservas">No hay reservas pendientes.</p>
        )}

        {reservas.map((r) => (
          <div key={r.id_horario} className="reserva-card">
            <div className="reserva-header">
              <h3>{formatearFecha(r.fecha)}</h3>
              <span className={`badge badge-${r.estado}`}>
                {r.estado}
              </span>
            </div>

            <div className="reserva-detalles">
              <div className="detalle-grupo">
                <p>
                  <strong>🕐 Hora:</strong> {formatearHora(r.hora)}
                </p>
                <p>
                  <strong>💰 Precio:</strong> $
                  {new Intl.NumberFormat("es-CO").format(r.precio)}
                </p>
              </div>

              <div className="detalle-grupo">
                <p>
                  <strong>👤 Turista:</strong> {r.nombre_turista}
                </p>
                <p>
                  <strong>📧 Correo:</strong> {r.correo_turista || r.email_turista}
                </p>
                <p>
                  <strong>📱 Teléfono:</strong> {r.telefono_turista}
                </p>
              </div>

              {r.comentarios && (
                <div className="detalle-grupo">
                  <p>
                    <strong>💬 Comentarios:</strong> {r.comentarios}
                  </p>
                </div>
              )}

              <div className="detalle-grupo">
                <p className="fecha-creacion"> 
                  <strong>📅 Reservado el:</strong>{" "}
                  {new Date(r.fecha_creacion).toLocaleString("es-CO")}
                </p>
              </div>
            </div>

            <div className="acciones">
              <button
                className="btn-confirmar"
                onClick={() => actualizarEstado(r.id_reserva, r.id_horario, "confirmada")}
                disabled={r.estado !== "pendiente"}
              >
                ✓ Confirmar
              </button>
              <button
                className="btn-cancelar"
                onClick={() => actualizarEstado(r.id_reserva, r.id_horario, "cancelada")}
                disabled={r.estado !== "pendiente"}
              >
                ✗ Cancelar
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