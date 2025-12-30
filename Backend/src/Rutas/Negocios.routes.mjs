import { Router } from "express";
import { VerificarToken } from "../Middlewares/Auth.mjs";
import { ObtenerNegocios,CrearNegocio,ActualizarNegocioController,EliminarNegocioController,ObtenerNegociosPublicos } from "../Controladores/Negocios.Controlador.mjs";

const router = Router(); // esta variable nos permite crear rutas

// Obtener negocios por usuario
router.get("/usuario/:id_usuario", VerificarToken, ObtenerNegocios);

// Ruta pública (SIN VerificarToken)
router.get("/publicos", ObtenerNegociosPublicos);

// Crear nuevo negocio
router.post("/crear", VerificarToken, CrearNegocio);

// Actualizar negocio
router.put("/editar/:id", VerificarToken, ActualizarNegocioController);

// Eliminar negocio
router.delete("/eliminar/:id", VerificarToken, EliminarNegocioController);

export default router; // exporta las rutas para usarlas en otros archivos