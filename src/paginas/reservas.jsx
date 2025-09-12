import "../css/reservas.css";

export function Reservas() {
  return (
    <div className="reservas-container">
      <h2>Módulo de Reservas</h2>
      <p>Selecciona la fecha y horario disponible</p>
      <input type="date" />
      <select>
        <option>8:00 AM</option>
        <option>10:00 AM</option>
        <option>2:00 PM</option>
      </select>
      <button>Confirmar Reserva</button>
    </div>
  );
}
