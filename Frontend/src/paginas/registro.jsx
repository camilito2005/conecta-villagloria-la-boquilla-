import React from "react";
import { useEffect, useState } from "react";
import {Getdata, Postdata} from "../servicios/Apis.js";

import "../css/registro.css";
export function Registro() {
  const [cargos, setCargos] = useState([]);// Estado para almacenar los cargos obtenidos de la API, cargos es el estado y setCargos es la funcion para actualizar el estado
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
      identificacion: e.target.identificacion.value,
      telefono: e.target.telefono.value,
      direccion: e.target.direccion.value,
      email: e.target.email.value,
      contraseña: e.target.contraseña.value,
      foto: e.target.foto.files[0], // Obtener el archivo de la foto
      cargo: e.target.cargo.value
    };
    console.log("Nuevo usuario:", nuevoUsuario);

    try {
      const result = await Postdata("Registrarusuarios", nuevoUsuario);
      console.log("Usuario registrado:", result);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    }
  };
  return (
    <div className="registro-container">
      <h2>Crear cuenta</h2>
      <p>Únete a Conecta con ... y empieza a disfrutar de experiencias únicas</p>

      <form className="registro-form" onSubmit={handleSubmit}>
        <label htmlFor="nombre">Nombre completo</label>
        <input type="text" id="nombre" name="nombre" placeholder="Ingresa tu nombre" />

        <label htmlFor="identificacion">Identificación</label>
        <input type="number" id="identificacion" name="identificacion" placeholder="Ingresa su numero de identificacion" />

        <label htmlFor="telefono">Contacto</label>
        <input type="number" id="telefono" name="telefono" placeholder="Ingresa su numero de telefono" />

        <label htmlFor="direccion">Direccion</label>
        <input type="text" id="direccion" name="direccion" placeholder="Ingresa su direccion " />

        <label htmlFor="email">Correo electrónico</label>
        <input type="email" id="email" name="email" placeholder="ejemplo@correo.com" />

        <label htmlFor="contraseña">Contraseña</label>
        <input type="password" id="contraseña" name="contraseña" placeholder="********" />

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

      <div className="registro-footer">
        ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
      </div>
    </div>
  );
}
