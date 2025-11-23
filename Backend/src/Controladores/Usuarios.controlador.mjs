import {
  RegistrarUsuario
} from "../Modelos/Usuarios.modelo.mjs";
import { ObtenerUsuarios } from "../Modelos/Usuarios.modelo.mjs";
import { CompararEmail } from "../Modelos/Usuarios.modelo.mjs";
import { BuscarUsuarioPorEmail } from "../Modelos/Usuarios.modelo.mjs";
import { BuscarUsuarioPorId } from "../Modelos/Usuarios.modelo.mjs";
import { Actualizar_Perfil_Admin } from "../Modelos/Usuarios.modelo.mjs";
import { Inactivarusuarios } from "../Modelos/Usuarios.modelo.mjs";
import { ObtenerUsuariosInactivos } from "../Modelos/Usuarios.modelo.mjs";
import { RestaurarUsuarios } from "../Modelos/Usuarios.modelo.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function RegistrarUsuarios(req, res) {
  try {
    const NuevoUsuario = req.body;
    NuevoUsuario.foto = req.file ? req.file.filename : null;
    // verifico que la foto no se ningun archivo extraño

    const rutaImagen = `/Recursos/${NuevoUsuario.foto}`; // Ruta relativa para almacenar en la base de datos
    NuevoUsuario.foto = rutaImagen;

    // Validar que todos los campos estén presentes

    if (
      !NuevoUsuario.nombre ||
      !NuevoUsuario.email ||
      !NuevoUsuario.password ||
      !NuevoUsuario.comfirm_password ||
      !NuevoUsuario.cargo ||
      !NuevoUsuario.telefono 
    ) {
      return res.status(400).json({
        error: "Faltan datos obligatorios",
        showModal: true,
        modal: {
          title: "Datos incompletos",
          message: "Faltan datos obligatorios",
          type: "error",
        },
      });
    }
    
    const email = NuevoUsuario.email;
    const existeEmail = await CompararEmail(email);
    if (existeEmail == true) {
      return res.status(400).json({
        error: "El email ya está en uso",
        showModal: true,
        modal: {
          title: "Email inválido",
          message: "El email ya está en uso",
          type: "error",
        },
      });
    }
    const contraseña = NuevoUsuario.password.trim();
    if (contraseña.length < 6) {
      return res.status(400).json({
        error: "La contraseña debe tener al menos 6 caracteres",
        showModal: true,
        modal: {
          title: "Contraseña inválida",
          message: "La contraseña debe tener al menos 6 caracteres",
          type: "error",
        },
      });
    }
    const confirmar_contraseña = NuevoUsuario.comfirm_password.trim();

    if (confirmar_contraseña !== NuevoUsuario.password) {
      return res.status(400).json({
        error: "Las contraseñas no coinciden",
        showModal: true,
        modal: {
          title: "Contraseña inválida",
          message: "Las contraseñas no coinciden",
          type: "error",
        },
      });
    }
    // si el rol del usuario no es turista
    if (NuevoUsuario.cargo != 1) {
      return res.status(400).json({
        error: "Rol de usuario inválido",
        showModal: true,
        modal: {
          title: "Error",
          message: "El rol de usuario no es válido",
          type: "error",
        },
      });
    }
    // hasheo la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    NuevoUsuario.password = await bcrypt.hash(NuevoUsuario.password, salt);

    const resultado = await RegistrarUsuario(NuevoUsuario);
    // console.log("Resultado de la inserción:", resultado);

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: NuevoUsuario,
    });
    return resultado.showModal;
  } catch (error) {
    console.error("Error en Registrarusuarios:", error);
    res.status(500).json({
      error: "Error al registrar usuario",
      showModal: true,
      modal: {
        title: "Error del servidor",
        message: "Ocurrió un error al registrar el usuario",
        type: "error",
      },
    });
  }
}

