import { useEffect, useState } from "react";
import { Getdata } from "../servicios/Apis.js";
import { Modal } from "../componentes/Modal.jsx";
import { useNavigate } from "react-router-dom";
import "../css/ListarUsuarios.css";

export function Usuarios() {
  const navigate = useNavigate();
  const [modalData, setModalData] = useState(null); // estado para el modal
  const [usuarios, setUsuarios] = useState([]); // Estado para almacenar los usuarios obtenidos de la API
 useEffect(() => {
  const fetchUsuarios = async () => {
    try {
      const result = await Getdata("usuarios/Listarusuarios");
      // console.log("Respuesta de usuarios:", result);

      // Establecer los usuarios si la respuesta es válida
      setUsuarios(Array.isArray(result) ? result : []);

      // Verificar si se debe mostrar el modal
      if (result.showModal) {
        // console.log("Mostrar modal:", result.showModal);
        setModalData({
          title: result.modal?.title || "Información",
          message: result.modal?.message || "Se recibió una respuesta con modal.",
          type: result.modal?.type || "info",
        });
      }
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    }
  };

  fetchUsuarios();
}, []);

  return (
    <section className="usuarios-container">
      <h2>Usuarios Registrados</h2>
      <p>Lista de miembros activos en la comunidad.</p>

      <div className="usuarios-grid">
        {usuarios.map((usuario) => (
          <div key={usuario.id_usuario} className="usuario-card">
            <div className="usuario-avatar">
              <span>{usuario.nombre.charAt(0)}</span>
            </div>
            <h3>{usuario.nombre}</h3>
            <p className="correo">{usuario.email}</p>
            <p className="rol">{usuario.descripcion_cargo}</p>
            <button
              className="ver-btn"
              onClick={() => navigate(`/admin_usuario_perfil/${usuario.id_usuario}`)}
            >
              Ver perfil
            </button>
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
    </section>
    
  );
}
