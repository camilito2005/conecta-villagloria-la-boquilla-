import pool from "../Configuracion/Conexion.mjs";

export async function CrearHorario(
  fecha,
  hora,
  id_guia,
  precio,
  cupos_disponibles
) {
  try {
    const consulta = `
      INSERT INTO horarios_disponibles (fecha, hora, id_guia, precio, cupos_disponibles, disponible)
      VALUES ($1, $2, $3, $4, $5, true)
      RETURNING *;
    `;

    const valores = [fecha, hora, id_guia, precio, cupos_disponibles];
    const { rows } = await pool.query(consulta, valores);
    return rows[0];
  } catch (error) {
    console.error("Error al crear horario:", error);
    throw error;
  }
}

export async function ObtenerHorarios() {
  const consulta = `
    SELECT 
      h.id_horario,
      h.fecha,
      h.hora,
      h.precio,
      u.id_usuario AS id_guia,
      u.nombre AS nombre_guia
    FROM horarios_disponibles h
    JOIN usuarios u ON u.id_usuario = h.id_guia
    WHERE h.disponible = true AND h.fecha >= CURRENT_DATE
    ORDER BY h.fecha, h.hora;
  `;

  const { rows } = await pool.query(consulta);
  return rows;
}

export async function ObtenerHorariosGuia(id_guia) {
  try {
    const consulta = `
      SELECT 
        h.id_horario,
        h.fecha,
        h.hora,
        h.precio,
        h.disponible,
        h.cupos_disponibles,
        h.created_at,
        h.updated_at,
        COUNT(r.id_reserva) FILTER (WHERE r.estado IN ('pendiente', 'confirmada')) AS reservas_activas
      FROM horarios_disponibles h
      LEFT JOIN reservas r ON r.id_horario = h.id_horario
      WHERE h.id_guia = $1
      GROUP BY h.id_horario, h.fecha, h.hora, h.precio, h.disponible, h.cupos_disponibles, h.created_at, h.updated_at
      ORDER BY h.fecha DESC, h.hora DESC;
    `;

    const { rows } = await pool.query(consulta, [id_guia]);
    return rows;
  } catch (error) {
    console.error("Error al obtener horarios del guía:", error);
    throw error;
  }
}

export async function EditarHorarios(
  id_horario,
  fecha,
  hora,
  precio,
  cupos_disponibles,
  disponible,
  FechaActualizacion
) {
  try {
    const consulta = `UPDATE horarios_disponibles
	SET fecha = $1, hora = $2, disponible = $3, precio = $4, cupos_disponibles = $5, updated_at = $6
	WHERE id_horario = $7 RETURNING *`;

    const Valores = [
      fecha,
      hora,
      disponible,
      precio,
      cupos_disponibles,
      FechaActualizacion,
      id_horario,
    ];

    const { rows } = await pool.query(consulta, Valores);
    if (!rows[0]) {
      return null;
    }
    return rows;
  } catch (error) {
    console.error("Error al Editar horarios del guía:", error);
    throw error;
  }
}


export async function VerificarReservasActivas(id_horario) {
  try {
    const consulta = `
      SELECT COUNT(*) as total
      FROM reservas
      WHERE id_horario = $1 AND estado IN ('pendiente', 'confirmada');
    `;

    const { rows } = await pool.query(consulta, [id_horario]);
    return parseInt(rows[0].total) > 0;
  } catch (error) {
    console.error("Error al verificar reservas activas:", error);
    throw error;
  }
}

//  NUEVA FUNCIÓN
export async function ContarReservasActivas(id_horario) {
  try {
    const consulta = `
      SELECT COUNT(*) as total
      FROM reservas
      WHERE id_horario = $1 AND estado IN ('pendiente', 'confirmada');
    `;

    const { rows } = await pool.query(consulta, [id_horario]);
    return parseInt(rows[0].total);
  } catch (error) {
    console.error("Error al contar reservas activas:", error);
    throw error;
  }
}

export async function EliminarHorarioss(id_horario) {
  try {
    const consulta = `DELETE FROM horarios_disponibles
  WHERE id_horario = $1 RETURNING *`;
    const Valores = [id_horario];

    const { rows } = await pool.query(consulta, Valores);
    if (!rows[0]) {
      return null;
    }
    return rows;
  } catch (error) {
    console.error("Error al Eliminar horarios del guía:", error);
    throw error;
  }
}

export async function CambiarEstadoHorario(id_horario, nuevoEstado) {
  try {
    const consulta = `UPDATE horarios_disponibles
      SET disponible = $1, updated_at = NOW()
      WHERE id_horario = $2
      RETURNING *`;
    const valores = [nuevoEstado, id_horario];
    const { rows } = await pool.query(consulta, valores);
    if (rows.length === 0) {
      return null; // No se encontró el horario
    }
    return rows[0];
  } catch (error) {
    console.error("Error al cambiar el estado del horario:", error);
    throw error;
  }
}
