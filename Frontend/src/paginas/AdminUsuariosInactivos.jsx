import { useEffect, useState } from "react";
import { Getdata, Deletedata, Postdata } from "../servicios/Apis.js";
import { useVerificarSesion } from "../servicios/Auth.js";
import { useNavigate } from "react-router-dom";
import { Modal } from "../componentes/Modal.jsx";
import "../css/AdminUsuariosInactivos.css";

export function AdminUsuariosInactivos() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);
  const navigate = useNavigate();

  useVerificarSesion({ setUsuario: () => {}, setModalData, navigate });

//   useEffect(() => {
//     const fetchInactivos = async () => {
//       try {
//         const data = await Getdata("usuarios/inactivos");
//         console.log("Usuarios inactivos obtenidos:", data);
//         setUsuarios(data);
//       } catch (error) {
//         console.error("Error al obtener usuarios inactivos:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInactivos();
//   }, []);
useEffect(() => {
  const fetchInactivos = async () => {
    try {
      const data = await Getdata("usuarios/inactivos");

      // Si el backend devuelve algo que NO es array, evitar el map()
      if (!Array.isArray(data)) {
        setUsuarios([]);
        return;
      }

      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios inactivos:", error);
      setUsuarios([]); // <- Para evitar usuarios.map cuando hay error
    } finally {
      setLoading(false);
    }
  };

  fetchInactivos();
}, []);

  const restaurarUsuario = async (id) => {
    try {
      const Respuesta = await Postdata(`usuarios/restaurar/${id}`, {});
      // console.log("Respuesta de restaurar usuario:", Respuesta);
      
      if (Respuesta.showModal) {
        setModalData({
          title: Respuesta.modal.title,
          message: Respuesta.modal.message,
          type: Respuesta.modal.type,
        });
        setUsuarios((prev) => prev.filter((u) => u.id_usuario !== id)); // Quitar de la lista de inactivos
        // luego de 5 segundos de haber mostrado el modal, enviar a la vista del admin
        setTimeout(() => {
           navigate("/admin");
        }, 3000);

      }
      // Quitar de la lista de inactivos
    } catch (error) {
      console.error("Error restaurando usuario", error);
    }
  };

  const eliminarUsuario = async (id) => {
    const confirmacion = confirm("¿Eliminar definitivamente este usuario?");
    if (!confirmacion) return;

    try {
      const Respuesta = await Deletedata(`usuarios/eliminar_usuario/${id}`);
      setUsuarios((prev) => prev.filter((u) => u.id_usuario !== id));
      if (Respuesta.showModal) {
        setModalData({
          title: Respuesta.modal.title,
          message: Respuesta.modal.message,
          type: Respuesta.modal.type,
        });
      }
    } catch (error) {
      console.error("Error eliminando usuario", error);
    }
  };

  if (loading) return <p className="cargando">Cargando usuarios...</p>;

  return (
    <div className="inactivos-container">
      <h1>Usuarios Inactivos</h1>

      {usuarios.length === 0 ? (
        <p className="sin-usuarios">No hay usuarios inactivos</p>
      ) : (
        <div className="usuarios-grid">
          {usuarios.map((u) => (
            <div key={u.id_usuario} className="usuario-card">
              {u.imagen_url !== null ? (
                // ✔ Si hay foto → mostrar imagen
                <img
                  src={`http://localhost:3000${u.imagen_url}`}
                  alt="foto"
                  className="admin-usuario-foto"
                />
              ) : (
                // ✔ Si no hay foto → mostrar letra como avatar
                <div className="admin-avatar-letra">
                  {u.nombre.charAt(0).toUpperCase()}
                </div>
              )}

              <h3>{u.nombre}</h3>
              <p className="email">{u.email}</p>
              <p className="rol">{u.rol}</p>

              <div className="acciones">
                <button
                  className="btn-restaurar"
                  onClick={() => restaurarUsuario(u.id_usuario)}
                >
                  Restaurar
                </button>

                <button
                  className="btn-eliminar"
                  onClick={() => eliminarUsuario(u.id_usuario)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
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
