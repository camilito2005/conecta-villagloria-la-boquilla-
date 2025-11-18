import "../css/login.css";
import { useState } from "react";
import { Postdata } from "../servicios/Apis.js";
import { Modal } from "../componentes/Modal.jsx";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [modalData, setModalData] = useState(null);
  const navigate = useNavigate();

  const Enviardatos = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const contraseña = e.target.password.value;

    try {
      const Respuesta = await Postdata("usuarios/Login", {
        email,
        password: contraseña,
      });

      // Si el backend envía modal de error o información
      if (Respuesta.showModal) {
        setModalData({
          title: Respuesta.modal.title,
          message: Respuesta.modal.message,
          type: Respuesta.modal.type,
        });
        return;
      }

      // ✅ Si el login fue exitoso:
      if (Respuesta.usuario) {
        // Guardamos en localStorage que hay sesión activa
        localStorage.setItem("sesionActiva", "true");

        // 🔔 Notificamos al resto de la app que cambió el estado de sesión
        window.dispatchEvent(new Event("sesion-cambio"));

        // Redirección según el rol del usuario
        const rol = Respuesta.usuario?.id_cargo;
        if (rol === 1) {
          navigate("/marketplace");
        } else if (rol === 2) {
          navigate("/reservas");
        } else if (rol === 3) {
          navigate("/contacto");
        } else if (rol === 4) {
          navigate("/admin");
        } else {
          navigate("/"); // Por defecto
        }
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setModalData({
        title: "Error",
        message: "Hubo un problema al iniciar sesión.",
        type: "error",
      });
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <p>Accede a tu cuenta para continuar</p>

      <form className="login-form" onSubmit={Enviardatos}>
        <label htmlFor="email">Correo electrónico</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="ejemplo@correo.com"
          required
        />

        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="********"
          required
        />

        <button type="submit" className="login-btn">
          Entrar
        </button>
      </form>
      {modalData && (
        <Modal
          title={modalData.title}
          message={modalData.message}
          type={modalData.type}
          onClose={() => setModalData(null)}
        />
      )}

      <div className="login-footer">
        ¿No tienes cuenta? <a href="/registro">Regístrate aquí</a>
      </div>
    </div>
  );
}
