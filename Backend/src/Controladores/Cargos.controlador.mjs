import { json } from "express";
import {
  ObtenerCargos,
  Registrar_cargo,
  Eliminar_Cargos,
  EditarCargos,
} from "../Modelos/Cargos.modelo.mjs";

export async function GetCargos(req, res) {
  try {
    const respuesta = await ObtenerCargos();
    res.json(respuesta); // ✅ devolver los datos
  } catch (error) {
    console.error("Error en GetCargos:", error); // 👈 log para ver en contenedor
    res.status(500).json({ error: "Error al obtener los cargos" });
  }
}

export async function Registrar_cargos(req, res) {
  try {
    // const nombre = req.body;
    const { nombre } = req.body;

    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({
        mensaje: "El nombre del cargo es obligatorio",
        showModal: true,
        modal: {
          title: "Error",
          message: "Debes ingresar un nombre para el cargo",
          type: "error",
        },
      });
    }

    const Ingresados = await Registrar_cargo(nombre.trim());

    if (!Ingresados.success && Ingresados.duplicate) {
      return res.status(409).json({
        mensaje: "El cargo ya existe",
        showModal: true,
        modal: {
          title: "Advertencia",
          message: "Este cargo ya está registrado en el sistema",
          type: "warning",
        },
      });
    }

    if (Ingresados.success) {
      return res.status(201).json({
        mensaje: "Cargo creado exitosamente",
        cargo: Ingresados.data,
        showModal: true,
        modal: {
          title: "Éxito",
          message: "Cargo creado exitosamente",
          type: "success",
        },
      });
    }

    // Error genérico (no debería llegar aquí normalmente)
    return res.status(500).json({
      error: "No se pudo crear el cargo",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al crear el cargo",
        type: "error",
      },
    });
  } catch (error) {
    console.error("error al registrar cargos", error);
    return res.status(500).json({
      mensaje: "Error",
      showModal: true,
      modal: {
        title: "error",
        message: "ha ocurrido un error",
        type: "error",
      },
    });
  }
}

export async function Eliminar_cargo(req, res) {
  try {
    const { id_cargo } = req.params;

    // Validar que venga el ID
    if (!id_cargo) {
      return res.status(400).json({
        // ← 400, no 500
        mensaje: "El ID del cargo es requerido",
        showModal: true,
        modal: {
          title: "Faltan datos",
          message: "Debe proporcionar un ID de cargo válido",
          type: "error",
        },
      });
    }

    const Resultado = await Eliminar_Cargos(id_cargo);

    // Si el cargo está en uso (corregido: era !Resultado.inUse)
    if (Resultado.inUse) {
      // ← Sin el "!"
      return res.status(409).json({
        mensaje: Resultado.message,
        showModal: true,
        modal: {
          title: "Advertencia",
          message: Resultado.message || "Este cargo actualmente está en uso",
          type: "warning",
        },
      });
    }

    // Si no se encontró el cargo
    if (!Resultado.success) {
      return res.status(404).json({
        // ← 404 para "no encontrado"
        mensaje: Resultado.message,
        showModal: true,
        modal: {
          title: "Error",
          message: Resultado.message || "El cargo no existe",
          type: "error",
        },
      });
    }

    // Éxito
    return res.status(200).json({
      // ← 200, no 201 (201 es para POST)
      mensaje: "Cargo eliminado exitosamente",
      cargo: Resultado.data, // ← Era "Ingresados.data"
      showModal: true,
      modal: {
        title: "Éxito",
        message: "Cargo eliminado exitosamente",
        type: "success",
      },
    });
  } catch (error) {
    console.error("Error al eliminar el cargo:", error);
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      showModal: true,
      modal: {
        title: "Error",
        message: "Ha ocurrido un error inesperado",
        type: "error",
      },
    });
  }
}

export async function Editar(req, res) {
  try {
    const { id_cargo } = req.params;

    const { nombre } = req.body;

    if (!id_cargo) {
      return res.status(400).json({
        mensaje: "Datos del cargo es requerido",
        showModal: true,
        modal: {
          title: "Faltan datos",
          message: "No hay identificador",
          type: "error",
        },
      });
    }

    if (!nombre || nombre.trim().length === 0) {
      return res.status(400).json({
        mensaje: "El nombre del cargo es necesario",
        showModal: true,
        modal: {
          title: "Faltan datos",
          message: "Debe proporcionar un nombre válido",
          type: "error",
        },
      });
    }

    const Resultado = await EditarCargos(id_cargo, nombre.trim());

    if (!Resultado) {
      return res.status(404).json({
        // 404 si no se encuentra
        mensaje: "Cargo no encontrado",
        showModal: true,
        modal: {
          title: "No encontrado",
          message: "No se encontró el cargo especificado",
          type: "error",
        },
      });
    }

    // Éxito - ERROR 3: 200, no 201 (201 es para crear)
    return res.status(200).json({
      mensaje: "Cargo editado correctamente",
      data: Resultado, // Opcional: devolver el cargo actualizado
      showModal: true,
      modal: {
        title: "Éxito",
        message: "El cargo se ha editado exitosamente",
        type: "success",
      },
    });
  } catch (error) {
    console.error("a ocurrido un error en el editar ", error);
    // Manejo de errores específicos
    if (error.message.includes("No se encontró")) {
      return res.status(404).json({
        mensaje: "Cargo no encontrado",
        showModal: true,
        modal: {
          title: "No encontrado",
          message: error.message,
          type: "error",
        },
      });
    }

    return res.status(500).json({
      mensaje: "Error interno del servidor",
      showModal: true,
      modal: {
        title: "Error",
        message: "Ha ocurrido un error inesperado",
        type: "error",
      },
    });
  }
}

export async function Prueba(req, res) {
  res.json({ mensaje: "hola desde cargos controlador" }); // ✅ usar res.json()
}
