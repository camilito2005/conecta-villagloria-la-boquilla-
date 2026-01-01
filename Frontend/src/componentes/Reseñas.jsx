import React, { useEffect, useState } from "react";
import { Getdata, Postdata, Putdata, DeletedataWithBody } from "../servicios/Apis.js";
import { Modal } from "../componentes/Modal.jsx";
import "../css/Reseñas.css";

export function Resenas({ id_producto, usuario }) {
  const [resenas, setResenas] = useState([]);
  const [promedio, setPromedio] = useState(0);
  const [total, setTotal] = useState(0);
  const [modalData, setModalData] = useState(null);

  // Estados para crear/editar reseña
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [resenaEditar, setResenaEditar] = useState(null);
  const [puntuacion, setPuntuacion] = useState(5);
  const [comentario, setComentario] = useState("");
  const [puntuacionHover, setPuntuacionHover] = useState(0);

  useEffect(() => {
    cargarResenas();
  }, [id_producto]);

  const cargarResenas = async () => {
    const data = await Getdata(`resenas/producto/${id_producto}`);
    if (data?.resenas) {
      setResenas(data.resenas);
      setPromedio(data.promedio || 0);
      setTotal(data.total || 0);
    }
  };

  const abrirFormulario = (resena = null) => {
    if (resena) {
      setResenaEditar(resena);
      setPuntuacion(resena.puntuacion);
      setComentario(resena.comentario);
    } else {
      setResenaEditar(null);
      setPuntuacion(5);
      setComentario("");
    }
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setResenaEditar(null);
    setPuntuacion(5);
    setComentario("");
  };

  const guardarResena = async () => {
    if (!usuario?.id) {
      setModalData({
        title: "Inicia sesión",
        message: "Debes iniciar sesión para dejar una reseña.",
        type: "warning",
      });
      return;
    }

    if (comentario.trim() === "") {
      setModalData({
        title: "Error",
        message: "Por favor, escribe un comentario.",
        type: "error",
      });
      return;
    }

    try {
      const datosResena = {
        id_usuario: usuario.id,
        id_producto: id_producto,
        puntuacion: puntuacion,
        comentario: comentario.trim(),
      };

      let resultado;

      if (resenaEditar) {
        resultado = await Putdata(`resenas/Actualizar/${resenaEditar.id_reseña}`, datosResena);
      } else {
        resultado = await Postdata("resenas/Crear", datosResena);
      }

      if (resultado?.showModal) {
        setModalData(resultado.modal);
        if (resultado.modal.type === "success") {
          cerrarFormulario();
          cargarResenas();
        }
      }
    } catch (error) {
      console.error("Error al guardar reseña:", error);
      setModalData({
        title: "Error",
        message: "Ocurrió un error al guardar la reseña.",
        type: "error",
      });
    }
  };

  const eliminarResena = async (id_resena) => {
    const confirmar = window.confirm("¿Estás seguro de eliminar tu reseña?");
    if (!confirmar) return;

    const resultado = await DeletedataWithBody(`resenas/Eliminar/${id_resena}`, {
      id_usuario: usuario.id,
    });

    if (resultado?.showModal) {
      setModalData(resultado.modal);
      if (resultado.modal.type === "success") {
        cargarResenas();
      }
    }
  };

  const renderEstrellas = (calificacion, editable = false, onHover = null, onClick = null) => {
    return (
      <div className="estrellas-container">
        {[1, 2, 3, 4, 5].map((estrella) => (
          <span
            key={estrella}
            className={`estrella ${
              estrella <= (editable && puntuacionHover > 0 ? puntuacionHover : calificacion)
                ? "llena"
                : "vacia"
            } ${editable ? "editable" : ""}`}
            onMouseEnter={() => editable && onHover && onHover(estrella)}
            onMouseLeave={() => editable && onHover && onHover(0)}
            onClick={() => editable && onClick && onClick(estrella)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const opciones = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("es-ES", opciones);
  };

  const resenaDelUsuario = usuario
    ? resenas.find((r) => r.id_usuario === usuario.id)
    : null;

  return (
    <div className="resenas-container">
      <div className="resenas-header">
        <div className="resenas-stats">
          <div className="promedio-container">
            <span className="promedio-numero">{promedio.toFixed(1)}</span>
            {renderEstrellas(promedio)}
            <span className="total-resenas">({total} {total === 1 ? "reseña" : "reseñas"})</span>
          </div>
        </div>
        {/* si hay sesion mostrar el boton para escribir reseña, si no mostrar el mensaje "iniciar sesion para escribir tu reseña" */}
        {usuario && !resenaDelUsuario ? (
          <button className="btn-escribir-resena" onClick={() => abrirFormulario()}>
            ✍️ Escribir reseña
          </button>
        ) : !usuario ? (
          <div className="mensaje-iniciar-sesion">
            <p>Inicia sesión para escribir tu reseña.</p>
          </div>
        ) : null}
      </div>

      {/* Formulario de reseña */}
      {mostrarFormulario && (
        <div className="formulario-resena">
          <h3>{resenaEditar ? "Editar reseña" : "Escribe tu reseña"}</h3>

          <div className="form-group-resena">
            <label>Calificación *</label>
            {renderEstrellas(
              puntuacion,
              true,
              setPuntuacionHover,
              setPuntuacion
            )}
          </div>

          <div className="form-group-resena">
            <label>Comentario *</label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              placeholder="Cuéntanos tu experiencia con este producto..."
              rows="5"
              maxLength="500"
            />
            <small>{comentario.length}/500 caracteres</small>
          </div>

          <div className="form-actions-resena">
            <button className="btn-guardar-resena" onClick={guardarResena}>
              {resenaEditar ? "Actualizar" : "Publicar"} reseña
            </button>
            <button className="btn-cancelar-resena" onClick={cerrarFormulario}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista de reseñas */}
      <div className="resenas-lista">
        {resenas.length === 0 && (
          <div className="sin-resenas">
            <p>Aún no hay reseñas para este producto.</p>
            <p>¡Sé el primero en dejar tu opinión!</p>
          </div>
        )}

        {resenas.map((resena) => (
          <div
            key={resena.id_reseña}
            className={`resena-card ${
              usuario && resena.id_usuario === usuario.id ? "resena-propia" : ""
            }`}
          >
            <div className="resena-header-card">
              <div className="resena-usuario-info">
                <span className="resena-usuario-nombre">
                  {resena.nombre_usuario}
                </span>
                {renderEstrellas(resena.puntuacion)}
              </div>
              <span className="resena-fecha">
                {formatearFecha(resena.fecha)}
              </span>
            </div>

            <p className="resena-comentario">{resena.comentario}</p>

            {usuario && resena.id_usuario === usuario.id && (
              <div className="resena-acciones">
                <button
                  className="btn-editar-resena"
                  onClick={() => abrirFormulario(resena)}
                >
                  ✏️ Editar
                </button>
                <button
                  className="btn-eliminar-resena"
                  onClick={() => eliminarResena(resena.id_reseña)}
                >
                  🗑️ Eliminar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

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