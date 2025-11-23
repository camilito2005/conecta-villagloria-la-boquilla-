import React, { useEffect, useState } from "react";
import { Modal } from "../componentes/Modal.jsx";
import { useVerificarSesion } from "../servicios/Auth.js";
import { Getdata, Postdata } from "../servicios/Apis.js";
import { useNavigate } from "react-router-dom";
import "../css/tours.css";

export function ToursDisponibles() {
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [selectedHorario, setSelectedHorario] = useState("");

  const [modalData, setModalData] = useState(null);
  const [usuario, setUsuario] = useState(null);
  
  const navigate = useNavigate();

  useVerificarSesion({ setUsuario, setModalData, navigate });
  const id_turista = usuario?.id;

  useEffect(() => {
    const cargarHorarios = async () => {
      try {
        const data = await Getdata("horarios/listar_horarios");
        

        // console.log("Tours y horarios obtenidos:", data);

        if (Array.isArray(data)) {
          // Convertir fecha ISO a formato YYYY-MM-DD
          const formateados = data.map((t) => ({
            ...t,
            fecha: t.fecha.split("T")[0],
          }));
          // console.log("Tours formateados:", formateados);

          setTours(formateados);
        } else {
          setTours([]);
        }
      } catch (error) {
        console.error("Error al obtener los tours:", error);
        setTours([]);
      }
    };

    cargarHorarios();
  }, []);

  const reservar = async () => {
    if (!selectedTour || !selectedHorario) {
      alert("Selecciona un tour y un horario.");
      return;
    }

    const reserva = {
      id_horario: selectedHorario,
      id_guia: selectedTour.id_guia,
      id_turista
    };

    const res = await Postdata(`reservas/crear_reserva`, reserva);
    // console.log("Respuesta reserva:", res);
    if (res.showModal) {
      setModalData(res.modal);
    }
  };

  // fechas formateadas: 

  return (
    <div className="tours-container">
      <h2>Tours Disponibles</h2>
      <p>Selecciona un paseo y elige un horario.</p>

      <div className="tours-grid">
        {tours.map((tour) => (
          <div
            key={tour.fecha + tour.id_guia}
            className={`tour-card ${
              selectedTour?.fecha === tour.fecha &&
              selectedTour?.id_guia === tour.id_guia
                ? "active"
                : ""
            }`}
            onClick={() => {
              setSelectedTour(tour);
              setSelectedHorario("");
            }}
          >
            <h3>Fecha: {tour.fecha}</h3>
            <h3>Guía: {tour.nombre_guia}</h3>

            <p>
              Horas disponibles:{" "}
              {tour.horarios.map((h) => h.hora).join(", ")}
            </p>

            <span className="precio">
              Precio: $
              {new Intl.NumberFormat("es-CO").format(tour.precio)} COP
            </span>
          </div>
        ))}
      </div>

      {selectedTour && (
        <div className="horarios-box">
          <h3>Horarios para: {selectedTour.fecha}</h3>

          <select
            value={selectedHorario}
            onChange={(e) => setSelectedHorario(e.target.value)}
          >
            <option value="">Seleccionar horario</option>

            {selectedTour.horarios.map((h) => (
              <option key={h.id_horario} value={h.id_horario}>
                {h.hora}
              </option>
            ))}
          </select>

          <button onClick={reservar}>Reservar</button>
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
