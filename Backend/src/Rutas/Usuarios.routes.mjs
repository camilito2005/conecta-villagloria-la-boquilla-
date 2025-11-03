import { Router } from "express";
import { upload } from "../Middlewares/upload.mjs";
import { RegistrarUsuarios } from "../Controladores/Usuarios.controlador.mjs";
import { ListarUsuarios } from "../Controladores/Usuarios.controlador.mjs";
import { AutenticarUsuario } from "../Controladores/Usuarios.controlador.mjs";

const router = Router(); // esta variable nos permite crear rutas

// router.post("/Registrarusuarios",RegistrarUsuarios);
router.post("/Registrarusuarios", upload.single("foto"), RegistrarUsuarios);
router.get("/Listarusuarios", ListarUsuarios);
router.post("/Login", AutenticarUsuario); // nueva ruta para autenticacion


export default router; // exporta las rutas para usarlas en otros archivos  