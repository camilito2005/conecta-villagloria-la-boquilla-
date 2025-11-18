import "../css/reservas.css";
import { Modal } from "../componentes/Modal.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { VerificarSesion } from "../servicios/Auth.js";
import { Postdata } from "../servicios/Apis.js";

export function Agg_horarios() {
  const [modalData, setModalData] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  VerificarSesion({ setUsuario, setModalData, navigate });
    
  // const Cargo = usuario?.rol;
  const id_guia = usuario?.id;

  const Horas = ["8:00 AM", "10:00 AM", "2:00 PM", "4:00 PM", "6:00 PM"];
  const guias = ["Juan Perez", "Maria Gomez", "Luis Rodriguez"];

  const Enviardatos = async (e) => {
    e.preventDefault();
    const fecha = e.target.fecha.value;
    const hora = e.target.hora.value;
    const precio = e.target.precio.value;
    const Datos = { fecha, hora, id_guia, precio };

    const Respuesta = await Postdata("horarios/agg_horarios", Datos);

    if (Respuesta.showModal) {
      setModalData({
        title: Respuesta.modal.title,
        message: Respuesta.modal.message,
        type: Respuesta.modal.type,
      });
      return;
    }
  };
  return (
    <section>
      <div className="reservas-container">
        <form onSubmit={Enviardatos} method="post">
          <h2>Módulo de Horarios disponibles</h2>
          <p>Selecciona la fecha y horario disponible</p>
          <input type="date" name="fecha" />
          <select name="hora">
            {Horas.map((hora, index) => (
              <option key={index}>{hora}</option>
            ))}
          </select>
          <input type="number" name="precio" placeholder="Precio" />
          <button>Confirmar Reserva</button>
          {modalData && (
            <Modal
              title={modalData.title}
              message={modalData.message}
              type={modalData.type}
              onClose={() => setModalData(null)}
            />
          )}
        </form>
      </div>
    </section>
  );
}
