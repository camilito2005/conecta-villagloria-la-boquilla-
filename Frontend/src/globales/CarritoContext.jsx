import React, { createContext, useContext, useState, useEffect } from "react";

const CarritoContext = createContext();

export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  }
  return context;
};

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);

  // Cargar carrito del localStorage al iniciar
  useEffect(() => {
    const carritoGuardado = localStorage.getItem("carrito");
    if (carritoGuardado) {
      try {
        setCarrito(JSON.parse(carritoGuardado));
      } catch (error) {
        console.error("Error al cargar carrito:", error);
        localStorage.removeItem("carrito");
      }
    }
  }, []);

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    if (carrito.length > 0) {
      localStorage.setItem("carrito", JSON.stringify(carrito));
    } else {
      localStorage.removeItem("carrito");
    }
  }, [carrito]);

  // Agregar producto al carrito
  const agregarAlCarrito = (producto, cantidad = 1) => {
    setCarrito((prevCarrito) => {
      const productoExistente = prevCarrito.find(
        (item) => item.id_producto === producto.id_producto
      );

      if (productoExistente) {
        // Si ya existe, aumentar la cantidad
        return prevCarrito.map((item) =>
          item.id_producto === producto.id_producto
            ? {
                ...item,
                cantidad: Math.min(
                  item.cantidad + cantidad,
                  producto.stock
                ),
              }
            : item
        );
      } else {
        // Si no existe, agregar nuevo
        return [
          ...prevCarrito,
          {
            ...producto,
            cantidad: Math.min(cantidad, producto.stock),
          },
        ];
      }
    });
  };

  // Eliminar producto del carrito
  const eliminarDelCarrito = (id_producto) => {
    setCarrito((prevCarrito) =>
      prevCarrito.filter((item) => item.id_producto !== id_producto)
    );
  };

  // Actualizar cantidad de un producto
  const actualizarCantidad = (id_producto, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(id_producto);
      return;
    }

    setCarrito((prevCarrito) =>
      prevCarrito.map((item) =>
        item.id_producto === id_producto
          ? {
              ...item,
              cantidad: Math.min(nuevaCantidad, item.stock),
            }
          : item
      )
    );
  };

  // Vaciar carrito
  const vaciarCarrito = () => {
    setCarrito([]);
  };

  // Calcular total
  const calcularTotal = () => {
    return carrito.reduce(
      (total, item) => total + parseFloat(item.precio) * item.cantidad,
      0
    );
  };

  // Calcular cantidad total de items
  const calcularCantidadTotal = () => {
    return carrito.reduce((total, item) => total + item.cantidad, 0);
  };

  // Verificar si un producto está en el carrito
  const estaEnCarrito = (id_producto) => {
    return carrito.some((item) => item.id_producto === id_producto);
  };

  // Obtener cantidad de un producto en el carrito
  const obtenerCantidadEnCarrito = (id_producto) => {
    const item = carrito.find((item) => item.id_producto === id_producto);
    return item ? item.cantidad : 0;
  };

  const value = {
    carrito,
    agregarAlCarrito,
    eliminarDelCarrito,
    actualizarCantidad,
    vaciarCarrito,
    calcularTotal,
    calcularCantidadTotal,
    estaEnCarrito,
    obtenerCantidadEnCarrito,
    mostrarCarrito,
    setMostrarCarrito,
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
}