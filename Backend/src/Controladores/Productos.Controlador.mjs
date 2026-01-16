import {
  Listar_Productos,
  Listar_Productos_usuario,
  InsertarProducto,
  ActualizarProducto,
  ObtenerProductoPorId,
  EliminarProducto,
  ObtenerTodosLosProductos,
} from "../Modelos/Productos.Modelo.mjs";

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function Obtener_productos(req, res) {
  try {
    const productos = await Listar_Productos();
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ mensaje: "Error al obtener productos" });
  }
}

// Obtener TODOS los productos públicos (para el catálogo)
export async function ObtenerProductosPublicos(req, res) {
  try {
    // Solo productos con stock > 0
    const productos = await ObtenerTodosLosProductos();

    res.status(200).json(productos || []);
  } catch (error) {
    console.error("Error al obtener productos públicos:", error);
    res.status(500).json({
      mensaje: "Error al obtener productos",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al obtener los productos.",
        type: "error",
      },
    });
  }
}

export async function Obtener_productos_usuario(req, res) {
  try {
    const { id_usuario } = req.params;
    const productos = await Listar_Productos_usuario(id_usuario);
    res.json(productos);
  } catch (error) {
    console.error("Error al listar los productos del usuario:", error);
    res.status(500).json({
      mensaje: "Error al obtener los productos del usuario",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al obtener los productos del usuario",
        type: "error",
      },
    });
  }
}

// Crear producto
export async function Crear_productos(req, res) {
  try {
    const {
      nombre,
      precio,
      stock,
      categoria_id,
      subcategoria_id,
      descripcion,
      tipo_negocio,
      id_usuario,
    } = req.body;

    // Validaciones
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({
        mensaje: "El nombre del producto es obligatorio",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "Por favor, ingrese un nombre válido para el producto.",
          type: "warning",
        },
      });
    }

    if (!precio || parseFloat(precio) <= 0) {
      return res.status(400).json({
        mensaje: "El precio debe ser mayor a 0",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "Por favor, ingrese un precio válido.",
          type: "warning",
        },
      });
    }

    if (!stock || parseInt(stock) <= 0) {
      return res.status(400).json({
        mensaje: "El stock no puede ser negativo, cero o vacío",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "Por favor, ingrese un stock válido.",
          type: "warning",
        },
      });
    }

    if (!categoria_id) {
      return res.status(400).json({
        mensaje: "Debe seleccionar una categoría",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "Por favor, seleccione una categoría.",
          type: "warning",
        },
      });
    }

    if (!subcategoria_id) {
      return res.status(400).json({
        mensaje: "Debe seleccionar una subcategoría",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "Por favor, seleccione una subcategoría.",
          type: "warning",
        },
      });
    }

    if (!id_usuario) {
      return res.status(400).json({
        mensaje: "ID de usuario requerido",
        showModal: true,
        modal: {
          title: "Error",
          message: "Falta el ID del usuario.",
          type: "error",
        },
      });
    }

    //  Construir la URL de la imagen si se subió
    let imagen_url = null;
    if (req.file) {
      imagen_url = `/Recursos/Productos/${req.file.filename}`;
    }

    const productos = {
      nombre: nombre.trim(),
      precio: parseFloat(precio),
      stock: parseInt(stock),
      categoria_id: parseInt(categoria_id),
      subcategoria_id: parseInt(subcategoria_id),
      descripcion: descripcion?.trim() || null,
      imagen_url: imagen_url,
      tipo_negocio: tipo_negocio || null,
      id_usuario: parseInt(id_usuario),
    };

    const nuevoProductoId = await InsertarProducto(productos);

    if (!nuevoProductoId) {
      return res.status(500).json({
        mensaje: "No se pudo crear el producto",
        showModal: true,
        modal: {
          title: "Error",
          message: "Hubo un problema al crear el producto.",
          type: "error",
        },
      });
    }

    res.status(201).json({
      mensaje: "Producto creado exitosamente",
      productoId: nuevoProductoId,
      imagen_url: imagen_url,
      showModal: true,
      modal: {
        title: "Éxito",
        message: "El producto ha sido creado exitosamente.",
        type: "success",
      },
    });
  } catch (error) {
    console.error("Error al crear producto:", error);

    //  Si hay error y se subió una imagen, eliminarla
    if (req.file) {
      const rutaImagen = path.join(__dirname, "../Recursos", req.file.filename);
      fs.unlink(rutaImagen, (err) => {
        if (err) console.error("Error al eliminar imagen:", err);
      });
    }

    res.status(500).json({
      mensaje: "Error al crear producto",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al crear el producto",
        type: "error",
      },
    });
  }
}

