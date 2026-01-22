// Checkout.jsx actualizado

import React, { useState, useEffect } from "react";
import { useCarrito } from "../globales/CarritoContext";
import { useVerificarSesion } from "../servicios/Auth";
import { Postdata } from "../servicios/Apis";
import { useNavigate } from "react-router-dom";
import { Modal } from "../componentes/Modal";
import "../css/Checkout.css";

export function Checkout() {
  const { 
    carrito, 
    calcularTotal, 
    vaciarCarrito, 
    compraDirecta, //  NUEVO
    limpiarCompraDirecta //  NUEVO
  } = useCarrito();
  
  const [usuario, setUsuario] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const navigate = useNavigate();

  useVerificarSesion({ 
    setUsuario, 
    setModalData, 
    navigate, 
    sincronizarCarrito: true 
  });

  //  Determinar qué productos mostrar
  const productosCheckout = compraDirecta ? compraDirecta.items : carrito;
  const totalCheckout = compraDirecta ? compraDirecta.total : calcularTotal();

  // Datos de envío
  const [datosEnvio, setDatosEnvio] = useState({
    nombre_completo: "",
    telefono: "",
    direccion: "",
    ciudad: "",
    departamento: "",
    codigo_postal: "",
    notas: "",
  });

  const [metodoPago, setMetodoPago] = useState("mercadopago");

  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Cargar datos del usuario al formulario
  useEffect(() => {
    if (usuario) {
      setDatosEnvio((prev) => ({
        ...prev,
        nombre_completo: usuario.nombre || "",
        telefono: usuario.contacto || "",
        direccion: usuario.direccion || "",
      }));
    }
  }, [usuario]);

  //  Limpiar compra directa al salir del checkout
  useEffect(() => {
    return () => {
      if (compraDirecta) {
        limpiarCompraDirecta();
      }
    };
  }, []);

  // Validaciones
  const validarFormulario = () => {
    if (!datosEnvio.nombre_completo.trim()) {
      setModalData({
        title: "Error",
        message: "El nombre completo es obligatorio",
        type: "error",
      });
      return false;
    }

    if (!datosEnvio.telefono.trim()) {
      setModalData({
        title: "Error",
        message: "El teléfono es obligatorio",
        type: "error",
      });
      return false;
    }

    if (!datosEnvio.direccion.trim()) {
      setModalData({
        title: "Error",
        message: "La dirección es obligatoria",
        type: "error",
      });
      return false;
    }

    if (!datosEnvio.ciudad.trim()) {
      setModalData({
        title: "Error",
        message: "La ciudad es obligatoria",
        type: "error",
      });
      return false;
    }

    return true;
  };

  // Procesar pago
  const procesarPago = async () => {
    if (!validarFormulario()) return;

    if (productosCheckout.length === 0) {
      setModalData({
        title: "Sin productos",
        message: "No hay productos para comprar",
        type: "warning",
      });
      return;
    }

    setProcesando(true);

    try {
      const ordenData = {
        id_usuario: usuario.id,
        items: productosCheckout.map((item) => ({
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          precio_unitario: parseFloat(item.precio),
        })),
        total: totalCheckout,
        datos_envio: datosEnvio,
        metodo_pago: metodoPago,
        es_compra_directa: !!compraDirecta, //  Indicar si es compra directa
      };

      const resultado = await Postdata("pagos/crear-orden", ordenData);

      if (resultado?.url_pago) {
        //  Limpiar carrito o compra directa según corresponda
        if (compraDirecta) {
          limpiarCompraDirecta();
        }
        
        // Redirigir a la pasarela de pago
        window.location.href = resultado.url_pago;
      } else if (resultado?.showModal) {
        setModalData(resultado.modal);
      }
    } catch (error) {
      console.error("Error al procesar pago:", error);
      setModalData({
        title: "Error",
        message: "No se pudo procesar el pago. Intenta nuevamente.",
        type: "error",
      });
    } finally {
      setProcesando(false);
    }
  };

  //  Función para volver al catálogo
  const volverAlCatalogo = () => {
    if (compraDirecta) {
      limpiarCompraDirecta();
    }
    navigate("/marketplace");
  };

  if (!usuario) {
    return (
      <div className="checkout-container">
        <p>Verificando sesión...</p>
      </div>
    );
  }

  if (productosCheckout.length === 0) {
    return (
      <div className="checkout-container">
        <div className="checkout-vacio">
          <h2>🛒 No hay productos para comprar</h2>
          <p>Agrega productos al carrito o selecciona "Comprar ahora"</p>
          <button 
            className="btn-volver-catalogo"
            onClick={volverAlCatalogo}
          >
            Ver productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      {/*  NUEVO: Indicador de tipo de compra */}
      {compraDirecta && (
        <div className="alerta-compra-directa">
          <span>⚡ Compra rápida</span>
          <button 
            className="btn-cancelar-compra-directa"
            onClick={volverAlCatalogo}
          >
            ← Cancelar y volver
          </button>
        </div>
      )}

      <div className="checkout-content">
        {/* Columna izquierda: Formulario */}
        <div className="checkout-form">
          <h2>Datos de envío</h2>

          <div className="form-group">
            <label>Nombre completo *</label>
            <input
              type="text"
              value={datosEnvio.nombre_completo}
              onChange={(e) =>
                setDatosEnvio({ ...datosEnvio, nombre_completo: e.target.value })
              }
              placeholder="Juan Pérez"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Teléfono *</label>
              <input
                type="tel"
                value={datosEnvio.telefono}
                onChange={(e) =>
                  setDatosEnvio({ ...datosEnvio, telefono: e.target.value })
                }
                placeholder="300 123 4567"
              />
            </div>

            <div className="form-group">
              <label>Ciudad *</label>
              <input
                type="text"
                value={datosEnvio.ciudad}
                onChange={(e) =>
                  setDatosEnvio({ ...datosEnvio, ciudad: e.target.value })
                }
                placeholder="Barranquilla"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Dirección completa *</label>
            <input
              type="text"
              value={datosEnvio.direccion}
              onChange={(e) =>
                setDatosEnvio({ ...datosEnvio, direccion: e.target.value })
              }
              placeholder="Calle 50 #23-45, Apto 301"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Departamento</label>
              <input
                type="text"
                value={datosEnvio.departamento}
                onChange={(e) =>
                  setDatosEnvio({ ...datosEnvio, departamento: e.target.value })
                }
                placeholder="Atlántico"
              />
            </div>

            <div className="form-group">
              <label>Código postal</label>
              <input
                type="text"
                value={datosEnvio.codigo_postal}
                onChange={(e) =>
                  setDatosEnvio({ ...datosEnvio, codigo_postal: e.target.value })
                }
                placeholder="080001"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Notas adicionales (opcional)</label>
            <textarea
              value={datosEnvio.notas}
              onChange={(e) =>
                setDatosEnvio({ ...datosEnvio, notas: e.target.value })
              }
              placeholder="Ej: Timbre roto, llamar al llegar"
              rows="3"
            />
          </div>

          <div className="metodos-pago">
            <h3>Método de pago</h3>
            <div className="metodo-opcion">
              <input
                type="radio"
                id="mercadopago"
                name="metodo_pago"
                value="mercadopago"
                checked={metodoPago === "mercadopago"}
                onChange={(e) => setMetodoPago(e.target.value)}
              />
              <label htmlFor="mercadopago">
                <span className="metodo-nombre">Mercado Pago</span>
                <span className="metodo-descripcion">
                  Tarjetas, PSE, efectivo
                </span>
              </label>
            </div>

            <div className="metodo-opcion">
              <input
                type="radio"
                id="stripe"
                name="metodo_pago"
                value="stripe"
                checked={metodoPago === "stripe"}
                onChange={(e) => setMetodoPago(e.target.value)}
              />
              <label htmlFor="stripe">
                <span className="metodo-nombre">Stripe</span>
                <span className="metodo-descripcion">
                  Tarjetas internacionales
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Columna derecha: Resumen */}
        <div className="checkout-resumen">
          <h2>Resumen del pedido</h2>

          <div className="resumen-items">
            {productosCheckout.map((item) => (
              <div key={item.id_producto} className="resumen-item">
                <div className="item-imagen">
                  {item.imagen_url ? (
                    <img
                      src={`${BASE_URL}${item.imagen_url}`}
                      alt={item.nombre}
                    />
                  ) : (
                    <div className="sin-imagen">📦</div>
                  )}
                </div>
                <div className="item-info">
                  <h4>{item.nombre}</h4>
                  <p>Cantidad: {item.cantidad}</p>
                </div>
                <div className="item-precio">
                  ${new Intl.NumberFormat("es-CO").format(
                    parseFloat(item.precio) * item.cantidad
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="resumen-totales">
            <div className="total-linea">
              <span>Subtotal:</span>
              <span>
                ${new Intl.NumberFormat("es-CO").format(totalCheckout)}
              </span>
            </div>
            <div className="total-linea">
              <span>Envío:</span>
              <span>A calcular</span>
            </div>
            <div className="total-linea total-final">
              <span>Total:</span>
              <span>
                ${new Intl.NumberFormat("es-CO").format(totalCheckout)}
              </span>
            </div>
          </div>

          <button
            className="btn-pagar"
            onClick={procesarPago}
            disabled={procesando}
          >
            {procesando ? "Procesando..." : "Proceder al pago"}
          </button>

          <p className="mensaje-seguridad">
            🔒 Pago seguro. Tus datos están protegidos.
          </p>
        </div>
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