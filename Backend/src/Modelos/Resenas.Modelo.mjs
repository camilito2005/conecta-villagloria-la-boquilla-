import  pool from "../Configuracion/Conexion.mjs";

// Obtener reseñas de un producto con datos del usuario
export async function ObtenerResenasPorProducto(id_producto) {
  try {
    const consulta = `
      SELECT 
        r.*,
        u.nombre as nombre_usuario,
        u.email as email_usuario
      FROM reseñas r
      INNER JOIN usuarios u ON r.id_usuario = u.id_usuario
      WHERE r.id_producto = $1
      ORDER BY r.fecha DESC
    `;

    const { rows } = await pool.query(consulta, [id_producto]);
    return rows;
  } catch (error) {
    console.error("Error al obtener reseñas:", error);
    throw error;
  }
}

// Obtener promedio de calificación de un producto
export async function ObtenerPromedioCalificacion(id_producto) {
  try {
    const consulta = `
      SELECT ROUND(AVG(puntuacion)::numeric, 1) as promedio
      FROM reseñas
      WHERE id_producto = $1
    `;

    const { rows } = await pool.query(consulta, [id_producto]);
    return parseFloat(rows[0]?.promedio) || 0;
  } catch (error) {
    console.error("Error al obtener promedio:", error);
    throw error;
  }
}

// Insertar una nueva reseña
export async function InsertarResena(resena) {
  try {
    const { id_usuario, id_producto, puntuacion, comentario } = resena;

    const consulta = `
      INSERT INTO reseñas (id_usuario, id_producto, puntuacion, comentario, fecha)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id_reseña
    `;

    const { rows } = await pool.query(consulta, [
      id_usuario,
      id_producto,
      puntuacion,
      comentario,
    ]);

    return rows[0]?.id_reseña;
  } catch (error) {
    console.error("Error al insertar reseña:", error);
    throw error;
  }
}

// Actualizar una reseña (solo si es del mismo usuario)
export async function ActualizarResena(id_resena, resena) {
  try {
    const { puntuacion, comentario, id_usuario } = resena;

    const consulta = `
      UPDATE reseñas 
      SET 
        puntuacion = $1,
        comentario = $2,
        fecha = NOW()
      WHERE id_reseña = $3 AND id_usuario = $4
      RETURNING id_reseña
    `;

    const { rows } = await pool.query(consulta, [
      puntuacion,
      comentario,
      id_resena,
      id_usuario,
    ]);

    return rows.length > 0;
  } catch (error) {
    console.error("Error al actualizar reseña:", error);
    throw error;
  }
}

// Eliminar una reseña (solo si es del mismo usuario)
export async function EliminarResena(id_resena, id_usuario) {
  try {
    const consulta = `
      DELETE FROM reseñas 
      WHERE id_reseña = $1 AND id_usuario = $2
      RETURNING id_reseña
    `;

    const { rows } = await pool.query(consulta, [id_resena, id_usuario]);

    return rows.length > 0;
  } catch (error) {
    console.error("Error al eliminar reseña:", error);
    throw error;
  }
}

// Verificar si un usuario ya reseñó un producto
export async function UsuarioYaReseno(id_usuario, id_producto) {
  try {
    const consulta = `
      SELECT id_reseña 
      FROM reseñas 
      WHERE id_usuario = $1 AND id_producto = $2
    `;

    const { rows } = await pool.query(consulta, [id_usuario, id_producto]);

    return rows.length > 0;
  } catch (error) {
    console.error("Error al verificar reseña:", error);
    throw error;
  }
}