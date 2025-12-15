import "../css/reservas.css";
import { Modal } from "../componentes/Modal.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVerificarSesion } from "../servicios/Auth.js";
import { Postdata } from "../servicios/Apis.js";

export function Agg_horarios() {
  const [modalData, setModalData] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useVerificarSesion({ setUsuario, setModalData, navigate });
    
  const id_guia = usuario?.id;

  // Horas disponibles
  const Horas = ["8:00 AM", "10:00 AM", "2:00 PM", "4:00 PM", "6:00 PM"];

  const Enviardatos = async (e) => {
    e.preventDefault();
    
    const fecha = e.target.fecha.value;
    const hora = e.target.hora.value;
    const precio = e.target.precio.value;
    const cupos_disponibles = e.target.cupos.value; // ✅ Corregido nombre

    // Validaciones básicas en el frontend
    if (!fecha || !hora || !precio || !cupos_disponibles) {
      setModalData({
        title: "Error",
        message: "Todos los campos son obligatorios",
        type: "error",
      });
      return;
    }

    const Datos = { 
      fecha, 
      hora, 
      id_guia, 
      precio: parseFloat(precio),
      cupos_disponibles: parseInt(cupos_disponibles) // ✅ Agregado
    };

    const Respuesta = await Postdata("horarios/agg_horarios", Datos);
    console.log("Respuesta horarios:", Respuesta);

    if (Respuesta?.showModal) {
      setModalData({
        title: Respuesta.modal.title,
        message: Respuesta.modal.message,
        type: Respuesta.modal.type,
      });

      // Solo recargar si fue exitoso
      if (Respuesta.modal.type === "success") {
        setTimeout(() => {
          navigate("/agg_horarios"); // O la ruta que corresponda
        }, 2000);
      }
      return;
    }
  };

  return (
    <section>
      <div className="reservas-container">
        <form onSubmit={Enviardatos} method="post">
          <h2>Módulo de Horarios disponibles</h2>
          <p>Selecciona la fecha, horario y cupos disponibles</p>
          
          <input 
            type="date" 
            name="fecha"
            min={new Date().toISOString().split('T')[0]} // ✅ No permitir fechas pasadas
            required
          />
          
          <select name="hora" required>
            <option value="">Selecciona una hora</option>
            {Horas.map((hora, index) => (
              <option key={index} value={hora}>{hora}</option>
            ))}
          </select>
          
          <input 
            type="number" 
            name="precio" 
            placeholder="Precio (COP)" 
            min="1000"
            step="1000"
            required
          />
          
          <input 
            type="number" 
            name="cupos" 
            placeholder="¿Cuántos cupos disponibles?" 
            min="1"
            max="50"
            required
          />
          
          <button type="submit">Crear Horario</button>
        </form>

        {modalData && (
          <Modal
            title={modalData.title}
            message={modalData.message}
            type={modalData.type}
            onClose={() => setModalData(null)} 
          />
        )}
      </div>
    </section>
  );
}