export async function ListarUsuarios(req, res) {
  try {
    const usuarios = await ObtenerUsuarios();
    if (!usuarios || usuarios.length === 0) {
      return res.status(404).json({
        error: "No hay usuarios",
        showModal: true,
        modal: {
          title: "Sin usuarios",
          message: "No se encontraron usuarios",
          type: "error",
        },
      });
    }
    // <-- devolver el arreglo directamente
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error en ListarUsuarios:", error);
    res.status(500).json({ error: "Error al listar usuarios" });
  }
}

export async function PerfilAdmin(req, res) {
  try {
    const { usuarioId } = req.params; // Obtengo el ID del usuario desde los parámetros de la ruta

    const DatosUsuario = await BuscarUsuarioPorId(usuarioId);
    if (!DatosUsuario) {
      return res.status(404).json({
        error: "Usuario no encontrado",
        showModal: true,
        modal: {
          title: "Error",
          message: "No se encontró el usuario solicitado",
          type: "error",
        },
      });
    }
    res.status(200).json(DatosUsuario);
  } catch (error) {
    console.error("Error en PerfilAdmin:", error);
    res.status(500).json({
      error: "Error al obtener el perfil del usuario",
    });
  }
}

export async function ActualizarPerfilAdmin(req, res) {
  try {
    const { usuarioId } = req.params; // Obtengo el ID del usuario desde los parámetros de la ruta
    const { nombre, email, telefono, id_cargo } = req.body;

    const DatosActualizados = {
      nombre,
      email,
      telefono,
      id_cargo,
    };

    const UsuarioActualizado = await Actualizar_Perfil_Admin(
      usuarioId,
      DatosActualizados
    );
    if (!UsuarioActualizado) {
      return res.status(404).json({
        error: "Usuario no encontrado",
        showModal: true,
        modal: {
          title: "Error",
          message: "No se encontró el usuario para actualizar",
          type: "error",
        },
      });
    }
    if (UsuarioActualizado) {
      return res.status(200).json({
        mensaje: "Usuario actualizado correctamente",
        showModal: true,
        modal: {
          title: "Éxito",
          message: "El perfil del usuario ha sido actualizado",
          type: "success",
        },
      });
    }
  } catch (error) {
    console.error("Error en ActualizarPerfilAdmin:", error);
    res.status(500).json({
      error: "Error al actualizar el perfil del usuario",
    });
  }
}

export async function Inactivarusuario(req, res) {
  try {
    const { usuarioId } = req.params;
    const UsuarioEliminado = await Inactivarusuarios(usuarioId);
    if (!UsuarioEliminado) {
      return res.status(404).json({
        error: "Usuario no encontrado",
        showModal: true,
        modal: {
          title: "Error",
          message: "No se encontró el usuario para eliminar",
          type: "error",
        },
      });
    }
    if (UsuarioEliminado) {
      return res.status(200).json({
        mensaje: "Usuario eliminado correctamente",
        showModal: true,
        modal: {
          title: "Éxito",
          message: "El usuario ha sido eliminado",
          type: "success",
        },
      });
    }
  } catch (error) {
    console.error("Error en Eliminarusuario:", error);
    res.status(500).json({
      error: "Error al eliminar el usuario",
    });
  }
}

