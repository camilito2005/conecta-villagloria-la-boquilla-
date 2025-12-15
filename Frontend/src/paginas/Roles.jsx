import React, { useEffect, useState } from "react";
import { Getdata, Postdata, Putdata, Deletedata } from "../servicios/Apis.js";
import { Modal } from "../componentes/Modal.jsx";
import { useVerificarSesion } from "../servicios/Auth.js";
import { useNavigate } from "react-router-dom";
import "../css/Roles.css";

export function Roles() {
  const [roles, setRoles] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [editar, setEditar] = useState(null);
  const [nombre, setNombre] = useState("");

  const [modalData, setModalData] = useState(null);
  const [usuario, setUsuario] = useState(null);

  const navigate = useNavigate();

  useVerificarSesion({ setUsuario, setModalData, navigate });

  const cargarRoles = async () => {
    const data = await Getdata("cargos");
    setRoles(data);
  };

  useEffect(() => {
    cargarRoles();
  }, []);

  const abrirCrear = () => {
    setEditar(null);
    setNombre("");
    setMostrarModal(true);
  };

  const abrirEditar = (rol) => {
    setEditar(rol);
    setNombre(rol.cargo);
    setMostrarModal(true);
  };

  const guardar = async () => {
    if (editar) {
      const DatosEditar = await Putdata(`cargos/Editar/${editar.id_cargo}`, {
        nombre,
      });
    } else {
      const DatosIngresar = await Postdata("cargos/Registrar", { nombre });
      if (DatosIngresar.showModal) {
        setModalData({
          title: DatosIngresar.modal.title,
          message: DatosIngresar.modal.message,
          type: DatosIngresar.modal.type,
        });
      }
    }
    setMostrarModal(false);
    cargarRoles();
  };

  const eliminarRol = async (id_cargo) => {
    if (confirm("¿Seguro que deseas eliminar este rol?")) {
      const DatosEliminar = await Deletedata(`cargos/Eliminar/${id_cargo}`);
      if (DatosEliminar.showModal) {
        setModalData({
          title: DatosEliminar.modal.title,
          message: DatosEliminar.modal.message,
          type: DatosEliminar.modal.type,
        });
      }
      cargarRoles();
    }
  };

  return (
    <>
      {/* PANEL */}
      <div className="panel-roles">
        <h2>Gestión de Roles</h2>

        <button className="btn-crear" onClick={abrirCrear}>
          + Crear Rol
        </button>

        <table className="tabla-roles">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {roles.map((r) => (
              <tr key={r.id_cargo}>
                <td>{r.id_cargo}</td>
                <td>{r.cargo}</td>
                <td>
                  <button className="btn-editar" onClick={() => abrirEditar(r)}>
                    Editar
                  </button>
                  <button
                    className="btn-eliminar"
                    onClick={() => eliminarRol(r.id_cargo)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL GLOBAL FUERA DEL PANEL */}
      {mostrarModal && (
        <div className="modaldata">
          <div className="modal-contenido">
            <h3>{editar ? "Editar Rol" : "Crear Rol"}</h3>

            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del rol"
            />

            <div className="acciones">
              <button className="btn-guardar" onClick={guardar}>
                Guardar
              </button>
              <button
                className="btn-cancelar"
                onClick={() => setMostrarModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
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
    </>
  );
}
