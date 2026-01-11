import {
  CrearHorario,
  ObtenerHorarios,
  ObtenerHorariosGuia,EditarHorarios,
  EliminarHorarioss,CambiarEstadoHorario,
  VerificarReservasActivas,
  ContarReservasActivas
} from "../Modelos/Horarios.modelo.mjs";

// Controlador
export async function AgregarHorario(req, res) {
  try {
    const { fecha, hora, id_guia, precio, cupos_disponibles } = req.body;

    // Validaciones
    if (!fecha || !hora || !id_guia || !precio || !cupos_disponibles) {
      return res.status(400).json({
        mensaje: "Todos los campos son obligatorios",
        showModal: true,
        modal: {
          title: "Faltan datos",
          message: "Debes completar todos los campos",
          type: "error",
        },
      });
    }

    // Validar que la fecha no sea pasada
    const fechaSeleccionada = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaSeleccionada < hoy) {
      return res.status(400).json({
        mensaje: "Fecha inválida",
        showModal: true,
        modal: {
          title: "Error",
          message: "No puedes crear horarios en fechas pasadas",
          type: "error",
        },
      });
    }

    // Validar precio y cupos
    if (parseFloat(precio) <= 0) {
      return res.status(400).json({
        mensaje: "Precio inválido",
        showModal: true,
        modal: {
          title: "Error",
          message: "El precio debe ser mayor a 0",
          type: "error",
        },
      });
    }

    if (parseInt(cupos_disponibles) <= 0) {
      return res.status(400).json({
        mensaje: "Cupos inválidos",
        showModal: true,
        modal: {
          title: "Error",
          message: "Los cupos deben ser mayor a 0",
          type: "error",
        },
      });
    }

    // Crear horario
    const nuevoHorario = await CrearHorario(
      fecha,
      hora,
      id_guia,
      parseFloat(precio),
      parseInt(cupos_disponibles)
    );

    return res.status(201).json({
      mensaje: "Horario creado correctamente",
      data: nuevoHorario,
      showModal: true,
      modal: {
        title: "Éxito",
        message: "El horario se creó exitosamente",
        type: "success",
      },
    });

  } catch (error) {
    console.error("Error al agregar horario:", error);
    return res.status(500).json({
      showModal: true,
      modal: {
        title: "Error del servidor",
        message: "Ocurrió un error al crear el horario",
        type: "error",
      },
    });
  }
}

export async function ListarHorarios(req, res) {
  try {
    const horarios = await ObtenerHorarios();

    if (!horarios || horarios.length === 0) {
      return res.status(404).json({
        error: "No hay horarios",
        showModal: true,
        modal: {
          title: "Sin horarios",
          message: "No se encontraron horarios disponibles",
          type: "error",
        },
      });
    }

    const agrupado = {};

    horarios.forEach((row) => {
      if (!agrupado[row.fecha]) {
        agrupado[row.fecha] = {
          fecha: row.fecha,
          id_guia: row.id_guia,
          nombre_guia: row.nombre_guia,
          precio: row.precio,
          horarios: [],
        };
      }

      agrupado[row.fecha].horarios.push({
        id_horario: row.id_horario,
        hora: row.hora,
      });
    });

    return res.json(Object.values(agrupado));
  } catch (error) {
    console.error("Error en ListarHorarios:", error);
    res.status(500).json({ error: "Error al listar horarios" });
  }
}

