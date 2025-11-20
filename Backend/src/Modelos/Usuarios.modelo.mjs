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
  const consulta = "SELECT u.id_usuario,u.nombre,u.email,c.cargo AS descripcion_cargo,u.imagen_url,u.telefono,u.direccion,u.identificacion,u.estado FROM  public.usuarios u INNER JOIN public.cargo c ON u.id_cargo = c.id_cargo WHERE u.estado = 'activo' ";
  const { rows } = await pool.query(consulta);
  return rows;
}
export async function BuscarUsuarioPorEmail(email) {
  // console.log("Buscando usuario por email:", email);
  const consulta = `
    SELECT u.id_usuario, u.nombre, u.email,u.contraseña, u.id_cargo, u.imagen_url, u.telefono, u.direccion, u.estado, 
           c.cargo AS descripcion_cargo
    FROM usuarios u
    INNER JOIN cargo c ON u.id_cargo = c.id_cargo
    WHERE u.email = $1
  `;
  const { rows } = await pool.query(consulta, [email]);
  // console.log("Usuario encontrado por email:", rows[0]);
  if (rows === undefined || rows.length === 0) {
    return null;
  }
  return rows[0];
}

export async function Actualizar_Perfil_Admin(usuarioId, DatosActualizados) {
  try {
    const consulta = `UPDATE usuarios
                      SET nombre = $1,
                          email = $2,
                          telefono = $3,
                          id_cargo = $4
                      WHERE id_usuario = $5
                      RETURNING id_usuario, nombre, email, telefono, id_cargo`;
    const Valores = [
      DatosActualizados.nombre,
      DatosActualizados.email,
      DatosActualizados.telefono,
      DatosActualizados.id_cargo,
      usuarioId,
    ];
    const { rows } = await pool.query(consulta, Valores);
    return rows[0]; // Devuelve el usuario actualizado
  } catch (error) {
    throw error;
  }
}

export async function EliminarUsuario(usuarioId) {
  try {
    const consulta = `UPDATE usuarios set estado = 'inactivo' WHERE id_usuario = $1 RETURNING id_usuario, nombre, email, estado`;
    const { rows } = await pool.query(consulta, [usuarioId]);
    return rows[0]; // Devuelve el usuario eliminado (inactivado)
  } catch (error) {
    throw error;
  }
}

export async function BuscarUsuarioPorId(usuarioId) {
  const consulta = `
    SELECT u.id_usuario, u.nombre, u.email, u.id_cargo, u.imagen_url, u.telefono, u.direccion, u.estado, 
           c.cargo AS descripcion_cargo
    FROM usuarios u
    INNER JOIN cargo c ON u.id_cargo = c.id_cargo
    WHERE u.id_usuario = $1
  `;
  const { rows } = await pool.query(consulta, [usuarioId]);
  if (rows === undefined || rows.length === 0) {
    return null;
  }
  return rows[0];
}
export async function Comparacontraseñas(contraseña,contraseñahased){
  const consulta = "SELECT * FROM usuarios where contraseña = $1";
  const {Filas} = await pool.query(consulta, [contraseña,contraseñahased]);
  // console.log("Resultado de la comparacion de contraseñas", Filas[0]);
}