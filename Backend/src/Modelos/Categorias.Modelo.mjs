import pool from "../Configuracion/Conexion.mjs";

export async function ObtenerCategorias() {
    try {
        const consulta = `
            SELECT  nombre, fecha_creacion, fecha_actualizacion
	FROM categorias
        `;
        const { rows } = await pool.query(consulta);
        return rows;
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        throw error;
    }
}