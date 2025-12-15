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

    const Horarios = await pool.query(ConsultaHorarios, [id_horario]);

    return { id: rows[0].id_reserva, ...reserva }; // devuelvo el id de la nueva reserva junto con los demás datos
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    throw error;
  }
}

export async function ObtenerReservasPendientesPorGuia(id_guia) {
  // SELECT 
  //       h.id_horario,
  //       h.id_guia,
  //       h.fecha,
  //       h.hora,
  //       h.precio,
  //       h.cupos_disponibles,
  //       h.disponible,
  //       h.created_at,
  //       h.updated_at,
  //       COUNT(r.id_reserva) FILTER (WHERE r.estado IN ('pendiente', 'confirmada')) AS reservas_activas
  //     FROM horarios_disponibles h
  //     LEFT JOIN reservas r ON r.id_horario = h.id_horario
  //     WHERE h.id_guia = $1
  //     GROUP BY h.id_horario, h.id_guia, h.fecha, h.hora, h.precio, h.cupos_disponibles, h.disponible, h.created_at, h.updated_at
  //     ORDER BY h.fecha DESC, h.hora DESC;
  const consulta = `
      SELECT 
        r.id_reserva,
        r.id_turista,
        r.id_horario,
        r.id_guia,
        r.estado,
        r.fecha_creacion,
        r.comentarios,
        h.fecha,
        h.hora,
        h.precio,
        u.nombre AS nombre_turista,
        u.email AS correo_turista,
        u.telefono AS telefono_turista
      FROM reservas r
      INNER JOIN horarios_disponibles h ON h.id_horario = r.id_horario
      INNER JOIN usuarios u ON u.id_usuario = r.id_turista
      WHERE r.id_guia = $1
        AND r.estado = 'pendiente'
      ORDER BY h.fecha ASC, h.hora ASC;
  `;
  const Valores = [id_guia];
  const { rows } = await pool.query(consulta, Valores);
  return rows; // devuelvo el arreglo de reservas pendientes para el guía
}

export async function ReservasTurista(id_turista) {
  try {
    const Query = `SELECT 
  r.id_reserva,
  r.estado,
  h.fecha,
  h.hora,
  h.precio,
  g.nombre AS nombre_guia
FROM reservas r
INNER JOIN horarios_disponibles h ON h.id_horario = r.id_horario
INNER JOIN usuarios g ON g.id_usuario = r.id_guia
WHERE r.id_turista = $1 AND r.estado IN ('pendiente', 'confirmada') AND h.fecha >= CURRENT_DATE
ORDER BY h.fecha, h.hora`;

    const {rows} = await pool.query(Query,[id_turista]);
    return rows;
  } catch (error) {
    console.error(
      "ocurrio un erro al obtener las reservas del turistas",
      error
    );
  }
}

// Para "Mis Reservas" - Solo activas/futuras
export async function ReservasActivasTurista(id_turista) {
  try {
    const Query = `
      SELECT 
        h.id_horario,
        h.fecha,
        h.hora,
        h.precio,
        h.cupos_disponibles,
        h.id_guia,
        u.nombre AS nombre_guia,
        COUNT(r.id_reserva) FILTER (WHERE r.estado IN ('pendiente', 'confirmada')) AS reservas_activas,
        (h.cupos_disponibles - COALESCE(COUNT(r.id_reserva) FILTER (WHERE r.estado IN ('pendiente', 'confirmada')), 0)) AS cupos_libres
      FROM horarios_disponibles h
      INNER JOIN usuarios u ON u.id_usuario = h.id_guia
      LEFT JOIN reservas r ON r.id_horario = h.id_horario
      WHERE h.disponible = true 
        AND h.fecha >= CURRENT_DATE
      GROUP BY h.id_horario, h.fecha, h.hora, h.precio, h.cupos_disponibles, h.id_guia, u.nombre
      HAVING (h.cupos_disponibles - COALESCE(COUNT(r.id_reserva) FILTER (WHERE r.estado IN ('pendiente', 'confirmada')), 0)) > 0
      ORDER BY h.fecha ASC, h.hora ASC;
    `;

    const { rows } = await pool.query(Query, [id_turista]);
    return rows;
  } catch (error) {
    console.error("Error al obtener reservas activas:", error);
    throw error;
  }
}

// Para "Historial" - Todas las reservas
export async function HistorialReservasTurista(id_turista) {
  try {
    const Query = `
      SELECT 
        r.id_reserva,
        r.estado,
        h.fecha,
        h.hora,
        h.precio,
        g.nombre AS nombre_guia,
        r.fecha_creacion AS fecha_reserva
      FROM reservas r
      INNER JOIN horarios_disponibles h ON h.id_horario = r.id_horario
      INNER JOIN usuarios g ON g.id_usuario = r.id_guia
      WHERE r.id_turista = $1
      ORDER BY h.fecha DESC, h.hora DESC
    `;

    const { rows } = await pool.query(Query, [id_turista]);
    return rows;
  } catch (error) {
    console.error("Error al obtener historial de reservas:", error);
    throw error;
  }
}

export async function ActualizarEstados(id_reserva, id_horario, estado, cantidad_personas = 1) {
  try {
    // 1. Actualizar estado de la reserva
    const queryReserva = `
      UPDATE reservas 
      SET estado = $1 
      WHERE id_reserva = $2
      RETURNING *
    `;

    const valoresReserva = [estado, id_reserva];
    const { rows: reservaActualizada } = await pool.query(queryReserva, valoresReserva);

    if (reservaActualizada.length === 0) {
      throw new Error("No se encontró la reserva");
    }

    // 2. Ajustar cupos según el estado
    let queryCupos;
    let valoresCupos;

    if (estado === "confirmada") {
      // Decrementar cupos disponibles
      queryCupos = `
        UPDATE horarios_disponibles
        SET cupos_disponibles = cupos_disponibles - $1
        WHERE id_horario = $2 
          AND cupos_disponibles >= $1
        RETURNING *
      `;
      valoresCupos = [cantidad_personas, id_horario];

    } else if (estado === "cancelada") {
      // Incrementar cupos disponibles (devolver los cupos)
      queryCupos = `
        UPDATE horarios_disponibles
        SET cupos_disponibles = cupos_disponibles + $1
        WHERE id_horario = $2
        RETURNING *
      `;
      valoresCupos = [cantidad_personas, id_horario];

    } else {
      // Si es otro estado (ej: "pendiente"), no cambiar cupos
      return {
        success: true,
        message: "Estado actualizado, cupos sin modificar",
        reserva: reservaActualizada[0]
      };
    }

    const { rows: horarioActualizado } = await pool.query(queryCupos, valoresCupos);

    if (horarioActualizado.length === 0) {
      throw new Error("No hay suficientes cupos disponibles o el horario no existe");
    }

    // 3. Si los cupos llegan a 0, marcar como no disponible
    if (horarioActualizado[0].cupos_disponibles === 0) {
      await pool.query(
        `UPDATE horarios_disponibles SET disponible = false WHERE id_horario = $1`,
        [id_horario]
      );
    }

    // 4. Si había cupos 0 y ahora hay disponibles, reactivar
    if (estado === "cancelada" && horarioActualizado[0].cupos_disponibles > 0) {
      await pool.query(
        `UPDATE horarios_disponibles SET disponible = true WHERE id_horario = $1`,
        [id_horario]
      );
    }

    return {
      success: true,
      message: "Reserva y cupos actualizados con éxito",
      reserva: reservaActualizada[0],
      horario: horarioActualizado[0]
    };

  } catch (error) {
    console.error("Error en ActualizarEstados:", error);
    throw error;
  }
}