import React from "react";
import { useCarrito } from "../globales/CarritoContext";
import "../css/BotonCarrito.css";

export function BotonCarrito() {
  const { calcularCantidadTotal, setMostrarCarrito } = useCarrito();

  const cantidadTotal = calcularCantidadTotal();

  return (
    <button
      className="boton-carrito-flotante"
      onClick={() => setMostrarCarrito(true)}
      title="Ver carrito"
    >
      <span className="icono-carrito">🛒</span>
      {cantidadTotal > 0 && (
        <span className="badge-cantidad">{cantidadTotal}</span>
      )}
    </button>
  );
}