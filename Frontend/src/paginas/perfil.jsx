import "../css/perfil.css";
import { Postdata } from "../servicios/Apis.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../componentes/Modal.jsx";

export function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [modalData, setModalData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarSesion = async () => {
      const result = await Postdata("usuarios/verificar", { enviarJson: true });
      // console.log("Respuesta verificación:", result);

      if (result.showModal && result.modal) {
        setModalData({
          title: result.modal.title,
          message: result.modal.message,
          type: result.modal.type,
        });

        setTimeout(() => navigate("/login"), 3000);
        return;
      }

      if (result.usuario) {
        setUsuario(result.usuario);
      }
    };

    verificarSesion();
  }, []);

  const cerrarSesion = async () => {
  const result = await Postdata("usuarios/logout", {});
  if (result.showModal) {
    setModalData(result.modal);
    setTimeout(() => navigate("/login"), 2000);
  }
};

  // 🔹 Evitar errores cuando no hay usuario cargado
  const fotourl = usuario?.foto
    ? `http://localhost:3000${usuario.foto}`
    : "/src/assets/canoas.jpg";
  const nombre = usuario?.nombre || "Sin nombre";
  const correo = usuario?.correo || "No disponible";
  const contacto = usuario?.contacto || "No disponible";
  const direccion = usuario?.direccion || "No disponible";
  const cargo = usuario?.cargo || "No disponible";

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        <img src={fotourl} alt="Foto de perfil" />
        <h2>{nombre}</h2>
        <p>{cargo}</p>
      </div>

      <div className="perfil-info">
        <div>
          <label>Nombre</label>
          <p>{nombre}</p>
        </div>
        <div>
          <label>Correo</label>
          <p>{correo}</p>
        </div>
        <div>
          <label>Cargo</label>
          <p>{cargo}</p>
        </div>
        <div>
          <label>Teléfono</label>
          <p>{contacto}</p>
        </div>
        <div>
          <label>Dirección</label>
          <p>{direccion}</p>
        </div>
        <div>
          <label>Idiomas</label>
          <p>{"No disponible"}</p>
        </div>
      </div>

      <div className="perfil-actions">
        <button className="perfil-btn">Editar Perfil</button>
        <button onClick={cerrarSesion} className="perfil-btn">Cerrar Sesión</button>
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
