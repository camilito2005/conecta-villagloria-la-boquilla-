import express from "express";
import {
  ObtenerResenas,
  CrearResena,
  ActualizarResenaController,
  EliminarResenaController,
} from "../Controladores/Resenas.Controlador.mjs";
import { VerificarToken } from "../Middlewares/Auth.mjs";

const router = express.Router();

// Obtener reseñas de un producto (público)
router.get("/producto/:id_producto", ObtenerResenas);

// Crear reseña (requiere autenticación)
router.post("/Crear", VerificarToken, CrearResena);

// Actualizar reseña (requiere autenticación)
router.put("/Actualizar/:id", VerificarToken, ActualizarResenaController);

// Eliminar reseña (requiere autenticación)
router.delete("/Eliminar/:id_resena", VerificarToken, EliminarResenaController);

export default router;