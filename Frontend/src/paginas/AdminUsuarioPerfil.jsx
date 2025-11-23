import { useEffect, useState } from "react";
import { Getdata , Postdata, Putdata } from "../servicios/Apis.js";
import { useVerificarSesion } from "../servicios/Auth.js";
import { useNavigate, useParams } from "react-router-dom";
import { Modal } from "../componentes/Modal.jsx";

import "../css/AdminUsuariosPerfil.css";

export function AdminUsuarioPerfil() {
  const [usuarioSesion, setUsuarioSesion] = useState(null);
  const [usuarioPerfil, setUsuarioPerfil] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [cargos ,setCargos] = useState([]);
  const navigate = useNavigate();

  const { usuarioId } = useParams();

  useVerificarSesion({ setUsuario: setUsuarioSesion, setModalData, navigate });

 useEffect(() => {
    // Obtener los cargos desde la API al cargar el componente
    Getdata("cargos")
      .then((data) => {
        // console.log("Cargos obtenidos:", data);
        setCargos(data);
      })
      .catch((error) => {
        console.error("Error al obtener los cargos:", error);
      });
  }, []);

  // console.log("Usuario en AdminUsuarioPerfil:", usuarioSesion);
  // ✅ 2. Cargar datos del usuario del perfil admin
  useEffect(() => {
    const GetUsuario = async () => {
      try {
        const data = await Getdata(`usuarios/perfil_admin/${usuarioId}`);
        setUsuarioPerfil(data);
        // console.log("Datos del usuario obtenido:", data);
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    GetUsuario();
  }, [usuarioId]);

  const Enviardatos = async (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar los datos actualizados del usuario
    const nombre = e.target.nombre.value;
    const email = e.target.email.value;
    const telefono = e.target.telefono.value;
    const id_cargo = e.target.cargo.value;

    const Datos = {
      nombre,
      email,
      telefono,
      id_cargo,
    };

    try{
      const Respuesta = await Putdata(`usuarios/actualizar_perfil_admin/${usuarioId}`, Datos);
      // console.log("Respuesta al actualizar el usuario:", Respuesta);
      if (Respuesta.showModal) {
        setModalData({
          title: Respuesta.modal.title,
          message: Respuesta.modal.message,
          type: Respuesta.modal.type,
        });
        setTimeout(() => {
          window.location.reload();
        }, 5000);
      return;
      }

    }
    catch(error){
      console.error("Error al actualizar el usuario:", error);
    }
  };

  const EliminarU = async () => {
    // Lógica para eliminar el usuario
    const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (confirmar) {
      // Aquí iría la lógica para eliminar el usuario
      const Respuesta = await Postdata(`usuarios/Inactivarusuario/${usuarioId}`);
      // console.log("Respuesta al eliminar el usuario:", Respuesta);
      if (Respuesta.showModal) {
        setModalData({
          title: Respuesta.modal.title,
          message: Respuesta.modal.message,
          type: Respuesta.modal.type,
        });
        setTimeout(() => {
          navigate("/usuarios");
        }, 5000);
      return;
    }
  }
  };

  if (!usuarioPerfil) return <p>Cargando...</p>;

  // si hay foto usarla, si no uso el nombre con la primera letra como avatar

  return (
    <div className="admin-usuario-container">
      
      {/* Card Superior */}
      <div className="admin-usuario-header">
        {usuarioPerfil.imagen_url !== "/Recursos/null" ? (
          // ✔ Si hay foto → mostrar imagen
          <img
            src={`http://localhost:3000${usuarioPerfil.imagen_url}`}
            alt="foto"
            className="admin-usuario-foto"
          />
        ) : (
          // ✔ Si no hay foto → mostrar letra como avatar
          <div className="admin-avatar-letra">
            {usuarioPerfil.nombre.charAt(0).toUpperCase()}
          </div>
        )}

        <h2>{usuarioPerfil.nombre}</h2>
        <p className="rol">{usuarioPerfil.descripcion_cargo}</p>
      </div>

      {/* Formulario */}
      <form className="admin-usuario-form" onSubmit={Enviardatos}>
        <div className="form-group">
          <label>Nombre</label>
          <input name="nombre" type="text" defaultValue={usuarioPerfil.nombre} />
        </div>

        <div className="form-group">
          <label>Correo</label>
          <input name="email" type="email" defaultValue={usuarioPerfil.email} />
        </div>

        <div className="form-group">
          <label>Teléfono</label>
          <input name="telefono" type="text" defaultValue={usuarioPerfil.telefono} />
        </div>

        <div className="form-group">
          <label>Cargo</label>
          <select name="cargo" defaultValue={usuarioPerfil.id_cargo}>
            {cargos.map((cargo) => (
              <option key={cargo.id_cargo} value={cargo.id_cargo}>
                {cargo.cargo}
              </option>
            ))}
          </select>
        </div>

        <div className="botones-acciones">
          <button type="submit" className="btn-guardar">
            Guardar Cambios
          </button>
          <button type="button" onClick={EliminarU} className="btn-eliminar">
            Inactivar Usuario
          </button>
        </div>
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
  );
}
