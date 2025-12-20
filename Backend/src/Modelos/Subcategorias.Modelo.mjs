import pool from "../Configuracion/Conexion.mjs";

export async function ObtenerSubcategoriasModelo() {
  try {
    const consulta = `
            SELECT id, subcategoria, parent_id, categoria_id, fecha_creacion, fecha_actualizacion
            FROM subcategorias order by id ASC
        `;
    const { rows } = await pool.query(consulta);
    return rows;
  } catch (error) {
    console.error("Error al obtener subcategorías:", error);
    throw error;
  }
}

// ✅ NUEVA: Verificar si existe una subcategoría en una categoría
export async function VerificarSubcategoriaExistente(
  subcategoria,
  categoria_id
) {
  try {
    const consulta = `
      SELECT id 
      FROM subcategorias 
      WHERE LOWER(subcategoria) = LOWER($1) 
        AND categoria_id = $2
    `;
    const { rows } = await pool.query(consulta, [subcategoria, categoria_id]);
    return rows.length > 0;
  } catch (error) {
    console.error("Error al verificar subcategoría existente:", error);
    throw error;
  }
}

export async function InsertarSubcategoria(
  subcategoria,
  parent_id,
  categoria_id,
  fecha_creacion
) {
  try {
    const consulta = `
      INSERT INTO subcategorias 
        (subcategoria, parent_id, categoria_id, fecha_creacion) 
      VALUES ($1, $2, $3, $4) 
      RETURNING id
    `;
    const { rows } = await pool.query(consulta, [
      subcategoria,
      parent_id,
      categoria_id,
      fecha_creacion,
    ]);
    return rows[0].id;
  } catch (error) {
    console.error("Error al insertar subcategoría:", error);
    throw error;
  }
}

export async function Editar_subcategorias(
  id,
  subcategoria,
  parent_id,
  categoria_id,
  fecha_actualizacion
) {
  try {
    // ✅ CORREGIDO: Devolver toda la fila, no solo el id
    const consulta = `
      UPDATE subcategorias 
      SET 
        subcategoria = $1, 
        parent_id = $2, 
        categoria_id = $3, 
        fecha_actualizacion = $4 
      WHERE id = $5 
      RETURNING *
    `;
    const { rows } = await pool.query(consulta, [
      subcategoria,
      parent_id,
      categoria_id,
      fecha_actualizacion,
      id,
    ]);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error("Error al editar subcategoría:", error);
    throw error;
  }
}

export async function Eliminar_subcategorias(id) {
  try {
    // ✅ MEJORADO: Verificar si hay productos usando esta subcategoría
    const verificarProductos = `
      SELECT COUNT(*) as total 
      FROM productos 
      WHERE subcategoria_id = $1
    `;
    const { rows: productos } = await pool.query(verificarProductos, [id]);

    if (parseInt(productos[0].total) > 0) {
      throw new Error(
        `No se puede eliminar. Hay ${productos[0].total} producto(s) usando esta subcategoría`
      );
    }

    // ✅ CORREGIDO: Devolver toda la fila, no solo el id
    const consulta = `DELETE FROM subcategorias WHERE id = $1 RETURNING *`;
    const { rows } = await pool.query(consulta, [id]);

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    console.error("Error al eliminar subcategoría:", error);
    throw error;
  }
}
