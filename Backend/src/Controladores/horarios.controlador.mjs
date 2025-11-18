import {IngresarHorarios, ObtenerHorarios} from "../Modelos/Horarios.modelo.mjs";

export function ConvertirHora(hora) {
  const [time, modifier] = hora.split(" ");// Divido la hora y el modificador AM/PM

  let [hours, minutes] = time.split(":");// Divido las horas y los minutos

  if (modifier === "PM" && hours !== "12") {// Si es PM y no es 12, sumo 12 a las horas
    hours = parseInt(hours) + 12;
  }
  if (modifier === "AM" && hours === "12") {// Si es AM y es 12, resto 12 a las horas
    hours = "00";// Cambio las 12 AM a 00 horas
  }
  return `${hours}:${minutes}:00`; // Retorno la hora en formato 24 horas con segundos
}


export function IngresarHorario(req, res) {
  try {
    const { fecha, hora, id_guia,precio } = req.body;
    // console.log(req.body);

    const convertedHora = ConvertirHora(hora);
    // console.log("Hora convertida:", convertedHora);

    if (!fecha || !hora) {
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
    if(!id_guia){
        return res.status(403).json({
            error: "Acceso denegado",
            showModal: true,
            modal: {
                title: "Acceso denegado",
                message: "No tienes permisos para ingresar horarios",
                type: "error",
            },
        }); 
    }
    if(!precio || isNaN(precio) || precio <= 0){
        return  res.status(400).json({
            error: "Precio inválido",
            showModal: true,
            modal: {
                title: "Error",
                message: "El precio ingresado no es válido",
                type: "error",
            },
        });
    }
    const NuevoHorario = {
      fecha,
      convertedHora,
      id_guia,
      precio
    };
    const resultado = IngresarHorarios(NuevoHorario);
    if (!resultado) {
      return res.status(500).json({
        error: "No se pudo ingresar el horario",
        showModal: true,
        modal: {
          title: "Error",
          message: "Hubo un problema al ingresar el horario",
          type: "error",
        },
      });
    }
    res.status(201).json({
      showModal: true,
      modal: {
        title: "Éxito",
        message: "Horario ingresado correctamente",
        type: "success",
      },
    });
    
} catch (error) {
    console.error("Error en IngresarHorario:", error);
    res.status(500).json({
      error: "Error al ingresar horario",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al ingresar el horario",
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
    const formateados = horarios.map(h => ({
      ...h,
      fecha: h.fecha.toISOString().split("T")[0] // → "2025-11-22"
    }));

    res.status(200).json(formateados);
  } catch (error) {
    console.error("Error en ListarHorarios:", error);
    res.status(500).json({ error: "Error al listar horarios" });
  }
}