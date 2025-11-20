import { Router } from "express";
import { upload } from "../Middlewares/upload.mjs";
import { RegistrarUsuarios } from "../Controladores/Usuarios.controlador.mjs";
import { ListarUsuarios } from "../Controladores/Usuarios.controlador.mjs";
import { PerfilAdmin } from "../Controladores/Usuarios.controlador.mjs";
import { ActualizarPerfilAdmin } from "../Controladores/Usuarios.controlador.mjs";
import { AutenticarUsuario } from "../Controladores/Usuarios.controlador.mjs";
import { CerrarSesion } from "../Controladores/Usuarios.controlador.mjs";   
import { VerificarToken } from "../Middlewares/Auth.mjs";
import { Eliminarusuario } from "../Controladores/Usuarios.controlador.mjs";

const router = Router(); // esta variable nos permite crear rutas

// router.post("/Registrarusuarios",RegistrarUsuarios);
router.post("/Registrarusuarios", upload.single("foto"), RegistrarUsuarios);
router.get("/Listarusuarios",VerificarToken, ListarUsuarios);
router.get("/perfil_admin/:usuarioId",VerificarToken, PerfilAdmin);
router.put("/actualizar_perfil_admin/:usuarioId",VerificarToken, ActualizarPerfilAdmin);
router.post("/Eliminarusuario/:usuarioId",VerificarToken,Eliminarusuario);
router.post("/Login", AutenticarUsuario); // nueva ruta para autenticacion
router.post("/verificar", VerificarToken);
router.post("/logout", CerrarSesion);


export default router; // exporta las rutas para usarlas en otros archivos  