import "../css/perfil.css";
import { Postdata, Putdata, Getdata } from "../servicios/Apis.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useVerificarSesion } from "../servicios/Auth.js";
import { Modal } from "../componentes/Modal.jsx";
import { ModalEditarUsuario } from "../componentes/ModalEditarUsuario.jsx";

export function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);

  const navigate = useNavigate();

  useVerificarSesion({ setUsuario, setModalData, navigate });

  const cerrarSesion = async () => {
    const result = await Postdata("usuarios/logout", {});
    if (result.showModal) {
      setModalData(result.modal);
      setTimeout(() => navigate("/login"), 2000);
      // luego que me redirija, recargar la pagina para actualizar el estado global
      // setTimeout(() => window.location.reload(), 1500);
    }
  };

  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const actualizarUsuario = async (data) => {
    const payload = {
      usuarioId: data?.usuarioId,
      nombre: data?.nombre,
      email: data?.email,
      telefono: data?.contacto,
      id_cargo: data?.rol,
    };
    try {
      const response = await Putdata(`usuarios/actualizar_mi_perfil`, payload);

       

    // 🔥 Después de actualizar en backend → refresco SIEMPRE desde BD
    const yo = await Getdata("usuarios/yo");

    if (yo.usuario) {
      setUsuario(yo.usuario); // solo un render limpio
    }
    if (response.showModal) {
      setModalData(response.modal);
      setTimeout(() => window.location.reload(), 1500);
    }

    setMostrarModalEditar(false);
    } catch (error) {
      console.error("Error actualizando usuario:", error);
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // 🔹 Evitar errores cuando no hay usuario cargado
  const fotourl =
    usuario?.foto && usuario.foto !== "null"
      ? `http://localhost:3000${usuario.foto}`
      : null;
  const nombre = usuario?.nombre || "Sin nombre";
  const inicial = nombre.charAt(0).toUpperCase();
  const correo = usuario?.correo || "No disponible";
  const contacto = usuario?.contacto || "No disponible";
  const direccion = usuario?.direccion || "No disponible";
  const cargo = usuario?.cargo || "No disponible";
  const rol = usuario?.rol || "No disponible";

  return (
    <div className="perfil-container">
      <div className="perfil-header">
        {/* 🟩 SI HAY FOTO → mostrar imagen */}
        {fotourl ? (
          <img src={fotourl} alt="Foto de perfil" className="perfil-foto" />
        ) : (
          /* 🟥 SI NO HAY FOTO → avatar con inicial */
          <div className="perfil-avatar">{inicial}</div>
        )}

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
      </div>

      <div className="perfil-actions">
        <button
          className="perfil-btn"
          onClick={() => setMostrarModalEditar(true)}
        >
          Editar Perfil
        </button>
        <button onClick={cerrarSesion} className="perfil-btn">
          Cerrar Sesión
        </button>
      </div>

      <button
        className="darkmode-toggle"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? "🌙 Modo Claro" : "☀️ Modo Oscuro"}
      </button>

      {mostrarModalEditar && (
        <ModalEditarUsuario
          usuario={usuario}
          onClose={() => setMostrarModalEditar(false)}
          onSave={(data) => actualizarUsuario(data)}
        />
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
