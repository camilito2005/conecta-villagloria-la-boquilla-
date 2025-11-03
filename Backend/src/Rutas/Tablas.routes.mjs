import { Tablas } from "../Controladores/Tablas.mjs";
import { Router } from "express";

const router = Router();

router.post("/ejercicio", Tablas)

export default router; // exporta las rutas para usarlas en otros archivos
