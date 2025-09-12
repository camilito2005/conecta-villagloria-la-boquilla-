import React from "react";
import { useEffect, useState } from "react";
import "../css/registro.css";
export function Registro() {
    const [cargos, setCargos] = React.useState([])//Estado para almacenar los cargos disponibles

    useEffect(() => {
      // la llamo mediante get para obtener los cargos disponibles
        fetch("http://localhost/conecta-con-villagloria/Rutas/rutas.php?accion=cargos") // endpoint de la api que devuelve los cargos
        
        .then((respon) => respon.json())
        .then((datos) => setCargos(datos))
        .catch((error) => console.error("Error al cargar los cargos:", error));
    },[])
  return (
    <div className="registro-container">
      <h2>Crear cuenta</h2>
      <p>Únete a ViveBoquilla y empieza a disfrutar de experiencias únicas</p>

      <form className="registro-form">
        <label htmlFor="nombre">Nombre completo</label>
        <input type="text" id="nombre" placeholder="Ingresa tu nombre" />

        <label htmlFor="email">Correo electrónico</label>
        <input type="email" id="email" placeholder="ejemplo@correo.com" />

        <label htmlFor="password">Contraseña</label>
        <input type="password" id="password" placeholder="********" />

        <label htmlFor="cargo">Selecciona tu rol</label>
        <select id="cargo">
          {cargos.map((cargo) => (
            <option key={cargo.id_cargo} value={cargo.id_cargo}>
              {cargo.cargo}
            </option>
          ))}
        </select>

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
