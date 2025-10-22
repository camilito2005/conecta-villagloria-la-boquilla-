import pool from "../Configuracion/Conexion.mjs";
export async function ObtenerCargos() {
    // Realiza la consulta parametrisada a la base de datos para obtener los cargos
    const consulta = await pool.query("SELECT * FROM cargo");
    const cargos = consulta.rows;
    return cargos;
}