import { Router } from "express";
import { upload } from "../Middlewares/upload.mjs";
import { RegistrarUsuarios } from "../Controladores/Usuarios.controlador.mjs";
import { ListarUsuarios } from "../Controladores/Usuarios.controlador.mjs";
import { PerfilAdmin } from "../Controladores/Usuarios.controlador.mjs";
import { ActualizarPerfilAdmin } from "../Controladores/Usuarios.controlador.mjs";
import { AutenticarUsuario } from "../Controladores/Usuarios.controlador.mjs";
import { CerrarSesion } from "../Controladores/Usuarios.controlador.mjs";   
import { VerificarToken } from "../Middlewares/Auth.mjs";
import { Inactivarusuario } from "../Controladores/Usuarios.controlador.mjs";
import { UsuariosInactivos } from "../Controladores/Usuarios.controlador.mjs";
import { RestaurarUsuario } from "../Controladores/Usuarios.controlador.mjs";

const router = Router(); // esta variable nos permite crear rutas

// router.post("/Registrarusuarios",RegistrarUsuarios);
router.post("/Registrarusuarios", upload.single("foto"), RegistrarUsuarios);
router.get("/Listarusuarios",VerificarToken, ListarUsuarios);
router.get("/perfil_admin/:usuarioId",VerificarToken, PerfilAdmin);
router.put("/actualizar_perfil_admin/:usuarioId",VerificarToken, ActualizarPerfilAdmin);
router.post("/Inactivarusuario/:usuarioId",VerificarToken,Inactivarusuario);
router.post("/Login", AutenticarUsuario); // nueva ruta para autenticacion
router.get("/inactivos", VerificarToken, UsuariosInactivos);
router.post("/verificar", VerificarToken);
router.post("/logout", CerrarSesion);
router.post("/restaurar/:id",VerificarToken, RestaurarUsuario);


export default router; // exporta las rutas para usarlas en otros archivos  