import React, { useEffect, useState } from "react";
import { Getdata, Putdata, Deletedata } from "../servicios/Apis.js";
import { Modal } from "../componentes/Modal.jsx";
import { useVerificarSesion } from "../servicios/Auth.js";
import { useNavigate } from "react-router-dom";

import "../css/Toures.css";

export function GuiaGestionHorarios() {
  const [horarios, setHorarios] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [horarioEditar, setHorarioEditar] = useState(null);

  const navigate = useNavigate();
  useVerificarSesion({ setUsuario, setModalData, navigate });

  const id_guia = usuario?.id;

  // Horas disponibles (mismas que en crear)
  const Horas = ["8:00 AM", "10:00 AM", "2:00 PM", "4:00 PM", "6:00 PM"];

  function formatearFechaInput(fechaISO) {
    const [fecha] = fechaISO.split('T');
    return fecha;
  }

  function formatearFechaDisplay(fechaISO) {
    const [fecha] = fechaISO.split('T');
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  }

  function formatearHoraDisplay(hora) {
    // Ya viene en formato "8:00 AM" desde la BD
    return hora;
  }

  const cargarHorarios = async () => {
    if (!id_guia) return;
    const data = await Getdata(`horarios/guia/${id_guia}`);
    
    if (data?.showModal) {
      setModalData({
        title: data.modal.title,
        message: data.modal.message,
        type: data.modal.type,
      });
    }
    setHorarios(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (usuario?.id) {
      cargarHorarios();
    }
  }, [usuario]);

  const abrirEditar = (horario) => {
    setHorarioEditar({
      id_horario: horario.id_horario,
      fecha: formatearFechaInput(horario.fecha),
      hora: horario.hora,
      precio: horario.precio,
      cupos_disponibles: horario.cupos_disponibles,
      disponible: horario.disponible,
    });
    setMostrarModalEditar(true);
  };

  const guardarEdicion = async () => {
    if (!horarioEditar.fecha || !horarioEditar.hora || !horarioEditar.precio || !horarioEditar.cupos_disponibles) {
      setModalData({
        title: "Error",
        message: "Todos los campos son obligatorios",
        type: "error",
      });
      return;
    }

    if (parseFloat(horarioEditar.precio) <= 0) {
      setModalData({
        title: "Error",
        message: "El precio debe ser mayor a 0",
        type: "error",
      });
      return;
    }

    if (parseInt(horarioEditar.cupos_disponibles) <= 0) {
      setModalData({
        title: "Error",
        message: "Los cupos deben ser mayor a 0",
        type: "error",
      });
      return;
    }

    const data = await Putdata(`horarios/Editar/${horarioEditar.id_horario}`, {
      fecha: horarioEditar.fecha,
      hora: horarioEditar.hora,
      precio: parseFloat(horarioEditar.precio),
      cupos_disponibles: parseInt(horarioEditar.cupos_disponibles),
      disponible: horarioEditar.disponible,
    });

    if (data?.showModal) {
      setModalData({
        title: data.modal.title,
        message: data.modal.message,
        type: data.modal.type,
      });

      if (data.modal.type === "success") {
        setMostrarModalEditar(false);
        setHorarioEditar(null);
        cargarHorarios();
      }
    }
  };
  const cambiarDisponibilidad = async (horario) => {
    const data = await Putdata(`horarios/Cambio/${horario.id_horario}`, {
      // fecha: formatearFechaInput(horario.fecha),
      // hora: horario.hora,
      // precio: horario.precio,
      // cupos_disponibles: horario.cupos_disponibles,
      disponible: !horario.disponible, // cambiar al estado opuesto
    });

    if (data?.showModal) {
      setModalData({
        title: data.modal.title,
        message: data.modal.message,
        type: data.modal.type,
      });

      if (data.modal.type === "success") {
        cargarHorarios();
      }
    }
  };

  const eliminarHorario = async (id_horario) => {
    const confirmar = window.confirm(
      "¿Estás seguro de eliminar este horario? Esta acción no se puede deshacer."
    );
    if (!confirmar) return;

    const data = await Deletedata(`horarios/Eliminar/${id_horario}`);

    if (data?.showModal) {
      setModalData({
        title: data.modal.title,
        message: data.modal.message,
        type: data.modal.type,
      });

      if (data.modal.type === "success") {
        cargarHorarios();
      }
    }
  };

  const horarioPasado = (fecha, hora) => {
    const fechaHorario = new Date(`${fecha}T${hora}`);
    return fechaHorario < new Date();
  };

  const cuposDisponibles = (horario) => {
    return horario.cupos_disponibles - (horario.reservas_activas || 0);
  };

  return (
    <div className="panel-guia-horarios">
      <div className="header-horarios">
        <h2>Mis Horarios</h2>
        <button 
          className="btn-crear-nuevo"
          onClick={() => navigate("/agg_horarios")}
        >
          + Crear Nuevo Horario
        </button>
      </div>

      <div className="horarios-lista">
        {horarios.length === 0 && (
          <p className="sin-horarios">
            No tienes horarios creados. Crea tu primer horario disponible.
          </p>
        )}

        {horarios.map((h) => {
          const pasado = horarioPasado(h.fecha, h.hora);
          const cuposLibres = cuposDisponibles(h);

          return (
            <div
              key={h.id_horario}
              className={`horario-card ${pasado ? "horario-pasado" : ""} ${!h.disponible ? "horario-pausado" : ""}`}
            >
              <div className="horario-info">
                <div className="horario-fecha-hora">
                  <span className="fecha">{formatearFechaDisplay(h.fecha)}</span>
                  <span className="hora">{formatearHoraDisplay(h.hora)}</span>
                </div>

                <div className="horario-detalles">
                  <div className="detalle-item">
                    <span className="label">Precio:</span>
                    <span className="valor">
                      ${new Intl.NumberFormat("es-CO").format(h.precio)}
                    </span>
                  </div>
                  <div className="detalle-item">
                    <span className="label">Cupos totales:</span>
                    <span className="valor">{h.cupos_disponibles}</span>
                  </div>
                  <div className="detalle-item">
                    <span className="label">Reservados:</span>
                    <span className="valor">{h.reservas_activas || 0}</span>
                  </div>
                  <div className="detalle-item">
                    <span className="label">Libres:</span>
                    <span className={`valor ${cuposLibres === 0 ? 'texto-alerta' : 'texto-success'}`}>
                      {cuposLibres}
                    </span>
                  </div>
                  <div className="detalle-item">
                    <span className="label">Estado:</span>
                    <span className={`badge ${h.disponible ? "badge-activo" : "badge-pausado"}`}>
                      {h.disponible ? "✓ Activo" : "⏸ Pausado"}
                    </span>
                  </div>
                </div>

                {pasado && <span className="badge badge-pasado">📅 Fecha pasada</span>}
                {cuposLibres === 0 && !pasado && h.disponible && (
                  <span className="badge badge-lleno">🔒 Lleno</span>
                )}
              </div>

              <div className="horario-acciones">
                <button
                  className={`btn-icono ${h.disponible ? "btn-pausar" : "btn-activar"}`}
                  onClick={() => cambiarDisponibilidad(h)}
                  disabled={pasado}
                  title={h.disponible ? "Pausar horario" : "Activar horario"}
                >
                  {h.disponible ? "⏸️" : "▶️"}
                </button>

                <button
                  className="btn-icono btn-editar"
                  onClick={() => abrirEditar(h)}
                  disabled={pasado}
                  title="Editar horario"
                >
                  ✏️
                </button>
                
                <button
                  className="btn-icono btn-eliminar"
                  onClick={() => eliminarHorario(h.id_horario)}
                  disabled={pasado || (h.reservas_activas > 0)}
                  title={
                    pasado
                      ? "No se puede eliminar un horario pasado"
                      : h.reservas_activas > 0
                      ? `No se puede eliminar (tiene ${h.reservas_activas} reserva(s))`
                      : "Eliminar horario"
                  }
                >
                  🗑️
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Edición */}
      {mostrarModalEditar && horarioEditar && (
        <div className="modal-overlay" onClick={() => {
          setMostrarModalEditar(false);
          setHorarioEditar(null);
        }}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <h3>Editar Horario</h3>

            <div className="form-group">
              <label>Fecha</label>
              <input
                type="date"
                value={horarioEditar.fecha}
                onChange={(e) =>
                  setHorarioEditar({ ...horarioEditar, fecha: e.target.value })
                }
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="form-group">
              <label>Hora</label>
              <select
                value={horarioEditar.hora}
                onChange={(e) =>
                  setHorarioEditar({ ...horarioEditar, hora: e.target.value })
                }
              >
                {Horas.map((hora, index) => (
                  <option key={index} value={hora}>{hora}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Precio (COP)</label>
              <input
                type="number"
                value={horarioEditar.precio}
                onChange={(e) =>
                  setHorarioEditar({ ...horarioEditar, precio: e.target.value })
                }
                min="1000"
                step="1000"
              />
            </div>

            <div className="form-group">
              <label>Cupos Disponibles</label>
              <input
                type="number"
                value={horarioEditar.cupos_disponibles}
                onChange={(e) =>
                  setHorarioEditar({
                    ...horarioEditar,
                    cupos_disponibles: e.target.value,
                  })
                }
                min="1"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={horarioEditar.disponible}
                  onChange={(e) =>
                    setHorarioEditar({
                      ...horarioEditar,
                      disponible: e.target.checked,
                    })
                  }
                />
                <span>Horario activo para reservas</span>
              </label>
            </div>

            <div className="modal-acciones">
              <button className="btn-guardar" onClick={guardarEdicion}>
                💾 Guardar Cambios
              </button>
              <button
                className="btn-cancelar"
                onClick={() => {
                  setMostrarModalEditar(false);
                  setHorarioEditar(null);
                }}
              >
                ✖️ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

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