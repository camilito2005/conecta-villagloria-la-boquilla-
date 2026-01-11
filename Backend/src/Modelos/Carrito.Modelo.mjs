import pool  from "../Configuracion/Conexion.mjs";

// Obtener carrito de un usuario
export async function ObtenerCarritoPorUsuario(id_usuario) {
  try {
    const consulta = `
      SELECT 
        c.*,
        p.nombre,
        p.precio,
        p.stock,
        p.imagen_url,
        p.descripcion
      FROM carrito c
      INNER JOIN productos p ON c.id_producto = p.id_producto
      WHERE c.id_usuario = $1
      ORDER BY c.fecha_agregado DESC
    `;

    const { rows } = await pool.query(consulta, [id_usuario]);
    return rows;
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    throw error;
  }
}

// Agregar producto al carrito
export async function AgregarAlCarrito(id_usuario, id_producto, cantidad) {
  try {
    // validar stock del producto
    const consultaStock = `
      SELECT stock FROM productos WHERE id_producto = $1
    `;
    const { rows: stockRows } = await pool.query(consultaStock, [id_producto]);
    if (stockRows.length === 0 || stockRows[0].stock < cantidad) {
      throw new Error("Stock insuficiente");
    }

    const consulta = `
      INSERT INTO carrito (id_usuario, id_producto, cantidad)
      VALUES ($1, $2, $3)
      ON CONFLICT (id_usuario, id_producto) 
      DO UPDATE SET cantidad = carrito.cantidad + $3
      RETURNING *
    `;

    const { rows } = await pool.query(consulta, [id_usuario, id_producto, cantidad]);
    return rows[0];
  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    throw error;
  }
}

// Actualizar cantidad de un producto
export async function ActualizarCantidadCarrito(id_usuario, id_producto, cantidad) {
  try {
    const consulta = `
      UPDATE carrito 
      SET cantidad = $3
      WHERE id_usuario = $1 AND id_producto = $2
      RETURNING *
    `;

    const { rows } = await pool.query(consulta, [id_usuario, id_producto, cantidad]);
    return rows[0];
  } catch (error) {
    console.error("Error al actualizar cantidad:", error);
    throw error;
  }
}

// Eliminar producto del carrito
export async function EliminarDelCarrito(id_usuario, id_producto) {
  try {
    const consulta = `
      DELETE FROM carrito 
      WHERE id_usuario = $1 AND id_producto = $2
      RETURNING *
    `;

    const { rows } = await pool.query(consulta, [id_usuario, id_producto]);
    return rows.length > 0;
  } catch (error) {
    console.error("Error al eliminar del carrito:", error);
    throw error;
  }
}

// Vaciar carrito de un usuario
export async function VaciarCarrito(id_usuario) {
  try {
    const consulta = `
      DELETE FROM carrito 
      WHERE id_usuario = $1
    `;

    await pool.query(consulta, [id_usuario]);
    return true;
  } catch (error) {
    console.error("Error al vaciar carrito:", error);
    throw error;
  }
}

// Sincronizar carrito desde localStorage
export async function SincronizarCarrito(id_usuario, productosLocalStorage) {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    for (const producto of productosLocalStorage) {
      const consulta = `
        INSERT INTO carrito (id_usuario, id_producto, cantidad)
        VALUES ($1, $2, $3)
        ON CONFLICT (id_usuario, id_producto) 
        DO UPDATE SET cantidad = GREATEST(carrito.cantidad, $3)
      `;
      
      await client.query(consulta, [
        id_usuario,
        producto.id_producto,
        producto.cantidad
      ]);
    }

    await client.query('COMMIT');
    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error al sincronizar carrito:", error);
    throw error;
  } finally {
    client.release();
  }
}