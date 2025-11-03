import pool from "../Configuracion/Conexion.mjs";

export async function CompararIdentificacion(identificacion) {
  const consulta = "SELECT * FROM usuarios WHERE identificacion = $1";
  const { rows } = await pool.query(consulta, [identificacion]);
  return rows.length > 0;

}
export async function CompararEmail(email) {
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const { rows } = await pool.query(consulta, [email]);
  return rows.length > 0;
}

export async function RegistrarUsuario(NuevoUsuario) {
  const consulta = `
    INSERT INTO usuarios (nombre, email, contraseña, id_cargo, imagen_url, telefono, direccion, identificacion)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id_usuario AS id
  `;
  const Valores = [
    NuevoUsuario.nombre,
    NuevoUsuario.email,
    NuevoUsuario.password,
    NuevoUsuario.cargo,
    NuevoUsuario.foto,
    NuevoUsuario.telefono,
    NuevoUsuario.direccion,
    NuevoUsuario.identificacion
  ];
  const { rows } = await pool.query(consulta, Valores);
  
  return { id: rows[0].id, ...NuevoUsuario };// devuelvo el id del nuevo usuario junto con los demás datos
}
export async function ObtenerUsuarios() {
  const consulta = "SELECT u.id_usuario,u.nombre,u.email,c.cargo AS descripcion_cargo,u.imagen_url,u.telefono,u.direccion,u.identificacion,u.estado FROM  public.usuarios u INNER JOIN public.cargo c ON u.id_cargo = c.id_cargo";
  const { rows } = await pool.query(consulta);
  return rows;
}
export async function BuscarUsuarioPorEmail(email) {
  const consulta = "SELECT * FROM usuarios WHERE email = $1";
  const { rows } = await pool.query(consulta, [email]);
  console.log("Usuario encontrado por email:", rows[0]);
  if (rows === undefined || rows.length === 0) {
    return null;
  }
  return rows[0];
}
export async function Comparacontraseñas(contraseña,contraseñahased){
  const consulta = "SELECT * FROM usuarios where contraseña = $1";
  const {Filas} = await pool.query(consulta, [contraseña,contraseñahased]);
  console.log("Resultado de la comparacion de contraseñas", Filas[0]);
}