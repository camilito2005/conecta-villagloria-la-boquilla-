import pool from "../Configuracion/Conexion.mjs";

export async function Listar_Productos() {
  try {
    const consulta = `SELECT 
        p.id_producto,
        p.id_usuario,
        p.nombre,
        p.precio,
        p.stock,
        p.categoria_id,
        p.subcategoria_id,
        p.descripcion,
        p.imagen_url,
        p.tipo_negocio,
        c.nombre AS categoria_nombre,
        s.subcategoria AS subcategoria_nombre,
        u.nombre AS usuario_nombre
      FROM productos p
      LEFT JOIN categorias c ON c.id = p.categoria_id
      LEFT JOIN subcategorias s ON s.id = p.subcategoria_id
      LEFT JOIN usuarios u ON u.id_usuario = p.id_usuario
      ORDER BY p.id_producto DESC `;

    const {rows} = await pool.query(consulta);
    return rows;
  } catch (error) {
    console.error("Error en Listar_Productos:", error);
    throw error;
  }
}

export async function ObtenerTodosLosProductos() {
  try {
    const consulta = `
      SELECT 
        p.id_producto,
        p.id_usuario,
        p.nombre,
        p.precio,
        p.stock,
        p.categoria_id,
        p.subcategoria_id,
        p.descripcion,
        p.imagen_url,
        p.id_negocio,
        c.nombre AS categoria_nombre,
        s.subcategoria AS subcategoria_nombre
      FROM productos p
      LEFT JOIN categorias c ON c.id = p.categoria_id
      LEFT JOIN subcategorias s ON s.id = p.subcategoria_id
      WHERE p.stock > 0
      ORDER BY p.id_producto DESC`;

    const {rows} = await pool.query(consulta);
    return rows;
    
  } catch (error) {
    console.error("Error en ObtenerTodosLosProductos:", error);
    throw error;
  }
}


export async function Listar_Productos_usuario(id_usuario) {
  try {
    const consulta = `
      SELECT 
        p.id_producto,
        p.id_usuario,
        p.nombre,
        p.precio,
        p.stock,
        p.categoria_id,
        p.subcategoria_id,
        p.descripcion,
        p.imagen_url,
        p.id_negocio
      FROM productos p
      WHERE p.id_usuario = $1
      ORDER BY p.id_producto DESC `;

    const {rows} = await pool.query(consulta, [id_usuario]);
    return rows;
  } catch (error) {
    console.error("Error en Listar_Productos_usuario:", error);
    throw error;
  }
}

export async function InsertarProducto(productos) {
  try {
    const consulta = `
      INSERT INTO productos (
        nombre,
        precio,
        stock,
        categoria_id,
        subcategoria_id,
        descripcion,
        imagen_url,
        id_negocio,
        id_usuario
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`;

    const {rows} = await pool.query(consulta, [
      productos.nombre,
      productos.precio,
      productos.stock,
      productos.categoria_id,
      productos.subcategoria_id,
      productos.descripcion,
      productos.imagen_url,
      productos.tipo_negocio,
      productos.id_usuario
    ]);

    return rows[0].id_producto;
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    throw error;
  }
}

export async function ActualizarProducto(id_producto, producto) {
  try {
    const consulta = `
      UPDATE productos 
      SET 
        nombre = $1,
        precio = $2,
        stock = $3,
        categoria_id = $4,
        subcategoria_id = $5,
        descripcion = $6,
        imagen_url = $7,
        id_negocio = $8
      WHERE id_producto = $9
      RETURNING *
    `;

    const { rows } = await pool.query(consulta, [
      producto.nombre,
      producto.precio,
      producto.stock,
      producto.categoria_id,
      producto.subcategoria_id,
      producto.descripcion,
      producto.imagen_url,
      producto.tipo_negocio,
      id_producto,
    ]);

    return rows.length > 0;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
}

// En tu archivo de modelo de productos
export async function ObtenerProductoPorId(id_producto) {
  try {
    const consulta = `
      SELECT * FROM productos 
      WHERE id_producto = $1
    `;

    const { rows } = await pool.query(consulta, [id_producto]);
    return rows[0] || null;
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    throw error;
  }
}

export async function EliminarProducto(id_producto) {
  try {
    const consulta = `
      DELETE FROM productos 
      WHERE id_producto = $1
    `;

    const { rowCount } = await pool.query(consulta, [id_producto]);
    return rowCount > 0;
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw error;
  }
}