import React, { useEffect, useState } from "react";
import {
  Getdata,
  Postdata,
  Putdata,
  Deletedata,
} from "../servicios/Apis.js";
import { Modal } from "../componentes/Modal.jsx";
import { useVerificarSesion } from "../servicios/Auth.js";
import { useNavigate } from "react-router-dom";
import "../css/Negocios.css";

export function GestionNegocios() {
  const [negocios, setNegocios] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [usuario, setUsuario] = useState(null);
  
  const [mostrarModalNegocio, setMostrarModalNegocio] = useState(false);
  const [negocioEditar, setNegocioEditar] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const navigate = useNavigate();
  useVerificarSesion({ setUsuario, setModalData, navigate });

  const id_usuario = usuario?.id;  

  const cargarNegocios = async () => {
    const data = await Getdata(`negocios/usuario/${id_usuario}`);
    if (data?.showModal) {
      setModalData(data.modal);
    }
    setNegocios(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (usuario?.id) {
      cargarNegocios();
    }
  }, [usuario]);

  const abrirModalNegocio = (negocio = null) => {
    setNegocioEditar(
      negocio
        ? { ...negocio }
        : {
            nombre: "",
            direccion: "",
          }
    );
    setMostrarModalNegocio(true);
  };

  const guardarNegocio = async () => {
    if (!negocioEditar.nombre || negocioEditar.nombre.trim() === "") {
      setModalData({
        title: "Error",
        message: "El nombre del negocio es obligatorio",
        type: "error",
      });
      return;
    }

    if (!negocioEditar.direccion || negocioEditar.direccion.trim() === "") {
      setModalData({
        title: "Error",
        message: "La dirección es obligatoria",
        type: "error",
      });
      return;
    }

    try {
      const datosNegocio = {
        nombre: negocioEditar.nombre.trim(),
        direccion: negocioEditar.direccion.trim(),
        id_propietario: id_usuario,
      };

      let resultado;

      if (negocioEditar.id_negocio) {
        resultado = await Putdata(
          `negocios/editar/${negocioEditar.id_negocio}`,
          datosNegocio
        );
      } else {
        resultado = await Postdata("negocios/crear", datosNegocio);
      }

      if (resultado?.showModal) {
        setModalData(resultado.modal);
        if (resultado.modal.type === "success") {
          setMostrarModalNegocio(false);
          setNegocioEditar(null);
          cargarNegocios();
        }
      }
    } catch (error) {
      console.error("Error al guardar negocio:", error);
      setModalData({
        title: "Error",
        message: "Ocurrió un error al guardar el negocio",
        type: "error",
      });
    }
  };

  const eliminarNegocio = async (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de eliminar este negocio? Esta acción no se puede deshacer."
    );
    if (!confirmar) return;

    const resultado = await Deletedata(`negocios/eliminar/${id}`);
    if (resultado?.showModal) {
      setModalData(resultado.modal);
      if (resultado.modal.type === "success") {
        cargarNegocios();
      }
    }
  };

  const negociosFiltrados = negocios.filter((neg) =>
    neg.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="panel-negocios">
      <div className="header-negocios">
        <h2>Mis Negocios</h2>
        <button className="btn-crear" onClick={() => abrirModalNegocio()}>
          + Nuevo Negocio
        </button>
      </div>

      <div className="filtros-negocios">
        <input
          type="text"
          placeholder="🔍 Buscar negocio..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input-busqueda"
        />
      </div>

      <div className="negocios-grid">
        {negociosFiltrados.length === 0 && (
          <p className="sin-negocios">
            {busqueda
              ? "No se encontraron negocios con ese nombre."
              : "No tienes negocios registrados. ¡Crea tu primer negocio!"}
          </p>
        )}

        {negociosFiltrados.map((neg) => (
          <div key={neg.id_negocio} className="negocio-card">
            <div className="negocio-header">
              <h3 className="negocio-nombre">{neg.nombre}</h3>
              <div className="negocio-icon">🏪</div>
            </div>

            <div className="negocio-body">
              <p className="negocio-direccion">
                <span className="icon">📍</span>
                {neg.direccion}
              </p>
            </div>

            <div className="negocio-footer">
              <button
                className="btn-editar"
                onClick={() => abrirModalNegocio(neg)}
              >
                ✏️ Editar
              </button>
              <button
                className="btn-eliminar"
                onClick={() => eliminarNegocio(neg.id_negocio)}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {mostrarModalNegocio && negocioEditar && (
        <div
          className="modal-overlay"
          onClick={() => {
            setMostrarModalNegocio(false);
            setNegocioEditar(null);
          }}
        >
          <div
            className="modal-contenido"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>
              {negocioEditar.id_negocio ? "Editar Negocio" : "Nuevo Negocio"}
            </h3>

            <div className="form-negocio">
              <div className="form-group">
                <label>Nombre del negocio *</label>
                <input
                  type="text"
                  placeholder="Ej: Restaurante El Buen Sabor"
                  value={negocioEditar.nombre}
                  onChange={(e) =>
                    setNegocioEditar({
                      ...negocioEditar,
                      nombre: e.target.value,
                    })
                  }
                  maxLength="100"
                />
              </div>

              <div className="form-group">
                <label>Dirección *</label>
                <input
                  type="text"
                  placeholder="Ej: Calle 50 #23-45, Barranquilla"
                  value={negocioEditar.direccion}
                  onChange={(e) =>
                    setNegocioEditar({
                      ...negocioEditar,
                      direccion: e.target.value,
                    })
                  }
                  maxLength="200"
                />
              </div>
            </div>

            <div className="modal-acciones">
              <button className="btn-guardar" onClick={guardarNegocio}>
                💾 Guardar
              </button>
              <button
                className="btn-cancelar"
                onClick={() => {
                  setMostrarModalNegocio(false);
                  setNegocioEditar(null);
                }}
              >
                ✖️ Cancelar
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
    </div>
  );
}