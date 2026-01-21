import React, { useEffect, useState } from "react";
import { Getdata } from "../servicios/Apis.js";
import { Modal } from "../componentes/Modal.jsx";
import { useCarrito } from "../globales/CarritoContext";

import { useVerificarSesion } from "../servicios/Auth.js";
import { Carrito } from "../componentes/Carrito";
import { BotonCarrito } from "../componentes/BotonCarrito";
import { Resenas } from "../componentes/Reseñas";
import { useNavigate } from "react-router-dom";
import "../css/Catalogos.css";

export function Catalogo() {
  const { agregarAlCarrito, iniciarCompraDirecta } = useCarrito(); //  Agregar iniciarCompraDirecta
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [subcategorias, setSubcategorias] = useState([]);
  const [negocios, setNegocios] = useState([]);
  const [modalData, setModalData] = useState(null);

  const navigate = useNavigate();

  //  AGREGAR ESTADO DEL USUARIO
  const [usuario, setUsuario] = useState(null);
  const noRedirect = true; // Evitar redirección al login en el catálogo
  useVerificarSesion({ setUsuario, setModalData: setModalData, navigate, noRedirect, sincronizarCarrito: true });

  // Filtros
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroSubcategoria, setFiltroSubcategoria] = useState("");
  const [filtroNegocio, setFiltroNegocio] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [ordenamiento, setOrdenamiento] = useState("recientes");

  // Modal de producto
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [mostrarModalProducto, setMostrarModalProducto] = useState(false);
  const [cantidad, setCantidad] = useState(1);

  // si el entorno es prodction
  const BASE_URL =
    import.meta.env.VITE_NODE_ENV === "production"
      ? import.meta.env.VITE_URL_FRONTEND
      : import.meta.env.VITE_API_URL;



  // Cargar datos
  const cargarProductos = async () => {
    const data = await Getdata("productos/publicos");
    setProductos(Array.isArray(data) ? data : []);
  };

  const cargarCategorias = async () => {
    const data = await Getdata("categorias/publicas");
    setCategorias(Array.isArray(data) ? data : []);
  };

  const cargarSubcategorias = async () => {
    const data = await Getdata("subcategorias/publicas");
    if (data?.subcategorias) {
      setSubcategorias(
        Array.isArray(data.subcategorias) ? data.subcategorias : []
      );
    } else {
      setSubcategorias([]);
    }
  };

  const cargarNegocios = async () => {
    const data = await Getdata("negocios/publicos");
    setNegocios(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
    cargarSubcategorias();
    cargarNegocios();
  }, []);

  // Obtener nombres
  const getNombreCategoria = (id) => {
    const cat = categorias.find((c) => c.id === id);
    return cat ? cat.nombre : "Sin categoría";
  };

  const getNombreSubcategoria = (id) => {
    const sub = subcategorias.find((s) => s.id === id);
    return sub ? sub.subcategoria : "Sin subcategoría";
  };

  const getNombreNegocio = (id) => {
    const neg = negocios.find((n) => n.id_negocio === id);
    return neg ? neg.nombre : "Sin negocio";
  };

  // Filtrar y ordenar productos
  const productosFiltrados = productos
    .filter((prod) => {
      // Filtrar solo productos con stock disponible
      if (prod.stock <= 0) return false;

      const cumpleBusqueda = prod.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase());
      const cumpleCategoria =
        !filtroCategoria || prod.categoria_id === parseInt(filtroCategoria);
      const cumpleSubcategoria =
        !filtroSubcategoria ||
        prod.subcategoria_id === parseInt(filtroSubcategoria);
      const cumpleNegocio =
        !filtroNegocio || prod.id_negocio === parseInt(filtroNegocio);

      return (
        cumpleBusqueda && cumpleCategoria && cumpleSubcategoria && cumpleNegocio
      );
    })
    .sort((a, b) => {
      switch (ordenamiento) {
        case "precio-asc":
          return parseFloat(a.precio) - parseFloat(b.precio);
        case "precio-desc":
          return parseFloat(b.precio) - parseFloat(a.precio);
        case "nombre":
          return a.nombre.localeCompare(b.nombre);
        case "recientes":
        default:
          return b.id_producto - a.id_producto;
      }
    });

  // Abrir modal de producto
  const verDetalleProducto = (producto) => {
    setProductoSeleccionado(producto);
    setCantidad(1);
    setMostrarModalProducto(true);
  };

  // Agregar al carrito (actualizado)
  const agregarAlCarritoHandler = () => {
    if (cantidad > productoSeleccionado.stock) {
      setModalData({
        title: "Stock insuficiente",
        message: `Solo hay ${productoSeleccionado.stock} unidades disponibles.`,
        type: "warning",
      });
      return;
    }

    agregarAlCarrito(productoSeleccionado, cantidad);

    setModalData({
      title: "¡Agregado al carrito!",
      message: `${cantidad} ${cantidad === 1 ? "unidad" : "unidades"} de "${
        productoSeleccionado.nombre
      }" agregadas al carrito.`,
      type: "success",
    });

    setMostrarModalProducto(false);
    setProductoSeleccionado(null);
  };

  // Comprar ahora (simulado)
  const comprarAhora = () => {
    if (cantidad > productoSeleccionado.stock) {
      setModalData({
        title: "Stock insuficiente",
        message: `Solo hay ${productoSeleccionado.stock} unidades disponibles.`,
        type: "warning",
      });
      return;
    }

    //  Verificar si hay sesión
    if (!usuario || !usuario.id) {
      setModalData({
        title: "Inicia sesión",
        message: "Debes iniciar sesión para continuar con la compra.",
        type: "warning",
      });
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }

    //  Iniciar compra directa
    iniciarCompraDirecta(productoSeleccionado, cantidad);
    
    //  Redirigir al checkout
    navigate("/checkout");
    
    // Cerrar modal
    setMostrarModalProducto(false);
    setProductoSeleccionado(null);
  };


  return (
    <div className="catalogo-container">
      {/* Header del catálogo */}
      <div className="catalogo-header">
        <h1>🛍️ Nuestros Productos</h1>
        <p className="catalogo-subtitle">
          Encuentra los mejores productos artesanales y gastronómicos
        </p>
      </div>

      {/* Barra de filtros y búsqueda */}
      <div className="filtros-catalogo">
        <div className="filtros-grupo">
          <input
            type="text"
            placeholder="🔍 Buscar productos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input-busqueda-catalogo"
          />

          <select
            value={filtroCategoria}
            onChange={(e) => {
              setFiltroCategoria(e.target.value);
              setFiltroSubcategoria("");
            }}
            className="select-filtro-catalogo"
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
            className="select-filtro-catalogo"
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

          <select
            value={filtroNegocio}
            onChange={(e) => setFiltroNegocio(e.target.value)}
            className="select-filtro-catalogo"
          >
            <option value="">Todos los negocios</option>
            {negocios.map((neg) => (
              <option key={neg.id_negocio} value={neg.id_negocio}>
                {neg.nombre}
              </option>
            ))}
          </select>

          <select
            value={ordenamiento}
            onChange={(e) => setOrdenamiento(e.target.value)}
            className="select-filtro-catalogo"
          >
            <option value="recientes">Más recientes</option>
            <option value="precio-asc">Precio: Menor a Mayor</option>
            <option value="precio-desc">Precio: Mayor a Menor</option>
            <option value="nombre">Nombre A-Z</option>
          </select>
        </div>

        {(busqueda ||
          filtroCategoria ||
          filtroSubcategoria ||
          filtroNegocio) && (
          <button
            className="btn-limpiar-catalogo"
            onClick={() => {
              setBusqueda("");
              setFiltroCategoria("");
              setFiltroSubcategoria("");
              setFiltroNegocio("");
            }}
          >
            ✖️ Limpiar filtros
          </button>
        )}
      </div>

      {/* Contador de productos */}
      <div className="contador-productos">
        <p>
          Mostrando <strong>{productosFiltrados.length}</strong>{" "}
          {productosFiltrados.length === 1 ? "producto" : "productos"}
        </p>
      </div>

      {/* Grid de productos */}
      <div className="catalogo-grid">
        {productosFiltrados.length === 0 && (
          <div className="sin-productos-catalogo">
            <div className="sin-productos-icon">📦</div>
            <h3>No se encontraron productos</h3>
            <p>
              {busqueda ||
              filtroCategoria ||
              filtroSubcategoria ||
              filtroNegocio
                ? "Intenta ajustar los filtros de búsqueda"
                : "No hay productos disponibles en este momento"}
            </p>
          </div>
        )}

        {productosFiltrados.map((prod) => (
          <div key={prod.id_producto} className="producto-catalogo-card">
            <div className="producto-catalogo-imagen">
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
                className="sin-imagen-catalogo"
                style={{ display: prod.imagen_url ? "none" : "flex" }}
              >
                📦
              </div>

              {prod.stock <= 5 && prod.stock > 0 && (
                <div className="badge-stock-bajo">¡Últimas unidades!</div>
              )}
            </div>

            <div className="producto-catalogo-info">
              <div className="producto-catalogo-badges">
                <span className="badge-catalogo categoria">
                  {getNombreCategoria(prod.categoria_id)}
                </span>
                {prod.id_negocio && (
                  <span className="badge-catalogo negocio">
                    {getNombreNegocio(prod.id_negocio)}
                  </span>
                )}
              </div>

              <h3 className="producto-catalogo-nombre">{prod.nombre}</h3>

              {prod.descripcion && (
                <p className="producto-catalogo-descripcion">
                  {prod.descripcion.length > 80
                    ? `${prod.descripcion.substring(0, 80)}...`
                    : prod.descripcion}
                </p>
              )}

              <div className="producto-catalogo-footer">
                <div className="producto-catalogo-precio">
                  <span className="precio-label">Precio:</span>
                  <span className="precio-valor">
                    ${new Intl.NumberFormat("es-CO").format(prod.precio)}
                  </span>
                </div>

                <button
                  className="btn-ver-detalle"
                  onClick={() => verDetalleProducto(prod)}
                >
                  Ver detalles
                </button>
              </div>

              <div className="producto-catalogo-stock">
                <span className={prod.stock <= 5 ? "stock-bajo" : "stock-ok"}>
                  {prod.stock} disponibles
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de detalle del producto */}
      {mostrarModalProducto && productoSeleccionado && (
        <div
          className="modal-overlay"
          onClick={() => {
            setMostrarModalProducto(false);
            setProductoSeleccionado(null);
          }}
        >
          <div
            className="modal-detalle-producto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="btn-cerrar-modal"
              onClick={() => {
                setMostrarModalProducto(false);
                setProductoSeleccionado(null);
              }}
            >
              ✖️
            </button>

            <div className="modal-detalle-contenido">
              {/*  SECCIÓN SUPERIOR: Imagen + Info en grid */}
              <div className="modal-producto-superior">
                <div className="modal-detalle-imagen">
                  {productoSeleccionado.imagen_url ? (
                    <img
                      src={`${BASE_URL}${productoSeleccionado.imagen_url}`}
                      alt={productoSeleccionado.nombre}
                    />
                  ) : (
                    <div className="sin-imagen-modal">📦</div>
                  )}
                </div>

                <div className="modal-detalle-info">
                  <div className="modal-badges">
                    <span className="badge-modal categoria">
                      {getNombreCategoria(productoSeleccionado.categoria_id)}
                    </span>
                    <span className="badge-modal subcategoria">
                      {getNombreSubcategoria(
                        productoSeleccionado.subcategoria_id
                      )}
                    </span>
                    {productoSeleccionado.id_negocio && (
                      <span className="badge-modal negocio">
                        🏪 {getNombreNegocio(productoSeleccionado.id_negocio)}
                      </span>
                    )}
                  </div>

                  <h2 className="modal-titulo">
                    {productoSeleccionado.nombre}
                  </h2>

                  <div className="modal-precio">
                    <span className="precio-grande">
                      $
                      {new Intl.NumberFormat("es-CO").format(
                        productoSeleccionado.precio
                      )}
                    </span>
                    <span className="precio-cop">COP</span>
                  </div>

                  {productoSeleccionado.descripcion && (
                    <div className="modal-descripcion">
                      <h4>Descripción</h4>
                      <p>{productoSeleccionado.descripcion}</p>
                    </div>
                  )}

                  <div className="modal-stock">
                    <span
                      className={
                        productoSeleccionado.stock <= 5
                          ? "stock-bajo"
                          : "stock-ok"
                      }
                    >
                      {productoSeleccionado.stock <= 5
                        ? `¡Solo quedan ${productoSeleccionado.stock} unidades!`
                        : `${productoSeleccionado.stock} unidades disponibles`}
                    </span>
                  </div>

                  <div className="modal-cantidad">
                    <label>Cantidad:</label>
                    <div className="cantidad-selector">
                      <button
                        onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                        disabled={cantidad <= 1}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={cantidad}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          setCantidad(
                            Math.min(
                              productoSeleccionado.stock,
                              Math.max(1, val)
                            )
                          );
                        }}
                        min="1"
                        max={productoSeleccionado.stock}
                      />
                      <button
                        onClick={() =>
                          setCantidad(
                            Math.min(productoSeleccionado.stock, cantidad + 1)
                          )
                        }
                        disabled={cantidad >= productoSeleccionado.stock}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="modal-total">
                    <span>Total:</span>
                    <span className="total-precio">
                      $
                      {new Intl.NumberFormat("es-CO").format(
                        productoSeleccionado.precio * cantidad
                      )}
                    </span>
                  </div>

                  <div className="modal-acciones">
                    <button
                      className="btn-agregar-carrito"
                      onClick={agregarAlCarritoHandler}
                    >
                      🛒 Agregar al carrito
                    </button>
                    <button
                      className="btn-comprar-ahora"
                      onClick={comprarAhora}
                    >
                      💳 Comprar ahora
                    </button>
                  </div>
                </div>
              </div>

              {/*  SECCIÓN INFERIOR: Reseñas ocupan todo el ancho */}
              <div className="seccion-resenas-modal">
                <Resenas
                  id_producto={productoSeleccionado.id_producto}
                  usuario={usuario}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <Carrito />
      <BotonCarrito />

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
