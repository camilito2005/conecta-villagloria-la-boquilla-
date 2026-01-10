import React, { createContext, useContext, useState, useEffect } from "react";
import { Getdata, Postdata, Putdata, Deletedata } from "../servicios/Apis.js";

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
  const [usuario, setUsuario] = useState(null);

  // ✅ Función para establecer el usuario
  const setUsuarioCarrito = (user) => {
    setUsuario(user);
  };

  // ✅ Determinar si usar localStorage o BD
  const usarBD = usuario && usuario.id;

  // Cargar carrito al iniciar
  useEffect(() => {
    if (usarBD && usuario.id) { // ✅ VALIDACIÓN IMPORTANTE
      // Usuario con sesión: cargar desde BD
      cargarCarritoDesdeDB(usuario.id);
    } else if (!usuario) {
      // Usuario sin sesión: cargar desde localStorage
      const carritoGuardado = localStorage.getItem("carrito");
      if (carritoGuardado) {
        try {
          const carritoParsed = JSON.parse(carritoGuardado);
          setCarrito(carritoParsed);
        } catch (error) {
          console.error("Error al cargar carrito:", error);
          localStorage.removeItem("carrito");
        }
      }
    }
  }, [usuario]); // ✅ Solo depende de usuario

  // Guardar carrito en localStorage cuando NO hay sesión
  useEffect(() => {
    if (!usarBD) {
      if (carrito.length > 0) {
        localStorage.setItem("carrito", JSON.stringify(carrito));
      } else {
        localStorage.removeItem("carrito");
      }
    }
  }, [carrito, usarBD]);

  // ========================================
  // FUNCIONES QUE DETECTAN SI USAR BD O LOCALSTORAGE
  // ========================================

  // Agregar producto al carrito
  const agregarAlCarrito = async (producto, cantidad = 1) => {
    
    if (usarBD && usuario?.id) { // ✅ VALIDACIÓN
      // ✅ Usuario con sesión: agregar a BD
      try {
        
        await Postdata("carrito/AgregarCarrito", {
          id_usuario: usuario.id,
          id_producto: producto.id_producto,
          cantidad: cantidad,
        });
        
        // Recargar carrito desde BD
        await cargarCarritoDesdeDB(usuario.id);
      } catch (error) {
        console.error("Error al agregar al carrito en BD:", error);
      }
    } else {
      // ✅ Usuario SIN sesión: agregar a localStorage}
      setCarrito((prevCarrito) => {
        const productoExistente = prevCarrito.find(
          (item) => item.id_producto === producto.id_producto
        );

        if (productoExistente) {
          return prevCarrito.map((item) =>
            item.id_producto === producto.id_producto
              ? {
                  ...item,
                  cantidad: Math.min(item.cantidad + cantidad, producto.stock),
                }
              : item
          );
        } else {
          return [
            ...prevCarrito,
            {
              ...producto,
              cantidad: Math.min(cantidad, producto.stock),
            },
          ];
        }
      });
    }
  };

  // Eliminar producto del carrito
  const eliminarDelCarrito = async (id_producto) => {
    if (usarBD && usuario?.id) { // ✅ VALIDACIÓN
      // ✅ Usuario con sesión: eliminar de BD
      try {
        await Deletedata(`carrito/EliminarProducto/${usuario.id}/${id_producto}`);
        await cargarCarritoDesdeDB(usuario.id);
      } catch (error) {
        console.error("Error al eliminar del carrito en BD:", error);
      }
    } else {
      // ✅ Usuario SIN sesión: eliminar de localStorage
      setCarrito((prevCarrito) =>
        prevCarrito.filter((item) => item.id_producto !== id_producto)
      );
      // eliminarDelCarrito de localStorage
    }
  };

  // Actualizar cantidad de un producto
  const actualizarCantidad = async (id_producto, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      eliminarDelCarrito(id_producto);
      return;
    }

    if (usarBD && usuario?.id) { // ✅ VALIDACIÓN
      // ✅ Usuario con sesión: actualizar en BD
      try {
        await Putdata("carrito/ActualizarCantidad", {
          id_usuario: usuario.id,
          id_producto: id_producto,
          cantidad: nuevaCantidad,
        });
        await cargarCarritoDesdeDB(usuario.id);
      } catch (error) {
        console.error("Error al actualizar cantidad en BD:", error);
      }
    } else {
      // ✅ Usuario SIN sesión: actualizar localStorage
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
    }
  };

  // Vaciar carrito
  const vaciarCarrito = async () => {
    if (usarBD && usuario?.id) { // ✅ VALIDACIÓN
      // ✅ Usuario con sesión: vaciar BD
      try {
        await Deletedata(`carrito/VaciarCarrito/${usuario.id}`);
        setCarrito([]);
      } catch (error) {
        console.error("Error al vaciar carrito en BD:", error);
      }
    } else {
      // ✅ Usuario SIN sesión: vaciar localStorage
      setCarrito([]);
    }
  };

  // ========================================
  // FUNCIONES DE SINCRONIZACIÓN
  // ========================================

  // Cargar carrito desde la BD
  const cargarCarritoDesdeDB = async (id_usuario) => {
    if (!id_usuario) { // ✅ VALIDACIÓN
      console.error("cargarCarritoDesdeDB: id_usuario es undefined");
      return;
    }

    try {
      const carritoActualizado = await Getdata(`carrito/Obtenercarrito/${id_usuario}`);
      
      setCarrito(Array.isArray(carritoActualizado) ? carritoActualizado : []);
    } catch (error) {
      console.error("Error al cargar carrito desde BD:", error);
      setCarrito([]);
    }
  };

  // Sincronizar carrito al hacer login
  const sincronizarCarritoConBD = async (id_usuario) => {
    if (!id_usuario) { // ✅ VALIDACIÓN
      console.error("sincronizarCarritoConBD: id_usuario es undefined");
      return;
    }

    try {
      
      // 1. Si hay productos en localStorage, enviarlos al backend
      if (carrito.length > 0) {
        await Postdata("carrito/sincronizar", {
          id_usuario: id_usuario,
          productos: carrito,
        });
      }

      // 2. Obtener el carrito actualizado desde el backend
      await cargarCarritoDesdeDB(id_usuario);

      // 3. Limpiar localStorage
      localStorage.removeItem("carrito");
      setCarrito([]);
      
    } catch (error) {
      console.error("Error al sincronizar carrito:", error);
    }
  };

  // ========================================
  // FUNCIONES DE CÁLCULO
  // ========================================

  const calcularTotal = () => {
    return carrito.reduce(
      (total, item) => total + parseFloat(item.precio) * item.cantidad,
      0
    );
  };

  const calcularCantidadTotal = () => {
    return carrito.reduce((total, item) => total + item.cantidad, 0);
  };

  const estaEnCarrito = (id_producto) => {
    return carrito.some((item) => item.id_producto === id_producto);
  };

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
    sincronizarCarritoConBD,
    cargarCarritoDesdeDB,
    setUsuarioCarrito,
    usuario,
  };

  return (
    <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>
  );
}