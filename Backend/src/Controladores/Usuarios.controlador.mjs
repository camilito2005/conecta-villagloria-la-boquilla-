
import { json } from "express";
import { CompararIdentificacion, RegistrarUsuario } from "../Modelos/Usuarios.modelo.mjs";
import { ObtenerUsuarios } from "../Modelos/Usuarios.modelo.mjs";
import { CompararEmail } from "../Modelos/Usuarios.modelo.mjs";


export async function RegistrarUsuarios(req, res) {
  try {
    const NuevoUsuario = req.body;
    NuevoUsuario.foto = req.file ? req.file.filename : null;

     const rutaImagen = `/Recursos/${NuevoUsuario.foto}`; // Ruta relativa para almacenar en la base de datos
     NuevoUsuario.foto = rutaImagen;

     
    // console.log("Nombre:", NuevoUsuario.nombre);
    // console.log("Email:", NuevoUsuario.email);
    // console.log("Contraseña:", NuevoUsuario.password);
    // console.log("Cargo:", NuevoUsuario.cargo);
    // console.log("Teléfono:", NuevoUsuario.telefono);
    // console.log("Dirección:", NuevoUsuario.direccion);
    // console.log("Identificación:", NuevoUsuario.identificacion);
    // console.log("Foto:", NuevoUsuario.foto);
   

    // Validar que todos los campos estén presentes
    if (!NuevoUsuario.nombre || !NuevoUsuario.email || !NuevoUsuario.password || !NuevoUsuario.cargo || !NuevoUsuario.telefono || !NuevoUsuario.direccion || !NuevoUsuario.identificacion) {
      return res.status(400).json({ 
        error: "Faltan datos obligatorios",
        showModal: true,
        modal: {
          title: "Datos incompletos",
          message: "Faltan datos obligatorios",
          type: "error"
        }
       });
    }

     const identificacion = NuevoUsuario.identificacion;
    const existeIdentificacion = await CompararIdentificacion(identificacion);
    if (existeIdentificacion == true) {
      return res.status(400).json({ 
        error: "La identificación ya está en uso",
        showModal: true,
        modal: {
          title: "Identificación inválida",
          message: "La identificación ya está en uso",
          type: "error"
        }
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
          type: "error"
        }
      });
    }

    if (!NuevoUsuario.foto) {
      return res.status(400).json({ 
        error: "Debe subir una foto",
        showModal: true,
        modal:{
          title: "Foto requerida",
          message: "Debe subir una foto",
          type: "error"
        }
       });
    }
    // verifico que la contraseña tenga al menos 6 caracteres
    if (NuevoUsuario.password.length < 6) {
      return res.status(400).json({
        error: "La contraseña debe tener al menos 6 caracteres",
        showModal: true,
        modal: {
        title: "Contraseña inválida",
        message: "La contraseña debe tener al menos 6 caracteres",
        type: "error"
        }
      }); }
    // muestro lo que me trae el resultado para llamar el modal en el frontend
    console.log("muestro el status de las verificaciones",res.statusCode);

    const resultado = await RegistrarUsuario(NuevoUsuario);
    console.log("Resultado de la inserción:", resultado);

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: NuevoUsuario,
    });
    // muestro lo que me trae el resultado para llamar el modal en el frontend
    console.log("resultado", resultado);
    console.log("resultado.showModal", resultado.showModal);
    return resultado.showModal;
    
  } catch (error) {
    console.error("Error en Registrarusuarios:", error);
    res.status(500).json({ 
      error: "Error al registrar usuario",
      showModal: true,
      modal: {
        title: "Error del servidor",
        message: "Ocurrió un error al registrar el usuario",
        type: "error"
      }
    });
  }
}
export async function ListarUsuarios(req, res) {
  try {
    const usuarios = await ObtenerUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error en ListarUsuarios:", error);
    res.status(500).json({ error: "Error al listar usuarios" });
  }
}