// ✅ NUEVO: Para guías - Lista sus propios horarios
export async function ListarHorariosGuia(req, res) {
  try {
    const { id_guia } = req.params;

    if (!id_guia) {
      return res.status(400).json({
        mensaje: "ID del guía es requerido",
        showModal: true,
        modal: {
          title: "Error",
          message: "Falta el ID del guía",
          type: "error",
        },
      });
    }

    const horarios = await ObtenerHorariosGuia(id_guia);

    // Si no hay horarios, devolver array vacío (sin error)
    return res.json(horarios);
  } catch (error) {
    console.error("Error al listar horarios del guía:", error);
    return res.status(500).json({
      showModal: true,
      modal: {
        title: "Error del servidor",
        message: "Ocurrió un error al cargar los horarios.",
        type: "error",
      },
    });
  }
}
export async function Editar(req, res) {
  try {
    const { id_horario } = req.params;
    const { fecha, hora, precio, cupos_disponibles, disponible } = req.body;
    const FechaActualizacion = new Date();

    if (!id_horario) {
      return res.status(400).json({
        mensaje: "ID del horario es requerido",
        showModal: true,
        modal: {
          title: "Error",
          message: "Falta el ID del horario",
          type: "error",
        },
      });
    }

    if (!fecha || !hora || precio === undefined || cupos_disponibles === undefined || disponible === undefined) {
      return res.status(400).json({
        mensaje: "Faltan datos obligatorios",
        showModal: true,
        modal: {
          title: "Error",
          message: "Debes completar todos los campos (fecha, hora, precio, cupos, disponibilidad)",
          type: "error",
        },
      });
    }

    // Validar que no se edite un horario pasado
    const fechaHorario = new Date(`${fecha}T${hora}`);
    if (fechaHorario < new Date()) {
      return res.status(400).json({
        mensaje: "No se puede editar un horario pasado",
        showModal: true,
        modal: {
          title: "Error",
          message: "No puedes editar un horario que ya pasó",
          type: "error",
        },
      });
    }

    // ✅ NUEVO: Validar que los nuevos cupos no sean menores a las reservas activas
    const reservasActivas = await ContarReservasActivas(id_horario);
    
    if (cupos_disponibles < reservasActivas) {
      return res.status(400).json({
        mensaje: "Cupos insuficientes",
        showModal: true,
        modal: {
          title: "Error",
          message: `No puedes reducir los cupos a ${cupos_disponibles}. Ya hay ${reservasActivas} reserva(s) confirmada(s).`,
          type: "error",
        },
      });
    }

    const horarioActualizado = await EditarHorarios(
      id_horario,
      fecha,
      hora,
      precio,
      cupos_disponibles,
      disponible,
      FechaActualizacion
    );

    if (!horarioActualizado) {
      return res.status(404).json({
        mensaje: "Horario no encontrado",
        showModal: true,
        modal: {
          title: "No encontrado",
          message: "El horario no existe",
          type: "error",
        },
      });
    }

    return res.status(200).json({
      mensaje: "Horario actualizado correctamente",
      data: horarioActualizado,
      showModal: true,
      modal: {
        title: "Éxito",
        message: "El horario se actualizó correctamente",
        type: "success",
      },
    });
  } catch (error) {
    console.error("Error al editar horario:", error);
    return res.status(500).json({
      showModal: true,
      modal: {
        title: "Error del servidor",
        message: "Ocurrió un error al actualizar el horario.",
        type: "error",
      },
    });
  }
}
export async function EliminarHorario(req, res) {
  try {
    const { id_horario } = req.params;

    if (!id_horario) {
      return res.status(401).json({
        mensaje: "ID del horario es requerido",
        showModal: true,
        modal: {
          title: "Error",
          message: "Falta el ID del horario",
          type: "error",
        },
      });
    }

     // Verificar si tiene reservas activas
    const tieneReservas = await VerificarReservasActivas(id_horario);
    
    if (tieneReservas) {
      return res.status(400).json({
        mensaje: "No se puede eliminar",
        showModal: true,
        modal: {
          title: "Horario con reservas",
          message: "No puedes eliminar un horario que tiene reservas activas (pendientes o confirmadas)",
          type: "error",
        },
      });
    }

    const horarioEliminado = await EliminarHorarioss(id_horario);

    if (!horarioEliminado) {
      return res.status(404).json({
        mensaje: "Horario no encontrado",
        showModal: true,
        modal: {
          title: "No encontrado",
          message: "El horario que intentas eliminar no existe",
          type: "error",
        },
      });
    }
    return res.status(200).json({
      mensaje: "Horario eliminado correctamente",
      data: horarioEliminado,
      showModal: true,
      modal: {
        title: "Éxito",
        message: "El horario se eliminó correctamente",
        type: "success",
      },
    });
  }
  catch (error) {
    console.error("Error al eliminar horario:", error);
    return res.status(500).json({
      showModal: true,
      modal: {
        title: "Error del servidor",
        message: "Ocurrió un error al eliminar el horario.",
        type: "error",
      },
    });
  }
}

export async function Cambiarestado (req,res){
  try {
    const {id_horario} = req.params;
    const {disponible} = req.body;
    
    if (!id_horario || disponible === undefined) {
      return res.status(400).json({
        mensaje: "Faltan datos muy importantes",
        showModal: true,
        modal: {
          title: "Error",
          message: "Faltan datos muy importantes",
          type: "error",
        },
      });
    }

    const horarioCambiado = await CambiarEstadoHorario(id_horario,disponible);
    if (!horarioCambiado) {
      return res.status(500).json({
        mensaje: "error",
        showModal: true,
        modal: {
          title: "error",
          message: "error",
          type: "error",
        },
      });
    }
    return res.status(200).json({
      mensaje: "estado cambiado exitosamente",
      data: horarioCambiado,
      showModal: true,
      modal: {
        title: "EXITO",
        message: "el estado a sido cambiado",
        type: "success",
      },
    });
  }catch (error) {
    console.error("Error al cambiar estado del horario:", error);
    return res.status(500).json({
      showModal: true,
      modal: {
        title: "Error del servidor",
        message: "Ocurrió un error al cambiar el estado del horario.",
        type: "error",
      },
    });
  }
}
