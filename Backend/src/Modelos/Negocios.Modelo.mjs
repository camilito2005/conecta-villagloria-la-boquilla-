import pool from "../Configuracion/Conexion.mjs";

// Obtener todos los negocios de un usuario
export async function ObtenerNegociosPorUsuario(id_usuario) {
  try {
    const consulta = `
      SELECT * FROM negocios WHERE id_propietario = $1 order by id_negocio DESC
    `;
    const {rows} = await pool.query(consulta, [id_usuario]);
    return rows;
  } catch (error) {
    console.error("Error al obtener negocios:", error);
    throw error;
  }
}

// Obtener un negocio por ID
export async function ObtenerNegocioPorId(id_negocio) {
  try {
    const consulta = `
      SELECT * FROM negocios WHERE id_negocio = ?
    `;
    const [rows] = await pool.query(consulta, [id_negocio]);
    return rows[0] || null;
  } catch (error) {
    console.error("Error al obtener negocio:", error);
    throw error;
  }
}


// Insertar un nuevo negocio
export async function InsertarNegocio(negocio) {
  try {
    const { nombre, direccion, id_propietario } = negocio;

    const consulta = `
      INSERT INTO negocios (nombre, direccion, id_propietario)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const {rows} = await pool.query(consulta, [nombre, direccion, id_propietario]);
    return rows[0].id_negocio;
  } catch (error) {
    console.error("Error al insertar negocio:", error);
    throw error;
  }
}

// Actualizar un negocio
export async function ActualizarNegocio(id_negocio, negocio) {
  try {
    const { nombre, direccion } = negocio;

    const consulta = `
      UPDATE negocios
      SET nombre = $1, direccion = $2
      WHERE id_negocio = $3
    `;
    const {rows} = await pool.query(consulta, [nombre, direccion, id_negocio]);
    return rows;

  } catch (error) {
    console.error("Error al actualizar negocio:", error);
    throw error;
  }
}

// Eliminar un negocio
export async function EliminarNegocio(id_negocio) {
  try {
    const consulta = `
      DELETE FROM negocios WHERE id_negocio = $1
    `;
    const {rows} = await pool.query(consulta, [id_negocio]);
    return rows;            
  } catch (error) {
    console.error("Error al eliminar negocio:", error);
    throw error;
  }
}

export async function ObtenerTodosLosNegocios() {
  try {
    const consulta = `
      SELECT * FROM negocios ORDER BY id_negocio DESC
    `;
    const { rows } = await pool.query(consulta);
    return rows;
  } catch (error) {
    console.error("Error al obtener todos los negocios:", error);
    throw error;
  }
}