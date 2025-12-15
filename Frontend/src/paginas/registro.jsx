import React from "react";
import { useEffect, useState } from "react";
import { Getdata, Postdata } from "../servicios/Apis.js";
import { Modal } from "../componentes/Modal.jsx";

import "../css/registro.css";
export function Registro() {
  const [cargos, setCargos] = useState([]); // Estado para almacenar los cargos obtenidos de la API, cargos es el estado y setCargos es la funcion para actualizar el estado
  const [modalData, setModalData] = useState(null); // estado para el modal
  useEffect(() => {
    // Obtener los cargos desde la API al cargar el componente
    Getdata("cargos")
      .then((data) => {
        setCargos(data);
      })
      .catch((error) => {
        console.error("Error al obtener los cargos:", error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nuevoUsuario = {
      nombre: e.target.nombre.value,
      telefono: e.target.telefono.value,
      email: e.target.email.value,
      password: e.target.password.value,
      comfirm_password: e.target.comfirm_contraseña.value,
      cargo: e.target.cargo.value,
    };

    // formData.append("foto", e.target.foto.files[0]); // importante

    console.log("Nuevo usuario:", nuevoUsuario);

    try {
      const result = await Postdata("usuarios/Registrarusuarios", nuevoUsuario);
      console.log("Usuario registrado:", result);
      // teniendo en cuenta que el usuario se registro correctamente, o si hubo algun error en controlador puse un objeto con showModal: true para mostrar el modal
      // console.log("el modal", result.showModal);
      if (result.showModal) {
        setModalData({
          title: result.modal.title,
          message: result.modal.message,
          type: result.modal.type,
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    }
  };
  return (
    <div className="registro-container">
      <h2>Crear cuenta</h2>
      <p>
        Únete a Conecta con ... y empieza a disfrutar de experiencias únicas
      </p>

      <form className="registro-form" onSubmit={handleSubmit}>
        <label htmlFor="nombre">Nombre completo</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          placeholder="Ingresa tu nombre"
          required
        />

        <label htmlFor="telefono">Contacto</label>
        <input
          type="number"
          id="telefono"
          name="telefono"
          placeholder="Ingresa su numero de telefono"
          required
        />

        {/* <label htmlFor="direccion">Direccion</label> */}
        <input
          type="hidden"
          id="direccion"
          name="direccion"
          value="Villagloria"
          placeholder="Ingresa su direccion "
          required
        />

        <label htmlFor="email">Correo electrónico</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="ejemplo@correo.com"
          required
        />

        <label htmlFor="contraseña">Contraseña</label>
        <input
          type="password"
          id="contraseña"
          name="password"
          placeholder="********"
          required
        />

        <label htmlFor="contraseña">Comfirmar Contraseña</label>
        <input
          type="password"
          id="comfirm_contraseña"
          name="comfirm_contraseña"
          placeholder="********"
          required
        />

        <label htmlFor="cargo">Selecciona tu rol</label>
        <select id="cargo" name="cargo">
          {cargos
            .filter((c) => c.cargo === "Turista")
            .map((cargo) => (
              <option key={cargo.id_cargo} value={cargo.id_cargo}>
                {cargo.cargo}
              </option>
            ))}
        </select>

        <button type="submit" className="registro-btn">
          Registrarse
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

      <div className="registro-footer">
        ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
      </div>
    </div>
  );
}
