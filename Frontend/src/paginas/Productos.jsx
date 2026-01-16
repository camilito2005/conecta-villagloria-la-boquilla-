import React, { useEffect, useState } from "react";
import {
  Getdata,
  PostFormData,
  PutFormData,
  Deletedata,
} from "../servicios/Apis.js";
import { Modal } from "../componentes/Modal.jsx";
import { useVerificarSesion } from "../servicios/Auth.js";
import { useNavigate } from "react-router-dom";

import "../css/Productos.css";

export function GestionProductos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [modalData, setModalData] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [negocios, setNegocios] = useState([]);

  // Modal para crear/editar
  const [mostrarModalProducto, setMostrarModalProducto] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);

  //  NUEVO: Estados para manejo de imagen
  const [imagenPreview, setImagenPreview] = useState(null);
  const [archivoImagen, setArchivoImagen] = useState(null);

  // Filtros
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroSubcategoria, setFiltroSubcategoria] = useState("");
  const [busqueda, setBusqueda] = useState("");

  const navigate = useNavigate();
  useVerificarSesion({ setUsuario, setModalData, navigate });

  const id_usuario = usuario?.id;

  // URL base del backend
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Cargar datos iniciales
  const cargarProductos = async () => {
    const data = await Getdata(`productos/usuario/${id_usuario}`);
    if (data?.showModal) {
      setModalData(data.modal);
    }
    setProductos(Array.isArray(data) ? data : []);
  };

  const cargarCategorias = async () => {
    const data = await Getdata("categorias");
    setCategorias(Array.isArray(data) ? data : []);
  };

  const cargarSubcategorias = async () => {
    const data = await Getdata("subcategorias");
    if (data?.subcategorias) {
      setSubcategorias(
        Array.isArray(data.subcategorias) ? data.subcategorias : []
      );
    } else {
      setSubcategorias([]);
    }
  };

  const CargarNegocios = async () => {
    const data = await Getdata(`negocios/usuario/${id_usuario}`);

    setNegocios(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (usuario?.id) {
      cargarProductos();
      cargarCategorias();
      cargarSubcategorias();
      CargarNegocios();
    }
  }, [usuario]);

  // Filtrar subcategorías por categoría seleccionada
  const subcategoriasFiltradas = productoEditar?.categoria_id //  Verificar que exista categoría seleccionada
    ? subcategorias.filter(
        (s) => s.categoria_id === productoEditar.categoria_id
      ) // Filtrar si existe categoría seleccionada
    : []; // Si no hay categoría seleccionada, devolver array vacío

  // Obtener nombre de categoría
  const getNombreCategoria = (id) => {
    const cat = categorias.find((c) => c.id === id);
    return cat ? cat.nombre : "Sin categoría";
  };

  // Obtener nombre de subcategoría
  const getNombreSubcategoria = (id) => {
    const sub = subcategorias.find((s) => s.id === id);
    return sub ? sub.subcategoria : "Sin subcategoría";
  };

  const manejarImagenSeleccionada = (e) => {
    const archivo = e.target.files[0];

    if (!archivo) {
      setArchivoImagen(null);
      setImagenPreview(null);
      return;
    }

    // Validar tipo de archivo
    const tiposPermitidos = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    if (!tiposPermitidos.includes(archivo.type)) {
      setModalData({
        title: "Archivo no válido",
        message: "Solo se permiten imágenes JPG, PNG o WEBP",
        type: "error",
      });
      return;
    }

    // Validar tamaño (5MB máximo)
    const tamañoMaximo = 5 * 1024 * 1024; // 5MB
    if (archivo.size > tamañoMaximo) {
      setModalData({
        title: "Archivo muy grande",
        message: "La imagen no puede superar los 5MB",
        type: "error",
      });
      return;
    }

    setArchivoImagen(archivo);

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagenPreview(reader.result);
    };
    reader.readAsDataURL(archivo);
  };

  // Abrir modal para crear/editar
  const abrirModalProducto = (producto = null) => {
    setProductoEditar(
      producto
        ? { ...producto,
          tipo_negocio: producto.id_negocio || ""
         }
        : {
            nombre: "",
            precio: "",
            stock: "",
            categoria_id: "",
            subcategoria_id: "",
            descripcion: "",
            imagen_url: "",
            tipo_negocio: "",
          }
    );

    //  Si estamos editando y hay imagen, mostrar preview
    if (producto?.imagen_url) {
      setImagenPreview(`${BASE_URL}${producto.imagen_url}`);
    } else {
      setImagenPreview(null);
    }

    setArchivoImagen(null);
    setMostrarModalProducto(true);
  };

  //  Guardar producto con FormData para enviar imagen
  const guardarProducto = async () => {
    // Validaciones
    if (!productoEditar.nombre || productoEditar.nombre.trim() === "") {
      setModalData({
        title: "Error",
        message: "El nombre del producto es obligatorio",
        type: "error",
      });
      return;
    }

    if (!productoEditar.precio || parseFloat(productoEditar.precio) <= 0) {
      setModalData({
        title: "Error",
        message: "El precio debe ser mayor a 0",
        type: "error",
      });
      return;
    }

    if (!productoEditar.stock || parseInt(productoEditar.stock) < 0) {
      setModalData({
        title: "Error",
        message: "El stock no puede ser negativo",
        type: "error",
      });
      return;
    }

    if (!productoEditar.categoria_id) {
      setModalData({
        title: "Error",
        message: "Debes seleccionar una categoría",
        type: "error",
      });
      return;
    }

    if (!productoEditar.subcategoria_id) {
      setModalData({
        title: "Error",
        message: "Debes seleccionar una subcategoría",
        type: "error",
      });
      return;
    }

    try {
      //  Crear FormData para enviar imagen
      const formData = new FormData();
      formData.append("nombre", productoEditar.nombre.trim());
      formData.append("precio", parseFloat(productoEditar.precio));
      formData.append("stock", parseInt(productoEditar.stock));
      formData.append("categoria_id", productoEditar.categoria_id);
      formData.append("subcategoria_id", productoEditar.subcategoria_id);
      formData.append("descripcion", productoEditar.descripcion?.trim() || "");
      formData.append("tipo_negocio", productoEditar.tipo_negocio || "");
      formData.append("id_usuario", id_usuario);

      //  Si hay nueva imagen, agregarla
      if (archivoImagen) {
        formData.append("imagen", archivoImagen);
      }

      //  Si estamos editando y NO hay nueva imagen, enviar la URL actual
      if (
        productoEditar.id_producto &&
        !archivoImagen &&
        productoEditar.imagen_url
      ) {
        formData.append("imagen_url_actual", productoEditar.imagen_url);
      }

      let resultado;

      if (productoEditar.id_producto) {
        // Editar

        const resultado = await PutFormData(
          `productos/editar/${productoEditar.id_producto}`,
          formData,
          // true // Indicar que es FormData
        );
        if (resultado?.showModal) {
          setModalData(resultado.modal);

          if (resultado.modal.type === "success") {
            setMostrarModalProducto(false);
            setProductoEditar(null);
            setImagenPreview(null);
            setArchivoImagen(null);
            cargarProductos();
          }
        }
      } else {
        // Crear
        const resultado = await PostFormData("productos/crear", formData);
        //  Verificar si hay error en la respuesta
        if (resultado?.showModal) {
          setModalData(resultado.modal);

          if (resultado.modal.type === "success") {
            setMostrarModalProducto(false);
            setProductoEditar(null);
            setImagenPreview(null);
            setArchivoImagen(null);
            cargarProductos();
          }
          //  Si es error, el modal se muestra automáticamente
        }
      }
    } catch (error) {
      console.error("Error al guardar producto:", error);
      setModalData({
        title: "Error",
        message: "Ocurrió un error al guardar el producto",
        type: "error",
      });
    }
  };

  // Eliminar producto
  const eliminarProducto = async (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de eliminar este producto?"
    );
    if (!confirmar) return;

    const resultado = await Deletedata(`productos/Eliminar/${id}`);
    if (resultado?.showModal) {
      setModalData(resultado.modal);
      if (resultado.modal.type === "success") {
        cargarProductos();
      }
    }
  };

  // Filtrar productos
  const productosFiltrados = productos.filter((prod) => {
    const cumpleBusqueda = prod.nombre
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const cumpleCategoria =
      !filtroCategoria || prod.categoria_id === parseInt(filtroCategoria);
    const cumpleSubcategoria =
      !filtroSubcategoria ||
      prod.subcategoria_id === parseInt(filtroSubcategoria);

    return cumpleBusqueda && cumpleCategoria && cumpleSubcategoria;
  });

  return (
    <div className="panel-productos">
      <div className="header-productos">
        <h2>Mis Productos</h2>
        <button className="btn-crear" onClick={() => abrirModalProducto()}>
          + Nuevo Producto
        </button>
      </div>

      {/* Filtros */}
      <div className="filtros-productos">
        <input
          type="text"
          placeholder="🔍 Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input-busqueda"
        />

        <select
          value={filtroCategoria}
          onChange={(e) => {
            setFiltroCategoria(e.target.value);
            setFiltroSubcategoria("");
          }}
          className="select-filtro"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>

        <select
          value={filtroSubcategoria}
          onChange={(e) => setFiltroSubcategoria(e.target.value)}
          className="select-filtro"
          disabled={!filtroCategoria}
        >
          <option value="">Todas las subcategorías</option>
          {subcategorias
            .filter((s) => s.categoria_id === parseInt(filtroCategoria))
            .map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.subcategoria}
              </option>
            ))}
        </select>

        {(busqueda || filtroCategoria || filtroSubcategoria) && (
          <button
            className="btn-limpiar-filtros"
            onClick={() => {
              setBusqueda("");
              setFiltroCategoria("");
              setFiltroSubcategoria("");
            }}
          >
            ✖️ Limpiar filtros
          </button>
        )}
      </div>

      {/* Lista de productos */}
      <div className="productos-grid">
        {productosFiltrados.length === 0 && (
          <p className="sin-productos">
            {busqueda || filtroCategoria || filtroSubcategoria
              ? "No se encontraron productos con esos filtros."
              : "No tienes productos creados. ¡Crea tu primer producto!"}
          </p>
        )}

        {productosFiltrados.map((prod) => (
          <div key={prod.id_producto} className="producto-card">
            <div className="producto-imagen">
              {prod.imagen_url ? (
                <img
                  src={`${BASE_URL}${prod.imagen_url}`}
                  alt={prod.nombre}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              ) : null}
              <div
                className="sin-imagen"
                style={{ display: prod.imagen_url ? "none" : "flex" }}
              >
                📦
              </div>
            </div>

            <div className="producto-info">
              <h3 className="producto-nombre">{prod.nombre}</h3>

              <div className="producto-detalles">
                <span className="badge-categoria">
                  {getNombreCategoria(prod.categoria_id)}
                </span>
                <span className="badge-subcategoria">
                  {getNombreSubcategoria(prod.subcategoria_id)}
                </span>
              </div>

              {prod.descripcion && (
                <p className="producto-descripcion">{prod.descripcion}</p>
              )}

              <div className="producto-footer">
                <div className="precio-stock">
                  <span className="precio">
                    ${new Intl.NumberFormat("es-CO").format(prod.precio)}
                  </span>
                  <span
                    className={`stock ${prod.stock <= 5 ? "stock-bajo" : ""}`}
                  >
                    Stock: {prod.stock}
                  </span>
                </div>

                <div className="producto-acciones">
                  <button
                    className="btn-icono btn-editar"
                    onClick={() => abrirModalProducto(prod)}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icono btn-eliminar"
                    onClick={() => eliminarProducto(prod.id_producto)}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Crear/Editar Producto */}
      {mostrarModalProducto && productoEditar && (
        <div
          className="modal-overlay"
          onClick={() => {
            setMostrarModalProducto(false);
            setProductoEditar(null);
            setImagenPreview(null);
            setArchivoImagen(null);
          }}
        >
          <div
            className="modal-contenido modal-producto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>
              {productoEditar.id_producto
                ? "Editar Producto"
                : "Nuevo Producto"}
            </h3>

            <div className="form-producto">
              {/*  NUEVO: Sección de imagen */}
              <div className="form-group imagen-upload-container">
                <label>Imagen del producto</label>

                <div className="imagen-upload-area">
                  {imagenPreview ? (
                    <div className="imagen-preview-container">
                      <img
                        src={imagenPreview}
                        alt="Preview"
                        className="imagen-preview"
                      />
                      <button
                        type="button"
                        className="btn-eliminar-preview"
                        onClick={() => {
                          setImagenPreview(null);
                          setArchivoImagen(null);
                          if (productoEditar.id_producto) {
                            setProductoEditar({
                              ...productoEditar,
                              imagen_url: "",
                            });
                          }
                        }}
                      >
                        ✖️ Eliminar imagen
                      </button>
                    </div>
                  ) : (
                    <label className="upload-placeholder">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={manejarImagenSeleccionada}
                        style={{ display: "none" }}
                      />
                      <div className="upload-icon">📷</div>
                      <p>Haz clic para seleccionar una imagen</p>
                      <small>JPG, PNG o WEBP (máx. 5MB)</small>
                    </label>
                  )}
                </div>

                {!imagenPreview && (
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={manejarImagenSeleccionada}
                    className="input-file-alternativo"
                  />
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Nombre del producto *</label>
                  <input
                    type="text"
                    placeholder="Ej: Mochila wayuu, Arepa de huevo"
                    value={productoEditar.nombre}
                    onChange={(e) =>
                      setProductoEditar({
                        ...productoEditar,
                        nombre: e.target.value,
                      })
                    }
                    maxLength="150"
                  />
                </div>

                <div className="form-group">
                  <label>Negocio</label>
                  <select
                    value={productoEditar.tipo_negocio || ""}
                    onChange={(e) =>
                      setProductoEditar({
                        ...productoEditar,
                        tipo_negocio: e.target.value,
                      })
                    }
                  >
                    <option value="">-- Seleccionar negocio --</option>
                    {negocios.map((neg) => (
                      <option key={neg.id_negocio} value={neg.id_negocio}>
                        {neg.nombre}
                      </option>
                    ))}
                  </select>
                  {negocios.length === 0 && (
                    <small className="helper-text" style={{ color: "#f44336" }}>
                      No tienes negocios registrados.{" "}
                      <a
                        href="/negocios"
                        style={{
                          color: "#2196F3",
                          textDecoration: "underline",
                        }}
                      >
                        Crear uno aquí
                      </a>
                    </small>
                  )}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Precio (COP) *</label>
                  <input
                    type="number"
                    placeholder="15000"
                    value={productoEditar.precio}
                    onChange={(e) =>
                      setProductoEditar({
                        ...productoEditar,
                        precio: e.target.value,
                      })
                    }
                    min="0"
                    step="100"
                  />
                </div>

                <div className="form-group">
                  <label>Stock/Disponibilidad *</label>
                  <input
                    type="number"
                    placeholder="10"
                    value={productoEditar.stock}
                    onChange={(e) =>
                      setProductoEditar({
                        ...productoEditar,
                        stock: e.target.value,
                      })
                    }
                    min="0"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Categoría *</label>
                  <select
                    value={productoEditar.categoria_id}
                    onChange={(e) =>
                      setProductoEditar({
                        ...productoEditar,
                        categoria_id: parseInt(e.target.value),
                        subcategoria_id: "",
                      })
                    }
                  >
                    <option value="">-- Seleccionar categoría --</option>
                    {categorias.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Subcategoría *</label>
                  <select
                    value={productoEditar.subcategoria_id}
                    onChange={(e) =>
                      setProductoEditar({
                        ...productoEditar,
                        subcategoria_id: parseInt(e.target.value),
                      })
                    }
                    disabled={!productoEditar.categoria_id}
                  >
                    <option value="">-- Seleccionar subcategoría --</option>
                    {subcategoriasFiltradas.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.subcategoria}
                      </option>
                    ))}
                  </select>
                  {!productoEditar.categoria_id && (
                    <small className="helper-text">
                      Primero selecciona una categoría
                    </small>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Descripción (opcional)</label>
                <textarea
                  placeholder="Describe tu producto..."
                  value={productoEditar.descripcion}
                  onChange={(e) =>
                    setProductoEditar({
                      ...productoEditar,
                      descripcion: e.target.value,
                    })
                  }
                  rows="4"
                  maxLength="500"
                />
              </div>
            </div>

            <div className="modal-acciones">
              <button className="btn-guardar" onClick={guardarProducto}>
                💾 Guardar Producto
              </button>
              <button
                className="btn-cancelar"
                onClick={() => {
                  setMostrarModalProducto(false);
                  setProductoEditar(null);
                  setImagenPreview(null);
                  setArchivoImagen(null);
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
