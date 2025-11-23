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
  try {
    const { rows } = await pool.query(consulta, Valores);
    return { id: rows[0].id_reserva, ...reserva }; // devuelvo el id de la nueva reserva junto con los demás datos
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
