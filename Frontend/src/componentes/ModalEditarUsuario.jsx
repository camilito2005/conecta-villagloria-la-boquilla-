import { useState } from "react";
import "../css/modalEditarUsuario.css";

export function ModalEditarUsuario({ usuario, onClose, onSave }) {
  const [formData, setFormData] = useState({
    usuarioId: usuario.id,
    nombre: usuario.nombre,
    email: usuario.correo,
    contacto: usuario.contacto,
    direccion: usuario.direccion,
    cargo: usuario.cargo,
    foto: usuario.foto, // se queda solo para mostrarla, NO para actualizar
    rol: usuario.rol,
  });

  // Vista previa solo para mostrar la imagen actual
  const [preview] = useState(
    // si hay foto, mostrarla; si no, null y si el entorno es produccion usa VITE_URL si no usa VITE_API_URL
    usuario.foto && usuario.foto !== "null"
      ? import.meta.env.VITE_NODE_ENV === "production"
        ? `${import.meta.env.VITE_URL}${usuario.foto}`
        : `${import.meta.env.VITE_API_URL}${usuario.foto}`
      : null
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-editar">
        <h2>Editar Perfil</h2>

        <form onSubmit={handleSubmit}>
          {/* Imagen o Avatar */}
          <div className="edit-img-container">
            {preview ? (
              <img
                src={preview}
                alt="foto-perfil"
                className="edit-img-preview"
              />
            ) : (
              <div className="edit-avatar">
                {usuario.nombre.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Campos */}
          <label>Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />

          <label>Correo</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Teléfono</label>
          <input
            type="text"
            name="contacto"
            value={formData.contacto}
            onChange={handleChange}
            required
          />

          <label>Cargo</label>
          <input type="text" value={formData.cargo} disabled />

          {/* <label>Rol</label> */}
          <input type="hidden" value={formData.rol} disabled />

          {/* <label>usuarios id</label> */}
          <input type="hidden" value={formData.usuarioId} disabled />

          <div className="modal-actions">
            <button type="button" className="cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="guardar">
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
