import {
  ObtenerSubcategoriasModelo,
  InsertarSubcategoria,
  Editar_subcategorias,
  Eliminar_subcategorias,
  VerificarSubcategoriaExistente, // ✅ NUEVA
} from "../Modelos/Subcategorias.Modelo.mjs";

export async function ObtenerSubcategorias(req, res) {
  try {
    const subcategorias = await ObtenerSubcategoriasModelo();

    res.status(200).json({
      mensaje: "Subcategorías obtenidas exitosamente",
      subcategorias: subcategorias,
    });
  } catch (error) {
    console.error("Error al obtener subcategorías:", error);
    res.status(500).json({
      mensaje: "Error al obtener subcategorías",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al obtener las subcategorías",
        type: "error",
      },
    });
  }
}

export async function Crear_subcategoria(req, res) {
  try {
    const { subcategoria, parent_id, categoria_id, fecha_creacion } = req.body;

    if (!subcategoria || subcategoria.trim() === "") {
      return res.status(400).json({
        mensaje: "El nombre de la subcategoría no puede estar vacío",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "Por favor, ingrese un nombre válido para la subcategoría.",
          type: "warning",
        },
      });
    }

    if (!categoria_id) {
      return res.status(400).json({
        mensaje: "El ID de la categoría es requerido",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "Por favor, proporcione un ID válido para la categoría.",
          type: "warning",
        },
      });
    }

    // ✅ NUEVO: Verificar si ya existe
    const existe = await VerificarSubcategoriaExistente(
      subcategoria.trim(),
      categoria_id
    );

    if (existe) {
      return res.status(400).json({
        mensaje: "La subcategoría ya existe en esta categoría",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message:
            "Ya existe una subcategoría con ese nombre en esta categoría.",
          type: "warning",
        },
      });
    }

    const nuevaSubcategoriaId = await InsertarSubcategoria(
      subcategoria.trim(),
      parent_id || null, // ✅ CORREGIDO: Asegurar que sea null si no hay valor
      categoria_id,
      fecha_creacion
    );

    if (!nuevaSubcategoriaId) {
      return res.status(500).json({
        mensaje: "Error al crear subcategoría",
        showModal: true,
        modal: {
          title: "Error",
          message: "Hubo un problema al crear la subcategoría",
          type: "error",
        },
      });
    }

    res.status(201).json({
      mensaje: "Subcategoría creada exitosamente",
      subcategoriaId: nuevaSubcategoriaId,
      showModal: true,
      modal: {
        title: "Éxito",
        message: "La subcategoría ha sido creada exitosamente.",
        type: "success",
      },
    });
  } catch (error) {
    console.error("Error al crear subcategoría:", error);
    res.status(500).json({
      mensaje: "Error al crear subcategoría",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al crear la subcategoría",
        type: "error",
      },
    });
  }
}

export async function Modificar_subcategorias(req, res) {
  try {
    const { id } = req.params;
    const { subcategoria, parent_id, categoria_id, fecha_actualizacion } =
      req.body;

    if (!id) {
      return res.status(400).json({
        mensaje: "El ID de la subcategoría es requerido",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "Por favor, proporcione un ID válido.",
          type: "warning",
        },
      });
    }

    if (!subcategoria || subcategoria.trim() === "") {
      return res.status(400).json({
        mensaje: "El nombre de la subcategoría no puede estar vacío",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "Por favor, ingrese un nombre válido para la subcategoría.",
          type: "warning",
        },
      });
    }

    if (!categoria_id) {
      return res.status(400).json({
        mensaje: "El ID de la categoría es requerido",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "Por favor, proporcione un ID válido para la categoría.",
          type: "warning",
        },
      });
    }

    const subcategoriaModificada = await Editar_subcategorias(
      id,
      subcategoria.trim(),
      parent_id || null, // ✅ CORREGIDO: Asegurar que sea null si no hay valor
      categoria_id,
      fecha_actualizacion
    );

    if (!subcategoriaModificada) {
      return res.status(500).json({
        mensaje: "Error al modificar subcategoría",
        showModal: true,
        modal: {
          title: "Error",
          message: "Hubo un problema al modificar la subcategoría",
          type: "error",
        },
      });
    }

    res.status(200).json({
      mensaje: "Subcategoría modificada exitosamente",
      subcategoria: subcategoriaModificada,
      showModal: true,
      modal: {
        title: "Éxito",
        message: "La subcategoría ha sido modificada exitosamente.",
        type: "success",
      },
    });
  } catch (error) {
    console.error("Error al modificar subcategoría:", error);
    res.status(500).json({
      mensaje: "Error al modificar subcategoría",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al modificar la subcategoría",
        type: "error",
      },
    });
  }
}

export async function Eliminar_subcategoria(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        mensaje: "El ID de la subcategoría es requerido",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "Por favor, proporcione un ID válido para la subcategoría.",
          type: "warning",
        },
      });
    }

    // ✅ CORREGIDO: Agregar await
    const subcategoriaEliminada = await Eliminar_subcategorias(id);

    if (!subcategoriaEliminada) {
      return res.status(500).json({
        mensaje: "Error al eliminar subcategoría",
        showModal: true,
        modal: {
          title: "Error",
          message: "Hubo un problema al eliminar la subcategoría",
          type: "error",
        },
      });
    }

    res.status(200).json({
      mensaje: "Subcategoría eliminada exitosamente",
      showModal: true,
      modal: {
        title: "Éxito",
        message: "La subcategoría ha sido eliminada exitosamente.",
        type: "success",
      },
    });
  } catch (error) {
    console.error("Error al eliminar subcategoría:", error);
    res.status(500).json({
      mensaje: "Error al eliminar subcategoría",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al eliminar la subcategoría",
        type: "error",
      },
    });
  }
}
