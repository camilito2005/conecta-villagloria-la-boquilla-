import {
  ObtenerResenasPorProducto,
  InsertarResena,
  ActualizarResena,
  EliminarResena,
  ObtenerPromedioCalificacion,
} from "../Modelos/Resenas.Modelo.mjs";

// Obtener reseñas de un producto
export async function ObtenerResenas(req, res) {
  try {
    const { id_producto } = req.params;

    if (!id_producto) {
      return res.status(400).json({
        mensaje: "ID de producto requerido",
        showModal: true,
        modal: {
          title: "Error",
          message: "Falta el ID del producto.",
          type: "error",
        },
      });
    }

    const resenas = await ObtenerResenasPorProducto(parseInt(id_producto));
    const promedio = await ObtenerPromedioCalificacion(parseInt(id_producto));

    res.status(200).json({
      resenas: resenas || [],
      promedio: promedio || 0,
      total: resenas?.length || 0,
    });
  } catch (error) {
    console.error("Error al obtener reseñas:", error);
    res.status(500).json({
      mensaje: "Error al obtener reseñas",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al obtener las reseñas.",
        type: "error",
      },
    });
  }
}

// Crear una reseña
export async function CrearResena(req, res) {
  try {
    const { id_usuario, id_producto, puntuacion, comentario } = req.body;

    // Validaciones
    if (!id_usuario) {
      return res.status(400).json({
        mensaje: "ID de usuario requerido",
        showModal: true,
        modal: {
          title: "Error",
          message: "Debes iniciar sesión para dejar una reseña.",
          type: "warning",
        },
      });
    }

    if (!id_producto) {
      return res.status(400).json({
        mensaje: "ID de producto requerido",
        showModal: true,
        modal: {
          title: "Error",
          message: "Falta el ID del producto.",
          type: "error",
        },
      });
    }

    if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
      return res.status(400).json({
        mensaje: "Puntuación inválida",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "La puntuación debe ser entre 1 y 5 estrellas.",
          type: "warning",
        },
      });
    }

    if (!comentario || comentario.trim() === "") {
      return res.status(400).json({
        mensaje: "El comentario es obligatorio",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "Por favor, escribe un comentario sobre el producto.",
          type: "warning",
        },
      });
    }

    const nuevaResenaId = await InsertarResena({
      id_usuario: parseInt(id_usuario),
      id_producto: parseInt(id_producto),
      puntuacion: parseInt(puntuacion),
      comentario: comentario.trim(),
    });

    if (!nuevaResenaId) {
      return res.status(500).json({
        mensaje: "No se pudo crear la reseña",
        showModal: true,
        modal: {
          title: "Error",
          message: "Hubo un problema al crear la reseña.",
          type: "error",
        },
      });
    }

    res.status(201).json({
      mensaje: "Reseña creada exitosamente",
      resenaId: nuevaResenaId,
      showModal: true,
      modal: {
        title: "¡Gracias por tu reseña!",
        message: "Tu opinión ha sido publicada exitosamente.",
        type: "success",
      },
    });
  } catch (error) {
    console.error("Error al crear reseña:", error);
    
    // Si el error es por reseña duplicada
    if (error.code === "23505") {
      return res.status(400).json({
        mensaje: "Ya has reseñado este producto",
        showModal: true,
        modal: {
          title: "Reseña duplicada",
          message: "Ya has dejado una reseña para este producto.",
          type: "warning",
        },
      });
    }

    res.status(500).json({
      mensaje: "Error al crear reseña",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al crear la reseña.",
        type: "error",
      },
    });
  }
}

// Actualizar una reseña
export async function ActualizarResenaController(req, res) {
  try {
    const { id } = req.params;
    const { puntuacion, comentario, id_usuario } = req.body;
    

    if (!id) {
      return res.status(400).json({
        mensaje: "ID de reseña requerido",
        showModal: true,
        modal: {
          title: "Error",
          message: "Falta el ID de la reseña.",
          type: "error",
        },
      });
    }

    if (!puntuacion || puntuacion < 1 || puntuacion > 5) {
      return res.status(400).json({
        mensaje: "Puntuación inválida",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "La puntuación debe ser entre 1 y 5 estrellas.",
          type: "warning",
        },
      });
    }

    if (!comentario || comentario.trim() === "") {
      return res.status(400).json({
        mensaje: "El comentario es obligatorio",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "Por favor, escribe un comentario.",
          type: "warning",
        },
      });
    }

    const actualizado = await ActualizarResena(parseInt(id), {
      puntuacion: parseInt(puntuacion),
      comentario: comentario.trim(),
      id_usuario: parseInt(id_usuario),
    });

    if (!actualizado) {
      return res.status(404).json({
        mensaje: "Reseña no encontrada o no tienes permiso",
        showModal: true,
        modal: {
          title: "Error",
          message: "No se pudo actualizar la reseña.",
          type: "error",
        },
      });
    }

    res.status(200).json({
      mensaje: "Reseña actualizada exitosamente",
      showModal: true,
      modal: {
        title: "Éxito",
        message: "Tu reseña ha sido actualizada.",
        type: "success",
      },
    });
  } catch (error) {
    console.error("Error al actualizar reseña:", error);
    res.status(500).json({
      mensaje: "Error al actualizar reseña",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al actualizar la reseña.",
        type: "error",
      },
    });
  }
}

// Eliminar una reseña
export async function EliminarResenaController(req, res) {
  try {
    const { id_resena } = req.params;
    
    const  id_usuario  = req.body.id_usuario;

    if (!id_resena) {
      return res.status(400).json({
        mensaje: "ID de reseña requerido",
        showModal: true,
        modal: {
          title: "Error",
          message: "Falta el ID de la reseña.",
          type: "error",
        },
      });
    }

    const eliminado = await EliminarResena(parseInt(id_resena), parseInt(id_usuario));

    if (!eliminado) {
      return res.status(404).json({
        mensaje: "Reseña no encontrada o no tienes permiso",
        showModal: true,
        modal: {
          title: "Error",
          message: "No se pudo eliminar la reseña.",
          type: "error",
        },
      });
    }

    res.status(200).json({
      mensaje: "Reseña eliminada exitosamente",
      showModal: true,
      modal: {
        title: "Éxito",
        message: "Tu reseña ha sido eliminada.",
        type: "success",
      },
    });
  } catch (error) {
    console.error("Error al eliminar reseña:", error);
    res.status(500).json({
      mensaje: "Error al eliminar reseña",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al eliminar la reseña.",
        type: "error",
      },
    });
  }
}