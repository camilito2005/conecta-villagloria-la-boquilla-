import React, { useEffect, useState } from "react";
import { Getdata, Postdata, Putdata, Deletedata } from "../servicios/Apis.js";
import { Modal } from "../componentes/Modal.jsx";
import { useVerificarSesion } from "../servicios/Auth.js";
import { useNavigate } from "react-router-dom";

import "../css/Categorias.css";

export function GestionCategorias() {
  const [vista, setVista] = useState("categorias"); // categorias | subcategorias
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [usuario, setUsuario] = useState(null);

  // Modales para crear/editar
  const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);
  const [mostrarModalSubcategoria, setMostrarModalSubcategoria] =
    useState(false);

  // Datos para edición
  const [categoriaEditar, setCategoriaEditar] = useState(null);
  const [subcategoriaEditar, setSubcategoriaEditar] = useState(null);

  const navigate = useNavigate();
  useVerificarSesion({ setUsuario, setModalData, navigate });

  // Cargar categorías
  const cargarCategorias = async () => {
    const data = await Getdata("categorias");
    // console.log("Categorias cargadas:", data);
    if (data?.showModal) {
      setModalData(data.modal);
    }
    setCategorias(Array.isArray(data) ? data : []);
  };

  // Cargar subcategorías
  const cargarSubcategorias = async () => {
    const data = await Getdata("subcategorias");

    if (data?.showModal) {
      setModalData(data.modal);
    }

    //  AQUÍ ESTÁ LA CLAVE
    setSubcategorias(
      Array.isArray(data?.subcategorias) ? data.subcategorias : []
    );
  };

  useEffect(() => {
    if (usuario?.id) {
      cargarCategorias();
      cargarSubcategorias();
    }
  }, [usuario]);

  // ========== CATEGORÍAS ==========

  const abrirModalCategoria = (categoria = null) => {
    setCategoriaEditar(categoria ? { ...categoria } : { nombre: "" });
    setMostrarModalCategoria(true);
  };

  const guardarCategoria = async () => {
    if (!categoriaEditar.nombre || categoriaEditar.nombre.trim() === "") {
      setModalData({
        title: "Error",
        message: "El nombre de la categoría es obligatorio",
        type: "error",
      });
      return;
    }

    try {
      let resultado;

      if (categoriaEditar.id) {
        // si tiene id, estamos editando
        // Editar
        resultado = await Putdata(`categorias/Editar/${categoriaEditar.id}`, {
          nombre: categoriaEditar.nombre.trim(),
          fecha_actualizacion: new Date().toISOString(),
        });
      } else {
        // Crear
        resultado = await Postdata("categorias/Crear", {
          nombre: categoriaEditar.nombre.trim(),
          fecha_creacion: new Date().toISOString(),
        });
      }

      if (resultado?.showModal) {
        setModalData(resultado.modal);
        if (resultado.modal.type === "success") {
          setMostrarModalCategoria(false);
          setCategoriaEditar(null);
          cargarCategorias();
        }
      }
    } catch (error) {
      console.error("Error al guardar categoría:", error);
    }
  };

  const eliminarCategoria = async (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de eliminar esta categoría? Se eliminarán también sus subcategorías."
    );
    if (!confirmar) return;

    const resultado = await Deletedata(`categorias/Eliminar/${id}`);
    if (resultado?.showModal) {
      setModalData(resultado.modal);
      if (resultado.modal.type === "success") {
        cargarCategorias();
        cargarSubcategorias();
      }
    }
  };

  // ========== SUBCATEGORÍAS ==========

  const abrirModalSubcategoria = (subcategoria = null) => {
    setSubcategoriaEditar(
      subcategoria
        ? { ...subcategoria }
        : {
            subcategoria: "",
            categoria_id: "",
            parent_id: null,
          }
    );
    setMostrarModalSubcategoria(true);
  };

  const guardarSubcategoria = async () => {
    if (
      !subcategoriaEditar.subcategoria ||
      subcategoriaEditar.subcategoria.trim() === ""
    ) {
      setModalData({
        title: "Error",
        message: "El nombre de la subcategoría es obligatorio",
        type: "error",
      });
      return;
    }

    if (!subcategoriaEditar.categoria_id) {
      setModalData({
        title: "Error",
        message: "Debes seleccionar una categoría padre",
        type: "error",
      });
      return;
    }

    try {
      let resultado;

      if (subcategoriaEditar.id) {
        // Editar
        resultado = await Putdata(`subcategorias/Editar/${subcategoriaEditar.id}`, {
          subcategoria: subcategoriaEditar.subcategoria.trim(),
          categoria_id: subcategoriaEditar.categoria_id,
          parent_id: subcategoriaEditar.parent_id || null,
          fecha_actualizacion: new Date().toISOString(),
        });
      } else {
        // Crear
        resultado = await Postdata("subcategorias/Crear", {
          subcategoria: subcategoriaEditar.subcategoria.trim(),
          categoria_id: subcategoriaEditar.categoria_id,
          parent_id: subcategoriaEditar.parent_id || null,
          fecha_creacion: new Date().toISOString(),
        });
      }

      if (resultado?.showModal) {
        setModalData(resultado.modal);
        if (resultado.modal.type === "success") {
          setMostrarModalSubcategoria(false);
          setSubcategoriaEditar(null);
          cargarSubcategorias();
        }
      }
    } catch (error) {
      console.error("Error al guardar subcategoría:", error);
    }
  };

  const eliminarSubcategoria = async (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de eliminar esta subcategoría?"
    );
    if (!confirmar) return;

    const resultado = await Deletedata(`subcategorias/Eliminar/${id}`);
    if (resultado?.showModal) {
      setModalData(resultado.modal);
      if (resultado.modal.type === "success") {
        cargarSubcategorias();
      }
    }
  };

  // Obtener nombre de categoría por ID
  const getNombreCategoria = (id) => {
    const cat = categorias.find((c) => c.id === id);
    return cat ? cat.nombre : "Sin categoría";
  };

  // Obtener nombre de subcategoría padre por ID
  const getNombreSubcategoriaParent = (id) => {
    if (!id) return "Ninguna";
    const sub = subcategorias.find((s) => s.id === id);
    return sub ? sub.subcategoria : "Sin subcategoría";
  };

  return (
    <div className="panel-categorias">
      <div className="header-categorias">
        <h2>Gestión de Categorías</h2>
      </div>

      {/* Pestañas */}
      <div className="tabs-categorias">
        <button
          className={`tab ${vista === "categorias" ? "tab-activa" : ""}`}
          onClick={() => setVista("categorias")}
        >
          📁 Categorías ({categorias.length})
        </button>
        <button
          className={`tab ${vista === "subcategorias" ? "tab-activa" : ""}`}
          onClick={() => setVista("subcategorias")}
        >
          📂 Subcategorías ({subcategorias.length})
        </button>
      </div>

      {/* ========== VISTA CATEGORÍAS ========== */}
      {vista === "categorias" && (
        <div className="contenido-categorias">
          <div className="acciones-superiores">
            <button className="btn-crear" onClick={() => abrirModalCategoria()}>
              + Nueva Categoría
            </button>
          </div>

          <div className="tabla-container">
            {categorias.length === 0 && (
              <p className="sin-datos">No hay categorías creadas.</p>
            )}

            {categorias.length > 0 && (
              <table className="tabla-categorias">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Subcategorías</th>
                    <th>Fecha creación</th>
                    <th>Fecha Actualizacion</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((cat) => {
                    const numSubcategorias = subcategorias.filter(
                      (s) => s.categoria_id === cat.id
                    ).length;

                    return (
                      <tr key={cat.id}>
                        <td>{cat.id}</td>
                        <td className="nombre-categoria">
                          <strong>{cat.nombre}</strong>
                        </td>
                        <td>
                          <span className="badge-contador">
                            {numSubcategorias}
                          </span>
                        </td>
                        <td>
                          {cat.fecha_creacion
                            ? new Date(cat.fecha_creacion).toLocaleDateString(
                                "es-CO"
                              )
                            : "-"}
                        </td>

                        <td>
                          {cat.fecha_actualizacion
                            ? new Date(
                                cat.fecha_actualizacion
                              ).toLocaleDateString("es-CO")
                            : "-"}
                        </td>
                        <td className="acciones-tabla">
                          <button
                            className="btn-icono btn-editar"
                            onClick={() => abrirModalCategoria(cat)}
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            className="btn-icono btn-eliminar"
                            onClick={() => eliminarCategoria(cat.id)}
                            title="Eliminar"
                            disabled={numSubcategorias > 0}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ========== VISTA SUBCATEGORÍAS ========== */}
      {vista === "subcategorias" && (
        <div className="contenido-subcategorias">
          <div className="acciones-superiores">
            <button
              className="btn-crear"
              onClick={() => abrirModalSubcategoria()}
            >
              + Nueva Subcategoría
            </button>
          </div>

          <div className="tabla-container">
            {subcategorias.length === 0 && (
              <p className="sin-datos">No hay subcategorías creadas.</p>
            )}

            {subcategorias.length > 0 && (
              <table className="tabla-categorias">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Categoría Padre</th>
                    <th>Subcategoría Padre</th>
                    <th>Fecha creación</th>
                    <th>Fecha Actualizacion</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {subcategorias.map((sub) => (
                    <tr key={sub.id}>
                      <td>{sub.id}</td>
                      <td className="nombre-subcategoria">
                        {sub.subcategoria}
                      </td>
                      <td>
                        <span className="badge-categoria">
                          {getNombreCategoria(sub.categoria_id)}
                        </span>
                      </td>
                      <td>
                        {sub.parent_id ? (
                          <span className="badge-parent">
                            {getNombreSubcategoriaParent(sub.parent_id)}
                          </span>
                        ) : (
                          <span className="texto-muted">-</span>
                        )}
                      </td>
                      <td>
                        {sub.fecha_creacion
                          ? new Date(sub.fecha_creacion).toLocaleDateString(
                              "es-CO"
                            )
                          : "-"}
                      </td>
                      <td>
                        {sub.fecha_actualizacion
                          ? new Date(
                              sub.fecha_actualizacion
                            ).toLocaleDateString("es-CO")
                          : "-"}
                      </td>
                      <td className="acciones-tabla">
                        <button
                          className="btn-icono btn-editar"
                          onClick={() => abrirModalSubcategoria(sub)}
                          title="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icono btn-eliminar"
                          onClick={() => eliminarSubcategoria(sub.id)}
                          title="Eliminar"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ========== MODAL CATEGORÍA ========== */}
      {mostrarModalCategoria && categoriaEditar && (
        <div
          className="modal-overlay"
          onClick={() => {
            setMostrarModalCategoria(false);
            setCategoriaEditar(null);
          }}
        >
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <h3>
              {categoriaEditar.id ? "Editar Categoría" : "Nueva Categoría"}
            </h3>

            <div className="form-group">
              <label>Nombre de la categoría *</label>
              <input
                type="text"
                placeholder="Ej: Artesanías, Comidas, Bebidas"
                value={categoriaEditar.nombre}
                onChange={(e) =>
                  setCategoriaEditar({
                    ...categoriaEditar,
                    nombre: e.target.value,
                  })
                }
                maxLength="100"
              />
            </div>

            <div className="modal-acciones">
              <button className="btn-guardar" onClick={guardarCategoria}>
                💾 Guardar
              </button>
              <button
                className="btn-cancelar"
                onClick={() => {
                  setMostrarModalCategoria(false);
                  setCategoriaEditar(null);
                }}
              >
                ✖️ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== MODAL SUBCATEGORÍA ========== */}
      {mostrarModalSubcategoria && subcategoriaEditar && (
        <div
          className="modal-overlay"
          onClick={() => {
            setMostrarModalSubcategoria(false);
            setSubcategoriaEditar(null);
          }}
        >
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <h3>
              {subcategoriaEditar.id
                ? "Editar Subcategoría"
                : "Nueva Subcategoría"}
            </h3>

            <div className="form-group">
              <label>Nombre de la subcategoría *</label>
              <input
                type="text"
                placeholder="Ej: Mochilas, Plato principal, Postres"
                value={subcategoriaEditar.subcategoria}
                onChange={(e) =>
                  setSubcategoriaEditar({
                    ...subcategoriaEditar,
                    subcategoria: e.target.value,
                  })
                }
                maxLength="100"
              />
            </div>

            <div className="form-group">
              <label>Categoría padre *</label>
              <select
                value={subcategoriaEditar.categoria_id}
                onChange={(e) =>
                  setSubcategoriaEditar({
                    ...subcategoriaEditar,
                    categoria_id: parseInt(e.target.value),
                  })
                }
              >
                <option value="">-- Seleccionar categoría --</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}{" "}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Subcategoría padre (opcional)</label>
              <select
                value={subcategoriaEditar.parent_id || ""}
                onChange={(e) =>
                  setSubcategoriaEditar({
                    ...subcategoriaEditar,
                    parent_id: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
              >
                <option value="">-- Ninguna --</option>
                {subcategorias
                  .filter(
                    (sub) =>
                      sub.categoria_id === subcategoriaEditar.categoria_id &&
                      sub.parent_id === null 
                  )
                  .map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.subcategoria}
                    </option>
                  ))}
              </select>
              <small className="helper-text">
                Para crear jerarquías (ej: Comidas → Platos principales →
                Carnes)
              </small>
            </div>

            <div className="modal-acciones">
              <button className="btn-guardar" onClick={guardarSubcategoria}>
                💾 Guardar
              </button>
              <button
                className="btn-cancelar"
                onClick={() => {
                  setMostrarModalSubcategoria(false);
                  setSubcategoriaEditar(null);
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
