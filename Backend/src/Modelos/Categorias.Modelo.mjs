import pool from "../Configuracion/Conexion.mjs";

export async function ObtenerCategorias() {
  try {
    const consulta = `
            SELECT  id, nombre, fecha_creacion, fecha_actualizacion
	FROM categorias order by id
        `;
    const { rows } = await pool.query(consulta);
    return rows;
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    throw error;
  }
}
export async function VerficarCategoriasExistente(nombre) {
  try {
    const consulta = `
            SELECT id FROM categorias WHERE nombre = $1
        `;
    const { rows } = await pool.query(consulta, [nombre]);
    return rows.length > 0;
  } catch (error) {
    console.error("Error al verificar categoría existente:", error);
    throw error;
  }
}
export async function InsertarCategoria(nombre, fecha_creacion) {
  try {
    const consulta = `INSERT INTO categorias (nombre, fecha_creacion) VALUES ($1, $2) RETURNING id`;
    const { rows } = await pool.query(consulta, [nombre, fecha_creacion]);
    return rows[0].id;
  } catch (error) {
    console.error("Error al insertar categoría:", error);
    throw error;
  } 
}

export async function EditarCategorias(id, nombre, fecha_actualizacion) {
  try {
    const consulta = `
      UPDATE categorias 
      SET nombre = $1, fecha_actualizacion = $2
      WHERE id = $3
      RETURNING *
    `;
    const valores = [nombre, fecha_actualizacion, id];
    const { rows } = await pool.query(consulta, valores);
    return rows[0];
    } catch (error) {
    console.error("Error al editar categoría:", error);
    throw error;
  }
}

export async function Eliminar_categorias(id) {
  try {
    const consulta = `DELETE FROM categorias WHERE id = $1 RETURNING *`;
    const { rows } = await pool.query(consulta, [id]);
    return rows[0];
  }
  catch (error) {
    console.error("Error al eliminar categoría:", error);
    throw error;
  }
}