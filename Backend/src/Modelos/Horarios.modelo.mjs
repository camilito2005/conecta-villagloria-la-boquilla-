import pool from "../Configuracion/Conexion.mjs";

export async function IngresarHorarios(NuevoHorario) {

  const consulta = `
    INSERT INTO horarios_disponibles (id_guia, fecha, hora, disponible,precio)
    VALUES ($1, $2, $3,$4,$5) 
    RETURNING id_horario
  `;
  const Valores = [
    NuevoHorario.id_guia,
    NuevoHorario.fecha,
    NuevoHorario.convertedHora,
    true,
    NuevoHorario.precio
  ];
  const { rows } = await pool.query(consulta, Valores);
  return { id: rows[0].id_horario, ...NuevoHorario }; // devuelvo el id del nuevo horario junto con los demás datos
}
// export async function ObtenerHorarios() {
// //   const consulta = `
// //     SELECT h.id_horario, h.fecha, h.hora, h.precio,
// //        u.nombre AS nombre_guia
// // FROM horarios_disponibles h
// // JOIN usuarios u ON u.id_usuario = h.id_guia
// // WHERE h.disponible = true
// // order by h.fecha, h.hora;

// //   `;
// const consulta = `SELECT 
//       h.id_horario,
//       h.fecha,
//       h.hora,
//       h.precio,
//       u.id_usuario AS id_guia,
//       u.nombre AS nombre_guia
//   FROM horarios_disponibles h
//   JOIN usuarios u ON u.id_usuario = h.id_guia
//   WHERE h.disponible = true
//   ORDER BY h.fecha, h.hora;

// `;
//   const { rows } = await pool.query(consulta);
//   return rows; // devuelvo el arreglo de horarios disponibles
// }

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
    WHERE h.disponible = true
    ORDER BY h.fecha, h.hora;
  `;

  const { rows } = await pool.query(consulta);
  return rows;
}

