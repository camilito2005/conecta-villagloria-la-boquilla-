///modal para mostrar mensajes de errores o resultados de las llamas a la api
import "../css/modal.css";
export function Modal({ title, message, type, onClose }) {
  let clases = "";
  if (type == "exitoso") {
     clases = "modal-title-exit"
  }
  else if(type == "error"){
     clases = "modal-title-error"
  }
  return (
    <div className="modal-overlay">
      <div className={`modal ${type}`}>
        <h2 className={`${clases}`}>{title}</h2>
        <p className="modal-message">{message}</p>
        <button className="modal-close-button" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
}