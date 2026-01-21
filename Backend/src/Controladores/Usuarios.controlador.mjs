import { RegistrarUsuario } from "../Modelos/Usuarios.modelo.mjs";
import { ObtenerUsuarios } from "../Modelos/Usuarios.modelo.mjs";
import { CompararEmail } from "../Modelos/Usuarios.modelo.mjs";
import { BuscarUsuarioPorEmail } from "../Modelos/Usuarios.modelo.mjs";
import { BuscarUsuarioPorId } from "../Modelos/Usuarios.modelo.mjs";
import { Actualizar_Perfil_Admin } from "../Modelos/Usuarios.modelo.mjs";
import { Inactivarusuarios } from "../Modelos/Usuarios.modelo.mjs";
import { ObtenerUsuariosInactivos } from "../Modelos/Usuarios.modelo.mjs";
import { RestaurarUsuarios } from "../Modelos/Usuarios.modelo.mjs";
import { EliminarUsuarios } from "../Modelos/Usuarios.modelo.mjs";
import {Actualizar_Mi_Perfil} from "../Modelos/Usuarios.modelo.mjs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function RegistrarUsuarios(req, res) {
  try {
    const NuevoUsuario = req.body;aa
    // console.log("datos de usuario",req.body);

    // -------------------------------
    // MANEJO DE IMAGEN OPCIONAL
    // -------------------------------
    // if (req.file) {
    //   // aseguramos que multer filtró bien la imagen
    //   const nombreSeguro = req.file.filename;

    //   // prevenir intentos de path traversal
    //   if (nombreSeguro.includes("..")) {
    //     return res.status(400).json({
    //       showModal: true,
    //       modal: {
    //         title: "Archivo inválido",
    //         message: "El nombre de la imagen no es válido",
    //         type: "error",
    //       },
    //     });
    //   }

    //   NuevoUsuario.foto = `/Recursos/${nombreSeguro}`;
    // } else {
    //   // si no hay imagen, queda null
    //   NuevoUsuario.foto = null;
    // }

    // -------------------------------
    // VALIDACIÓN GENERAL DE CAMPOS
    // -------------------------------
    if (
      !NuevoUsuario.nombre ||
      !NuevoUsuario.email ||
      !NuevoUsuario.password ||
      !NuevoUsuario.comfirm_password ||
      !NuevoUsuario.cargo ||
      !NuevoUsuario.telefono
    ) {
      return res.status(400).json({
        showModal: true,
        modal: {
          title: "Datos incompletos",
          message: "Debe completar todos los campos obligatorios",
          type: "error",
        },
      });
    }

    // Email repetido
    const existeEmail = await CompararEmail(NuevoUsuario.email);
    if (existeEmail) {
      return res.status(400).json({
        showModal: true,
        modal: {
          title: "Email inválido",
          message: "El email ya está en uso",
          type: "error",
        },
      });
    }

    // Contraseña muy corta
    if (NuevoUsuario.password.trim().length < 6) {
      return res.status(400).json({
        showModal: true,
        modal: {
          title: "Contraseña inválida",
          message: "Debe tener al menos 6 caracteres",
          type: "error",
        },
      });
    }

    // Contraseñas diferentes
    if (NuevoUsuario.comfirm_password.trim() !== NuevoUsuario.password) {
      return res.status(400).json({
        showModal: true,
        modal: {
          title: "Contraseña inválida",
          message: "Las contraseñas no coinciden",
          type: "error",
        },
      });
    }

    // Rol permitido (solo turista)
    if (NuevoUsuario.cargo != 1) {
      return res.status(400).json({
        showModal: true,
        modal: {
          title: "Error",
          message: "El rol de usuario no es válido",
          type: "error",
        },
      });
    }

    // -------------------------------
    // HASHEAR CONTRASEÑA
    // -------------------------------
    const salt = await bcrypt.genSalt(10);
    NuevoUsuario.password = await bcrypt.hash(NuevoUsuario.password, salt);

    // -------------------------------
    // GUARDAR EN BD
    // -------------------------------
    const resultado = await RegistrarUsuario(NuevoUsuario);

    return res.status(201).json({
       showModal: true,
        modal: {
          title: "exito",
          message: "Usuario creado extosamente",
          type: "success",
        },
      mensaje: "Usuario registrado correctamente",
      usuario: resultado,
    });
  } catch (error) {
    console.error("Error en RegistrarUsuarios:", error);
    return res.status(500).json({
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
          message: "El usuario ha sido inactivado",
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
        secure: true, // true en producción con HTTPS
        sameSite: "lax",
        sameSite: "None",
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
      secure: true, // true si usas HTTPS en producción
      sameSite: "None",   // 🔴 DEBE SER IGUAL
      path: "/",
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

export async function EliminarUsuario(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        error: "Faltan datos",
        showModal: true,
        modal: {
          title: "Error",
          message: "Falta el id del usuario",
          type: "error",
        },
      });
    }
    const usuarioEliminado = await EliminarUsuarios(id);
    if (!usuarioEliminado) {
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
    if (usuarioEliminado) {
      return res.status(200).json({
        mensaje: "Usuario eliminado correctamente",
        showModal: true,
        modal: {
          title: "Éxito",
          message: "El usuario ha sido eliminado definitivamente",
          type: "success",
        },
      });
    }
  } catch (error) {
    console.error("Error en EliminarUsuario:", error);
    res.status(500).json({
      error: "Error al eliminar el usuario",
      showModal: true,
      modal: {
        title: "Error",
        message: "Hubo un problema al eliminar el usuario",
        type: "error",
      },
    });
  }
}

