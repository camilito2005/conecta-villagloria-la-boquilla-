import pool from "../Configuracion/Conexion.mjs";

export async function CrearNuevasReservas(reserva) {
  const { id_turista, id_horario, id_guia, fecha, comentarios, estado } =
    reserva;
  const consulta = `
    INSERT INTO reservas (id_turista, id_guia, id_horario, estado, comentarios,fecha_creacion )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id_reserva
  `;
  const Valores = [id_turista, id_guia, id_horario, estado, comentarios, fecha];

  const ConsultaHorarios = `
      UPDATE horarios_disponibles
      SET disponible = false
      WHERE id_horario = $1
    `;
  try {
    const { rows } = await pool.query(consulta, Valores);

    const Horarios = await pool.query(ConsultaHorarios,[id_horario]);

    return { id: rows[0].id_reserva, ...reserva}; // devuelvo el id de la nueva reserva junto con los demás datos
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    throw error;
  }
}

export async function ObtenerReservasPendientesPorGuia(id_guia) {
  const consulta = `
    SELECT
    r.id_reserva,
    r.id_turista,
    u.nombre AS nombre_turista,
    u.email AS email_turista,
    u.telefono AS telefono_turista,

    r.id_horario,
    r.estado,
    r.comentarios,
    r.fecha_creacion,

    h.fecha AS fecha_horario,
    h.hora AS hora_horario,
    h.precio AS precio_horario


FROM reservas r
JOIN horarios_disponibles h ON r.id_horario = h.id_horario
JOIN usuarios u ON r.id_turista = u.id_usuario
JOIN usuarios g ON r.id_guia = g.id_usuario

WHERE r.id_guia = $1
  AND r.estado = 'pendiente'

ORDER BY r.fecha_creacion DESC;
  `;
  const Valores = [id_guia];
  const { rows } = await pool.query(consulta, Valores);
  return rows; // devuelvo el arreglo de reservas pendientes para el guía
}

export async function ActualizarEstados(id_reserva, id_horario, estado) {
  try {
    // 1. Actualizar estado de la reserva
    const queryReserva = `
      UPDATE reservas 
      SET estado = $1 
      WHERE id_reserva = $2
    `;

    const valoresReserva = [estado, id_reserva];
    const resultadoReserva = await pool.query(queryReserva, valoresReserva);

    // 2. Determinar disponibilidad segun el estado
    let disponible;

    if (estado === "confirmada") {
      disponible = false; // ya no está disponible
    } else if (estado === "cancelada") {
      disponible = true; // vuelve a estar disponible
    } else {
      return { message: "Estado actualizado, no se modificó disponibilidad." };
    }

    // 3. Actualizar disponibilidad del horario
    const queryHorario = `
      UPDATE horarios_disponibles
      SET disponible = $1
      WHERE id_horario = $2
    `;

    const valoresHorario = [disponible, id_horario];
    const resultadoHorario = await pool.query(queryHorario, valoresHorario);

    console.log(resultadoReserva,resultadoHorario);
    return {
      message: "Reserva y disponibilidad actualizadas con éxito",
      reserva: resultadoReserva,
      horario: resultadoHorario,
    };
    
  } catch (error) {
    console.error("Error en ActualizarEstados:", error);
    return { error: "Error actualizando estado y disponibilidad" };
  }
}
