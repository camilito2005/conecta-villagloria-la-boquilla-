
import {
  ObtenerNegociosPorUsuario,
  ObtenerNegocioPorId,
  InsertarNegocio,
  ActualizarNegocio,
  EliminarNegocio,
  ObtenerTodosLosNegocios
} from "../Modelos/Negocios.Modelo.mjs";

// Obtener todos los negocios de un usuario
export async function ObtenerNegocios(req, res) {
  try {
    const { id_usuario } = req.params;

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

    const negocios = await ObtenerNegociosPorUsuario(parseInt(id_usuario));

    res.status(200).json(negocios || []);
  } catch (error) {
    console.error("Error al obtener negocios:", error);
    res.status(500).json({
      mensaje: "Error al obtener negocios",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al obtener los negocios.",
        type: "error",
      },
    });
  }
}

// Crear un nuevo negocio
export async function CrearNegocio(req, res) {
  try {
    const { nombre, direccion, id_propietario } = req.body;

    // Validaciones
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({
        mensaje: "El nombre del negocio es obligatorio",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "Por favor, ingrese un nombre válido para el negocio.",
          type: "warning",
        },
      });
    }

    if (!direccion || direccion.trim() === "") {
      return res.status(400).json({
        mensaje: "La dirección es obligatoria",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "Por favor, ingrese una dirección válida.",
          type: "warning",
        },
      });
    }

    if (!id_propietario) {
      return res.status(400).json({
        mensaje: "ID de propietario requerido",
        showModal: true,
        modal: {
          title: "Error",
          message: "Falta el ID del propietario.",
          type: "error",
        },
      });
    }

    const nuevoNegocioId = await InsertarNegocio({
      nombre: nombre.trim(),
      direccion: direccion.trim(),
      id_propietario: parseInt(id_propietario),
    });

    if (!nuevoNegocioId) {
      return res.status(500).json({
        mensaje: "No se pudo crear el negocio",
        showModal: true,
        modal: {
          title: "Error",
          message: "Hubo un problema al crear el negocio.",
          type: "error",
        },
      });
    }

    res.status(201).json({
      mensaje: "Negocio creado exitosamente",
      negocioId: nuevoNegocioId,
      showModal: true,
      modal: {
        title: "Éxito",
        message: "El negocio ha sido creado exitosamente.",
        type: "success",
      },
    });
  } catch (error) {
    console.error("Error al crear negocio:", error);
    res.status(500).json({
      mensaje: "Error al crear negocio",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al crear el negocio.",
        type: "error",
      },
    });
  }
}

// Actualizar un negocio
export async function ActualizarNegocioController(req, res) {
  try {
    const { id } = req.params;
    const { nombre, direccion } = req.body;

    if (!id) {
      return res.status(400).json({
        mensaje: "ID del negocio requerido",
        showModal: true,
        modal: {
          title: "Error",
          message: "Falta el ID del negocio.",
          type: "error",
        },
      });
    }

    // Validaciones
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({
        mensaje: "El nombre del negocio es obligatorio",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "Por favor, ingrese un nombre válido.",
          type: "warning",
        },
      });
    }

    if (!direccion || direccion.trim() === "") {
      return res.status(400).json({
        mensaje: "La dirección es obligatoria",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "Por favor, ingrese una dirección válida.",
          type: "warning",
        },
      });
    }

    const actualizado = await ActualizarNegocio(parseInt(id), {
      nombre: nombre.trim(),
      direccion: direccion.trim(),
    });

    if (!actualizado) {
      return res.status(404).json({
        mensaje: "Negocio no encontrado",
        showModal: true,
        modal: {
          title: "Error",
          message: "No se pudo actualizar el negocio.",
          type: "error",
        },
      });
    }

    res.status(200).json({
      mensaje: "Negocio actualizado exitosamente",
      showModal: true,
      modal: {
        title: "Éxito",
        message: "El negocio ha sido actualizado exitosamente.",
        type: "success",
      },
    });
  } catch (error) {
    console.error("Error al actualizar negocio:", error);
    res.status(500).json({
      mensaje: "Error al actualizar negocio",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al actualizar el negocio.",
        type: "error",
      },
    });
  }
}

// Eliminar un negocio
export async function EliminarNegocioController(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        mensaje: "ID del negocio requerido",
        showModal: true,
        modal: {
          title: "Error",
          message: "Falta el ID del negocio.",
          type: "error",
        },
      });
    }

    const eliminado = await EliminarNegocio(parseInt(id));

    if (!eliminado) {
      return res.status(404).json({
        mensaje: "Negocio no encontrado",
        showModal: true,
        modal: {
          title: "Error",
          message: "No se pudo eliminar el negocio.",
          type: "error",
        },
      });
    }

    res.status(200).json({
      mensaje: "Negocio eliminado exitosamente",
      showModal: true,
      modal: {
        title: "Éxito",
        message: "El negocio ha sido eliminado exitosamente.",
        type: "success",
      },
    });
  } catch (error) {
    console.error("Error al eliminar negocio:", error);
    res.status(500).json({
      mensaje: "Error al eliminar negocio",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al eliminar el negocio.",
        type: "error",
      },
    });
  }
}

// Obtener TODOS los negocios públicos (para el catálogo)
export async function ObtenerNegociosPublicos(req, res) {
  try {
    const negocios = await ObtenerTodosLosNegocios();

    res.status(200).json(negocios || []);
  } catch (error) {
    console.error("Error al obtener negocios públicos:", error);
    res.status(500).json({
      mensaje: "Error al obtener negocios",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al obtener los negocios.",
        type: "error",
      },
    });
  }
}