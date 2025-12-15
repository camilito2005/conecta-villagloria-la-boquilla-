import pool from "../Configuracion/Conexion.mjs";
export async function ObtenerCargos() {
  try{
  // Realiza la consulta parametrisada a la base de datos para obtener los cargos
  const consulta = "SELECT * FROM cargo ORDER BY id_cargo";

   const { rows } = await pool.query(consulta);
    return rows;
  } catch (error) {
    console.error("Error al obtener cargos:", error);
    throw error;
  }
}

export async function Registrar_cargo(nombre) {
  try {
    // Primero verificar si ya existe
    const checkQuery = `SELECT * FROM cargo WHERE cargo = $1`;
    const { rows: existing } = await pool.query(checkQuery, [nombre]);

    if (existing.length > 0) {
      return {
        success: false,
        message: "El cargo ya existe",
        duplicate: true,
      };
    }

    const Query = `INSERT INTO cargo (cargo) VALUES ($1) RETURNING *`;
    const { rows } = await pool.query(Query, [nombre]);
    return {
      success: true,
      data: rows[0],
    };
  } catch (error) {
    console.error("algo salio mal", error);
    throw error;
  }
}

export async function EditarCargos(id_cargo, nombre) {
  try {
    if (!id_cargo || !nombre) {
      throw new Error("id_cargo y nombre son requeridos");
    }

    if (nombre.trim().length === 0) {
      throw new Error("El nombre no puede estar vacío");
    }
    const Consulta = `
      UPDATE cargo 
      SET cargo = $1
      WHERE id_cargo = $2
      RETURNING *
    `;

    const Valores = [nombre.trim(), id_cargo];

    const { rows } = await pool.query(Consulta, Valores);
     // Validar si se encontró el cargo
    if (rows.length === 0) {
      throw new Error(`No se encontró el cargo con id: ${id_cargo}`);
    }
    return rows[0];
  } catch (error) {
    console.error("error al Editar cargo", error);
    throw error;
  }
}

export async function Eliminar_Cargos(id_cargo) {
  try {
    // Verificar si el cargo está siendo usado (ejemplo)
    const checkQuery = `SELECT COUNT(*) FROM usuarios WHERE id_cargo = $1`;
    const { rows: check } = await pool.query(checkQuery, [id_cargo]);

    if (parseInt(check[0].count) > 0) {
      return {
        success: false,
        message:
          "No se puede eliminar el cargo porque está asignado a empleados",
        inUse: true,
      };
    }

    const Consulta = `DELETE FROM cargo WHERE id_cargo = $1 RETURNING *`;
    const { rows } = await pool.query(Consulta, [id_cargo]);

    // Validar si se eliminó algo
    if (rows.length === 0) {
      return {
        success: false,
        message: "Cargo no encontrado",
      };
    }

    return {
      success: true,
      data: rows[0],
      message: "Cargo eliminado exitosamente",
    };
  } catch (error) {
    console.error("error al eliminar cargo", error);
    throw error;
  }
}
