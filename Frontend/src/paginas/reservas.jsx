import React, { useEffect, useState } from "react";
import { Modal } from "../componentes/Modal.jsx";
import { useVerificarSesion } from "../servicios/Auth.js";
import { Getdata } from "../servicios/Apis.js";
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
  // console.log("Usuario en tours disponibles:", usuario);

  const id_turista = usuario?.id;

  // Obtener los tours y horarios disponibles desde la API al cargar el componente
  useEffect(() => {
  const Horarios_disponibles = async () => {
    try {
      const data = await Getdata("horarios/listar_horarios");

      if (Array.isArray(data)) {
        setTours(data);
      } else {
        // console.warn("La API devolvió un objeto en vez de un array:", data);
        setTours([]);
      }
    } catch (error) {
      console.error("Error al obtener los tours y horarios:", error);
      setTours([]);
    }
  };

  Horarios_disponibles();
}, []);
  

  // const reservar = () => {
  //   if (!selectedTour || !selectedHorario) {
  //     alert("Selecciona un tour y un horario.");
  //     return;
  //   }

  //   const reserva = {
  //     tour_id: selectedTour.id,
  //     horario: selectedHorario,
  //   };

  //   fetch("http://localhost:3000/api/reservar", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(reserva),
  //   })
  //     .then((res) => res.json())
  //     .then(() => alert("Reserva realizada con éxito"))
  //     .catch(() => alert("Error al reservar"));
  // };

  return (
    <div className="tours-container">
      <h2>Tours Disponibles</h2>
      <p>Selecciona un paseo en canoa y reserva un horario.</p>

      <div className="tours-grid">
        {tours.map((tour) => (
          <div
            key={tour.id_horario}
            className={`tour-card ${
              selectedTour?.id === tour.id ? "active" : ""
            }`}
            onClick={() => {
              setSelectedTour(tour);
              setSelectedHorario("");
            }}
          >
            <h3>Fecha: {tour.fecha}</h3>
            <h3>Guia: {tour.nombre_guia}</h3>
            <p>Hora: {tour.hora}</p>
            <p>{tour.descripcion}</p>
            <span className="precio">Precio: ${new Intl.NumberFormat("es-CO").format(tour.precio)}COP</span>
          </div>
        ))}
      </div>

      {selectedTour && (
        <div className="horarios-box">
          <h3>Horarios disponibles para: {selectedTour.nombre}</h3>

          <select
            value={selectedHorario}
            onChange={(e) => setSelectedHorario(e.target.value)}
          >
            <option value="">Seleccionar horario</option>
            {selectedTour.horarios.map((hora, index) => (
              <option key={index} value={hora}>
                {hora}
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
