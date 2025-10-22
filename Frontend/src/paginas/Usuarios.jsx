import { useEffect, useState } from "react";
import { Getdata } from "../servicios/Apis.js";
import React from "react";
import "../css/listarusuarios.css";

export function Usuarios() {
   const Ruta = "http://localhost:3000";
  const [usuarios, setUsuarios] = useState([]); // Estado para almacenar los usuarios obtenidos de la API
    useEffect(() => {
    // Obtener los usuarios desde la API al cargar el componente
    Getdata("usuarios/Listarusuarios")
      .then((data) => { 
        setUsuarios(data);
      })
      .catch((error) => {
        console.error("Error al obtener los usuarios:", error);
      });
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
            <button className="ver-btn">Ver perfil</button>
          </div>
        ))}
      </div>
    </section>
  );
}
