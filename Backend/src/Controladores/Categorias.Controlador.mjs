import {
  ObtenerCategorias,
  InsertarCategoria,
  VerficarCategoriasExistente,
  EditarCategorias,Eliminar_categorias,
} from "../Modelos/Categorias.Modelo.mjs";

export async function ListarCategorias(req, res) {
  try {
    const categorias = await ObtenerCategorias();
    if (!categorias) {
      return res.status(404).json({
        mensaje: "No se encontraron categorías",
        showModal: true,
        modal: {
          title: "Categorías",
          message: "No hay categorías disponibles",
          type: "info",
        },
      });
    }
    res.status(200).json(categorias);
  } catch (error) {
    console.error("Error al listar categorías:", error);
    res.status(500).json({
      mensaje: "Error al listar categorías",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al listar las categorías",
        type: "error",
      },
    });
  }
}

export async function CrearCategoria(req, res) {
  try {
    const { nombre } = req.body;
    const { fecha_creacion } = req.body;
    // Validar que el nombre no esté vacío
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({
        mensaje: "El nombre de la categoría no puede estar vacío",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "Por favor, ingrese un nombre válido para la categoría.",
          type: "warning",
        },
      });
    }
    // verifico si la categoría ya existe si es necesario
    const categoriaExistente = await VerficarCategoriasExistente(nombre.trim());

    if (categoriaExistente) {
      return res.status(400).json({
        mensaje: "La categoría ya existe",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "Ya existe una categoría con ese nombre.",
          type: "warning",
        },
      });
    }

    const nuevaCategoriaId = await InsertarCategoria(nombre, fecha_creacion);

    if (!nuevaCategoriaId) {
      return res.status(500).json({
        mensaje: "No se pudo crear la categoría",
        showModal: true,
        modal: {
          title: "Error",
          message: "Hubo un problema al crear la categoría.",
          type: "error",
        },
      });
    }

    res.status(201).json({
      mensaje: "Categoría creada exitosamente",
      categoriaId: nuevaCategoriaId,
      showModal: true,
      modal: {
        title: "Éxito",
        message: "La categoría ha sido creada exitosamente.",
        type: "success",
      },
    });
  } catch (error) {
    console.error("Error al crear categoría:", error);
    res.status(500).json({
      mensaje: "Error al crear categoría",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al crear la categoría",
        type: "error",
      },
    });
  }
}
export async function EditarCategoria(req, res) {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const { fecha_actualizacion } = req.body;

    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({
        mensaje: "El nombre de la categoría no puede estar vacío",
        showModal: true,
        modal: {
          title: "Error de Validación",
          message: "Por favor, ingrese un nombre válido para la categoría.",
          type: "warning",
        },
      });
    }
    if (!id) {
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

    const categoriaEditada = await EditarCategorias(
      id,
      nombre,
      fecha_actualizacion
    );

    if (!categoriaEditada) {
      return res.status(500).json({
        mensaje: "No se pudo editar la categoría",
        showModal: true,
        modal: {
          title: "Error",
          message: "Hubo un problema al editar la categoría.",
          type: "error",
        },
      });
    }
    res.status(200).json({
      mensaje: "Categoría editada exitosamente",
      categoria: categoriaEditada,
      showModal: true,
      modal: {
        title: "Éxito",
        message: "La categoría ha sido editada exitosamente.",
        type: "success",
      },
    });
  } catch (error) {
    console.error("Error al editar categoría:", error);
    res.status(500).json({
      mensaje: "Error al editar categoría",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al editar la categoría",
        type: "error",
      },
    });
  }
}

export async function EliminarCategoria(req, res) {
  try {
    const { id } = req.params;
    if(!id){
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
    const categoriaEliminada = await Eliminar_categorias(id);
    if (!categoriaEliminada) {
      return res.status(500).json({
        mensaje: "No se pudo eliminar la categoría",
        showModal: true,
        modal: {
          title: "Error",
          message: "Hubo un problema al eliminar la categoría.",
          type: "error",
        },
      });
    }
    res.status(200).json({
      mensaje: "Categoría eliminada exitosamente",
      categoria: categoriaEliminada,
      showModal: true,
      modal: {
        title: "Éxito",
        message: "La categoría ha sido eliminada exitosamente.",
        type: "success",
      },
    });
  }
  catch (error) {
    console.error("Error al eliminar categoría:", error);
    res.status(500).json({
      mensaje: "Error al eliminar categoría",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al eliminar la categoría",
        type: "error",
      },
    });
  }
}