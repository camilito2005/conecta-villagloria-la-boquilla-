import React from "react";
import { useEffect, useState } from "react";
import { Getdata, PostFormData } from "../servicios/Apis.js";
import { Link } from "react-router-dom";
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

    const formData = new FormData();
    formData.append("nombre", e.target.nombre.value);
    formData.append("identificacion", e.target.identificacion.value);
    formData.append("telefono", e.target.telefono.value);
    formData.append("direccion", e.target.direccion.value);
    formData.append("email", e.target.email.value);
    formData.append("password", e.target.password.value);
    formData.append("cargo", e.target.cargo.value);
    formData.append("foto", e.target.foto.files[0]); // importante

    console.log("Nuevo usuario:", formData);

    try {
      const result = await PostFormData("usuarios/Registrarusuarios", formData);
      console.log("Usuario registrado:", result);
      // teniendo en cuenta que el usuario se registro correctamente, o si hubo algun error en controlador puse un objeto con showModal: true para mostrar el modal
      console.log("el modal", result.showModal);
      if (result.showModal) {
        setModalData({
          title: result.modal.title,
          message: result.modal.message,
          type: result.modal.type,
        });
      } else {
        // Si el registro fue exitoso, muestra un modal de éxito y redirige
        setModalData({
          title: "Usuario registrado",
          message: `El usuario ${formData.get(
            "nombre"
          )} fue registrado correctamente.`,
          type: "success",
        });
        // redirige después de unos segundos
        setTimeout(() => {
          window.location.href = "/login";
        }, 2500);
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
        />

        <label htmlFor="identificacion">Identificación</label>
        <input
          type="number"
          id="identificacion"
          name="identificacion"
          placeholder="Ingresa su numero de identificacion"
        />

        <label htmlFor="telefono">Contacto</label>
        <input
          type="number"
          id="telefono"
          name="telefono"
          placeholder="Ingresa su numero de telefono"
        />

        <label htmlFor="direccion">Direccion</label>
        <input
          type="text"
          id="direccion"
          name="direccion"
          placeholder="Ingresa su direccion "
        />

        <label htmlFor="email">Correo electrónico</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="ejemplo@correo.com"
        />

        <label htmlFor="contraseña">Contraseña</label>
        <input
          type="password"
          id="contraseña"
          name="password"
          placeholder="********"
        />

        <label htmlFor="cargo">Selecciona tu rol</label>
        <select id="cargo" name="cargo">
          {cargos.map((cargo) => (
            <option key={cargo.id_cargo} value={cargo.id_cargo}>
              {cargo.cargo}
            </option>
          ))}
        </select>

        <label htmlFor="">Foto</label>
        <input type="file" id="foto" name="foto" accept="image/*" />

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