export async function ActualizarMiPerfil(req, res) {
  try {
    const usuarioId = req.usuario.id; // lo inyecta VerificarToken
    const { nombre, email, telefono, direccion } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({
        showModal: true,
        modal: {
          title: "Datos incompletos",
          message: "Nombre y email son obligatorios",
          type: "error",
        },
      });
    }

    // Si el email cambió, comprobar unicidad
    const usuarioActual = await BuscarUsuarioPorId(usuarioId);
    if (!usuarioActual) {
      return res.status(404).json({
        showModal: true,
        modal: {
          title: "Error",
          message: "Usuario no encontrado",
          type: "error",
        },
      });
    }

    if (email !== usuarioActual.email) {
      const emailEnUso = await CompararEmail(email);
      if (emailEnUso) {
        return res.status(400).json({
          showModal: true,
          modal: {
            title: "Email inválido",
            message: "El email ya está en uso",
            type: "error",
          },
        });
      }
    }

    // Ejecutar actualización en DB
    const actualizado = await Actualizar_Mi_Perfil(usuarioId, {
      nombre,
      email,
      telefono,
      direccion,
    });

    if (!actualizado) {
      return res.status(500).json({
        showModal: true,
        modal: {
          title: "Error",
          message: "No se pudo actualizar el usuario",
          type: "error",
        },
      });
    }
    

    // Re-crea el token con la información nueva (para que cookie tenga los datos actualizados)
    const tokenPayload = {
      id: actualizado.id_usuario,
      nombre: actualizado.nombre,
      rol: actualizado.id_cargo,
      cargo: actualizado.descripcion_cargo || actualizado.cargo || null,
      estado: actualizado.estado,
      correo: actualizado.email,
      contacto: actualizado.telefono,
      direccion: actualizado.direccion,
      foto: actualizado.imagen_url || null,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "2h",
    });

    // Setea cookie actualizada (misma configuración que en el login)
    res.cookie("token_acceso", token, {
      httpOnly: true,
      secure: false, // true en producción con HTTPS
      sameSite: "lax",
      maxAge: 2 * 60 * 60 * 1000,
    });

    // Devuelve los datos actualizados (útil para front inmediatamente)
    return res.status(200).json({
      showModal: true,
      modal: 
      { title: "Éxito", 
        message: "Perfil actualizado", 
        type: "success" },
      usuario: actualizado,
    });
  } catch (error) {
    console.error("Error en ActualizarMiPerfil:", error);
    return res.status(500).json({
      showModal: true,
      modal: { title: "Error", message: "Error interno", type: "error" },
    });
  }
}

export async function ObtenerMiPerfil(req, res) {
  try {
    const usuarioId = req.usuario.id;
    const usuario = await BuscarUsuarioPorId(usuarioId);
    if (!usuario) {
      return res.status(404).json({ showModal: true, modal: { title: "Error", message: "Usuario no encontrado", type: "error" }});
    }
    return res.json({ usuario });
  } catch (error) {
    console.error("Error en ObtenerMiPerfil:", error);
    res.status(500).json({ showModal: true, modal: { title: "Error", message: "Error interno", type: "error" }});
  }
}
