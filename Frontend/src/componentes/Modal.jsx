///modal para mostrar mensajes de errores o resultados de las llamas a la api
import "../css/modal.css";
export function Modal({ title, message, type, onClose }) {
  return (
    <div className="modal-overlay">
      <div className={`modal ${type}`}>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        <button className="modal-close-button" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}