export async function Editar_producto(req, res) {
  try {
    const { id_producto } = req.params;

    const {
      nombre,
      precio,
      stock,
      categoria_id,
      subcategoria_id,
      descripcion,
      tipo_negocio,
      id_usuario,
      imagen_url_actual, // Si no hay nueva imagen, viene la URL actual
    } = req.body;

    if (!id_producto) {
      return res.status(400).json({
        mensaje: "ID del producto requerido",
        showModal: true,
        modal: {
          title: "Error",
          message: "Falta el ID del producto.",
          type: "error",
        },
      });
    }

    // Validaciones
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({
        mensaje: "El nombre del producto es obligatorio",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "Por favor, ingrese un nombre válido para el producto.",
          type: "warning",
        },
      });
    }

    if (!precio || parseFloat(precio) <= 0) {
      return res.status(400).json({
        mensaje: "El precio debe ser mayor a 0",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "Por favor, ingrese un precio válido.",
          type: "warning",
        },
      });
    }

    if (!stock || parseInt(stock) < 0) {
      return res.status(400).json({
        mensaje: "El stock no puede ser negativo",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "Por favor, ingrese un stock válido.",
          type: "warning",
        },
      });
    }

    if (!categoria_id) {
      return res.status(400).json({
        mensaje: "Debe seleccionar una categoría",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "Por favor, seleccione una categoría.",
          type: "warning",
        },
      });
    }

    if (!subcategoria_id) {
      return res.status(400).json({
        mensaje: "Debe seleccionar una subcategoría",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "Por favor, seleccione una subcategoría.",
          type: "warning",
        },
      });
    }

    //  Manejar imagen
    let imagen_url;

    if (req.file) {
      // Si hay nueva imagen, usar la nueva
      imagen_url = `/Recursos/Productos/${req.file.filename}`;

      //  Eliminar imagen anterior si existe
      if (imagen_url_actual && imagen_url_actual !== "") {
        const rutaImagenAnterior = path.join(
          __dirname,
          "..",
          imagen_url_actual.replace(/^\//, "")
        );
        fs.unlink(rutaImagenAnterior, (err) => {
          if (err) console.error("Error al eliminar imagen anterior:", err);
        });
      }
    } else {
      // Si no hay nueva imagen, mantener la actual
      imagen_url = imagen_url_actual || null;
    }

    const productosActualizado = {
      nombre: nombre.trim(),
      precio: parseFloat(precio),
      stock: parseInt(stock),
      categoria_id: parseInt(categoria_id),
      subcategoria_id: parseInt(subcategoria_id),
      descripcion: descripcion?.trim() || null,
      imagen_url: imagen_url,
      tipo_negocio: tipo_negocio ? parseInt(tipo_negocio) : null,
      id_usuario: parseInt(id_usuario),
    };

    const actualizado = await ActualizarProducto(
      parseInt(id_producto),
      productosActualizado
    );

    if (!actualizado) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
        showModal: true,
        modal: {
          title: "Error",
          message: "No se pudo actualizar el producto.",
          type: "error",
        },
      });
    }

    res.status(200).json({
      mensaje: "Producto actualizado exitosamente",
      showModal: true,
      modal: {
        title: "Éxito",
        message: "El producto ha sido actualizado exitosamente.",
        type: "success",
      },
    });
  } catch (error) {
    console.error("Error al editar producto:", error);

    //  Si hay error y se subió una imagen nueva, eliminarla
    if (req.file) {
      const rutaImagen = path.join(
        __dirname,
        "..",
        "Recursos",
        "Productos",
        req.file.filename
      );
      fs.unlink(rutaImagen, (err) => {
        if (err) console.error("Error al eliminar imagen:", err);
      });
    }

    res.status(500).json({
      mensaje: "Error al editar producto",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al actualizar el producto.",
        type: "error",
      },
    });
  }
}

export async function Eliminar_producto(req, res) {
  try {
    const { id_producto } = req.params;

    if (!id_producto) {
      return res.status(400).json({
        mensaje: "ID del producto requerido",
        showModal: true,
        modal: {
          title: "Error",
          message: "Falta el ID del producto.",
          type: "error",
        },
      });
    }

    //  PASO 1: Obtener la información del producto antes de eliminarlo
    const producto = await ObtenerProductoPorId(parseInt(id_producto));

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
        showModal: true,
        modal: {
          title: "Error",
          message: "El producto no existe.",
          type: "error",
        },
      });
    }

    // PASO 2: Eliminar el producto de la base de datos
    const eliminado = await EliminarProducto(parseInt(id_producto));

    if (!eliminado) {
      return res.status(500).json({
        mensaje: "No se pudo eliminar el producto",
        showModal: true,
        modal: {
          title: "Error",
          message: "Hubo un problema al eliminar el producto.",
          type: "error",
        },
      });
    }

    //  PASO 3: Eliminar la imagen del servidor si existe
    if (producto.imagen_url) {
      const rutaImagen = path.join(
        __dirname,
        "../Recursos/Productos",
        path.basename(producto.imagen_url)
      );

      fs.unlink(rutaImagen, (err) => {
        if (err) {
          console.error("Error al eliminar imagen del producto:", err);
          // No detenemos la ejecución, el producto ya fue eliminado de la BD
        } else {
          console.log("Imagen eliminada exitosamente:", rutaImagen);
        }
      });
    }

    res.status(200).json({
      mensaje: "Producto eliminado exitosamente",
      showModal: true,
      modal: {
        title: "Éxito",
        message: "El producto y su imagen han sido eliminados exitosamente.",
        type: "success",
      },
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({
      mensaje: "Error al eliminar producto",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al eliminar el producto.",
        type: "error",
      },
    });
  }
}