// autenticacion y sesiones en nodejs
// falta por implementar
export async function AutenticarUsuario(req, res) {
  let usuario;
  try {
    const { email } = req.body;
    const { password } = req.body; // esta es la contraseña ingresada por el usuario
    const { id_cargo } = req.body;
    if (!email) {
      res.status(400).json({
        error: "no hay email",
        showModal: true,
        modal: {
          title: "Error",
          message: "No hay ningun email ingresado",
          type: "error",
        },
      });
    }

    usuario = await BuscarUsuarioPorEmail(email);
    if (!usuario) {
      return res.status(404).json({
        error: "Usuario no encontrado",
        showModal: true,
        modal: {
          title: "Error",
          message: "No hay ningún usuario con el email ingresado",
          type: "error",
        },
      });
    }
    // si el estado del usuario es = "inactivo" no puede iniciar sesion
    if (usuario.estado === "inactivo") {
      return res.status(403).json({
        error: "Usuario inactivo",
        showModal: true,
        modal: {
          title: "Usuario inactivo",
          message: "El usuario está inactivo. Contacta al administrador.",
          type: "error",
        },
      });
    }
    const contraseñaHashed = usuario.contraseña;
    // const contraseñaHashed = password;

    const Comparar = await bcrypt.compare(password, contraseñaHashed);

    // console.log("¿Las contraseñas coinciden?", Comparar);
    if (Comparar == true) {
      // 🔑 Generar el token
      const token = jwt.sign(
        {
          id: usuario.id_usuario, //
          nombre: usuario.nombre, //
          rol: usuario.id_cargo,
          cargo: usuario.descripcion_cargo, //
          estado: usuario.estado,
          correo: usuario.email, //
          contacto: usuario.telefono, //
          direccion: usuario.direccion, //
          foto: usuario.imagen_url, //
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
      res.cookie("token_acceso", token, {
        httpOnly: true,
        secure: false, // true en producción con HTTPS
        sameSite: "lax",
        maxAge: 2 * 60 * 60 * 1000, // 2 horas
      });

      // console.log("el token creado es; "+token);
    } else if (Comparar == false) {
      return res.status(500).json({
        error: "INVALIDO",
        showModal: true,
        modal: {
          title: "Credenciales incorrectos",
          message: "la contraseña es incorrecta",
          type: "error",
        },
      });
    }
    return res.json({ usuario });
  } catch (error) {
    console.error("Error al buscar el email del usuario:", error);
    return res.status(500).json({
      error: "Error interno del servidor",
      showModal: true,
      modal: {
        title: "Error del servidor",
        message: "Ocurrió un error al procesar la solicitud",
        type: "error",
      },
    });
  }
}

export async function CerrarSesion(req, res) {
  try {
    res.clearCookie("token_acceso", {
      httpOnly: true,
      secure: false, // true si usas HTTPS en producción
      sameSite: "lax", // esta propiedad ayuda a prevenir ataques CSRF
    });

    return res.json({
      showModal: true,
      modal: {
        title: "Sesión cerrada",
        message: "Has cerrado sesión correctamente.",
        type: "success",
      },
    });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return res.status(500).json({
      showModal: true,
      modal: {
        title: "Error",
        message: "No se pudo cerrar la sesión.",
        type: "error",
      },
    });
  }
}

export async function UsuariosInactivos(req, res) {
  try {
    const usuariosInactivos = await ObtenerUsuariosInactivos();
    if (!usuariosInactivos || usuariosInactivos.length === 0) {
      return res.status(404).json({
        error: "No hay usuarios inactivos",
        showModal: true,
        modal: {
          title: "Sin usuarios inactivos",
          message: "No se encontraron usuarios inactivos",
          type: "error",
        },
      });
    }
    res.status(200).json(usuariosInactivos);
  } catch (error) {
    console.error("Error en UsuariosInactivos:", error);
    res.status(500).json({ error: "Error al obtener usuarios inactivos" });
  }
}

export async function RestaurarUsuario(req, res) {
  try {
    const { id } = req.params;
    const usuarioRestaurado = await RestaurarUsuarios(id);
    if (!usuarioRestaurado) {
      return res.status(404).json({
        error: "Usuario no encontrado",
        showModal: true,
        modal: {
          title: "Error",
          message: "No se encontró el usuario para restaurar",
          type: "error",
        },
      });
    }
    if (usuarioRestaurado) {
      return res.status(200).json({
        mensaje: "Usuario restaurado correctamente",
        showModal: true,
        modal: {
          title: "Éxito",
          message: "El usuario ha sido restaurado",
          type: "success",
        },
      });
    }
  } catch (error) {
    console.error("Error en RestaurarUsuario:", error);
    res.status(500).json({
      error: "Error al restaurar el usuario",
    });
  }
}
