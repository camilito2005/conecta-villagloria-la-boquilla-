import {
  ObtenerCarritoPorUsuario,
  AgregarAlCarrito,
  ActualizarCantidadCarrito,
  EliminarDelCarrito,
  VaciarCarrito,
  SincronizarCarrito,
} from "../Modelos/Carrito.Modelo.mjs";

// Obtener carrito del usuario
export async function ObtenerCarrito(req, res) {
  try {
    const { id_usuario } = req.params;

    const carrito = await ObtenerCarritoPorUsuario(parseInt(id_usuario));

    res.status(200).json(carrito || []);
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({
      mensaje: "Error al obtener carrito",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al obtener el carrito.",
        type: "error",
      },
    });
  }
}

// Agregar producto al carrito
export async function AgregarProductoAlCarrito(req, res) {
  try {
    const { id_usuario, id_producto, cantidad } = req.body;

    if (!id_usuario || !id_producto || !cantidad) {
      return res.status(400).json({
        mensaje: "Datos incompletos",
        showModal: true,
        modal: {
          title: "Error",
          message: "Faltan datos para agregar al carrito.",
          type: "error",
        },
      });
    }

    const resultado = await AgregarAlCarrito(
      parseInt(id_usuario),
      parseInt(id_producto),
      parseInt(cantidad)
    );

    res.status(200).json({
      mensaje: "Producto agregado al carrito",
      producto: resultado,
    });
  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    res.status(500).json({
      mensaje: "Error al agregar al carrito",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al agregar el producto.",
        type: "error",
      },
    });
  }
}

// Sincronizar carrito desde localStorage
export async function SincronizarCarritoController(req, res) {
  try {
    const { id_usuario, productos } = req.body;

    if (!id_usuario || !Array.isArray(productos)) {
      return res.status(400).json({
        mensaje: "Datos inválidos",
        showModal: true,
        modal: {
          title: "Error",
          message: "Datos de sincronización inválidos.",
          type: "error",
        },
      });
    }

    await SincronizarCarrito(parseInt(id_usuario), productos);

    const carritoActualizado = await ObtenerCarritoPorUsuario(parseInt(id_usuario));

    res.status(200).json({
      mensaje: "Carrito sincronizado exitosamente",
      carrito: carritoActualizado,
    });
  } catch (error) {
    console.error("Error al sincronizar carrito:", error);
    res.status(500).json({
      mensaje: "Error al sincronizar carrito",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al sincronizar el carrito.",
        type: "error",
      },
    });
  }
}

// Actualizar cantidad
export async function ActualizarCantidad(req, res) {
  try {
    const { id_usuario, id_producto, cantidad } = req.body;

    const resultado = await ActualizarCantidadCarrito(
      parseInt(id_usuario),
      parseInt(id_producto),
      parseInt(cantidad)
    );

    res.status(200).json({
      mensaje: "Cantidad actualizada",
      producto: resultado,
    });
  } catch (error) {
    console.error("Error al actualizar cantidad:", error);
    res.status(500).json({
      mensaje: "Error al actualizar cantidad",
      type: "error",
    });
  }
}

// Eliminar producto
export async function EliminarProductoDelCarrito(req, res) {
  try {
    const { id_usuario, id_producto } = req.params;

    await EliminarDelCarrito(parseInt(id_usuario), parseInt(id_producto));

    res.status(200).json({
      mensaje: "Producto eliminado del carrito",
    });
  } catch (error) {
    console.error("Error al eliminar del carrito:", error);
    res.status(500).json({
      mensaje: "Error al eliminar del carrito",
      type: "error",
    });
  }
}

// Vaciar carrito
export async function VaciarCarritoController(req, res) {
  try {
    const { id_usuario } = req.params;

    await VaciarCarrito(parseInt(id_usuario));

    res.status(200).json({
      mensaje: "Carrito vaciado exitosamente",
    });
  } catch (error) {
    console.error("Error al vaciar carrito:", error);
    res.status(500).json({
      mensaje: "Error al vaciar carrito",
      type: "error",
    });
  }
}