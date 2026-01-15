import React from "react";
import { useCarrito } from "../globales/CarritoContext.jsx";
import "../css/Carrito.css";
import { useNavigate } from "react-router-dom";

export function Carrito() {
  const {
    carrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    calcularTotal,
    calcularCantidadTotal,
    mostrarCarrito,
    setMostrarCarrito,
  } = useCarrito();

  const navigate = useNavigate(); // ✅ Hook para navegación
  const BASE_URL = "http://localhost:3000";

  const handleCheckout = () => {
    // Aquí iría la lógica de checkout/pago
    // alert("Redirigiendo al proceso de pago...");
    // redirijo a la pagina de checkout
    setMostrarCarrito(false);
    navigate("/Checkout"); // ✅ Uso correcto de navigate
  };

  if (!mostrarCarrito) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="carrito-overlay"
        onClick={() => setMostrarCarrito(false)}
      />

      {/* Panel del carrito */}
      <div className="carrito-panel">
        <div className="carrito-header">
          <h2>🛒 Mi Carrito</h2>
          <button
            className="btn-cerrar-carrito"
            onClick={() => setMostrarCarrito(false)}
          >
            ✖️
          </button>
        </div>

        {carrito.length === 0 ? (
          <div className="carrito-vacio">
            <div className="carrito-vacio-icon">🛒</div>
            <h3>Tu carrito está vacío</h3>
            <p>Agrega productos para comenzar tu compra</p>
          </div>
        ) : (
          <>
            <div className="carrito-items">
              {carrito.map((item) => (
                <div key={item.id_producto} className="carrito-item">
                  <div className="carrito-item-imagen">
                    {item.imagen_url ? (
                      <img
                        src={`${BASE_URL}${item.imagen_url}`}
                        alt={item.nombre}
                      />
                    ) : (
                      <div className="sin-imagen-carrito">📦</div>
                    )}
                  </div>

                  <div className="carrito-item-info">
                    <h4 className="carrito-item-nombre">{item.nombre}</h4>
                    <p className="carrito-item-precio">
                      ${new Intl.NumberFormat("es-CO").format(item.precio)}
                    </p>

                    <div className="carrito-item-cantidad">
                      <button
                        onClick={() =>
                          actualizarCantidad(
                            item.id_producto,
                            item.cantidad - 1
                          )
                        }
                        disabled={item.cantidad <= 1}
                      >
                        −
                      </button>
                      <span>{item.cantidad}</span>
                      <button
                        onClick={() =>
                          actualizarCantidad(
                            item.id_producto,
                            item.cantidad + 1
                          )
                        }
                        disabled={item.cantidad >= item.stock}
                      >
                        +
                      </button>
                    </div>

                    {item.cantidad >= item.stock && (
                      <small className="stock-maximo">
                        Stock máximo alcanzado
                      </small>
                    )}
                  </div>

                  <div className="carrito-item-subtotal">
                    <p className="subtotal-label">Subtotal:</p>
                    <p className="subtotal-valor">
                      $
                      {new Intl.NumberFormat("es-CO").format(
                        item.precio * item.cantidad
                      )}
                    </p>
                    <button
                      className="btn-eliminar-item"
                      onClick={() => eliminarDelCarrito(item.id_producto)}
                      title="Eliminar producto"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="carrito-footer">
              <div className="carrito-resumen">
                <div className="resumen-linea">
                  <span>Productos ({calcularCantidadTotal()}):</span>
                  <span>
                    ${new Intl.NumberFormat("es-CO").format(calcularTotal())}
                  </span>
                </div>
                <div className="resumen-linea envio">
                  <span>Envío:</span>
                  <span>A calcular</span>
                </div>
                <div className="resumen-linea total">
                  <span>Total:</span>
                  <span>
                    ${new Intl.NumberFormat("es-CO").format(calcularTotal())}
                  </span>
                </div>
              </div>

              <button className="btn-checkout" onClick={handleCheckout}>
                💳 Proceder al pago
              </button>

              <button className="btn-vaciar-carrito" onClick={vaciarCarrito}>
                🗑️ Vaciar carrito
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
