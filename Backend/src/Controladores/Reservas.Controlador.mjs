import dotenv from "dotenv";
import { CrearNuevasReservas } from "../Modelos/Reservas.Modelo.mjs";
import {ObtenerReservasPendientesPorGuia} from "../Modelos/Reservas.Modelo.mjs";

dotenv.config();

export async function CrearReserva(req, res) {
  try {
    const { id_turista, id_horario, id_guia } = req.body;
    if (!id_turista || !id_horario || !id_guia) {
      return res.status(400).json({
        error: "Faltan datos",
        showModal: true,
        modal: {
          title: "Error",
          message: "Faltan datos para ingresar el horario",
          type: "error",
        },
      });
    }
    // CREO LA FECHA ACTUAL PERO EN MI ZONA HORARIA QUE ES BOGOTA, ACTUALMENTE SON 11:30 AM
    // const fecha = new Date().toLocaleString("es-CO", {
    //   timeZone: "America/Bogota",
    // });
    const fecha = new Date();
    const comentarios = "de momento no hay comentarios";
    const estado = "pendiente";

    const reserva = {
      id_turista,
      id_horario,
      id_guia,
      fecha,
      comentarios,
      estado,
    };
    const nuevaReserva = await CrearNuevasReservas(reserva);
    if (!nuevaReserva) {
      return res.status(500).json({
        error: "No se pudo crear la reserva",
        showModal: true,
        modal: {
          title: "Error",
          message: "Hubo un problema al crear la reserva",
          type: "error",
        },
      });
    }
    if (nuevaReserva) {
      return res.status(201).json({
        mensaje: "Reserva creada exitosamente",
        reserva: nuevaReserva,
        showModal: true,
        modal: {
          title: "Éxito",
          message: "Reserva creada exitosamente",
          type: "success",
        },
      });
    }
  } catch (error) {
    console.error("Error en CrearReserva:", error);
    res.status(500).json({ mensaje: "Error al crear la reserva" });
  }
}

export async function ObtenerReservasPendientesGuia(req, res) {
  console.log("Entrando a ObtenerReservasPendientesGuia");
  try {
    const { id_guia } = req.params;
    console.log("ID del guía recibido:", id_guia);
    if (!id_guia) {
      return res.status(400).json({ 
        mensaje: "Faltan datos" ,
        reserva: nuevaReserva,
        showModal: true,
        modal: {
          title: "Éxito",
          message: "Falta el id del guía",
          type: "success",
        },
       });
    }
    const reservas = await ObtenerReservasPendientesPorGuia(id_guia);
    console.log("Reservas pendientes obtenidas:", reservas);
    if (!reservas || reservas.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "No hay reservas pendientes para este guía" });
    }
    if (reservas) {
      return res.status(200).json({ reservas});
    }
  } catch (error) {
    console.error("Error en ObtenerReservasPendientesGuia:", error);
    res.status(500).json({
      mensaje: "Error al obtener las reservas pendientes",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al obtener las reservas pendientes",
        type: "error",
      },
    });
  }
}
