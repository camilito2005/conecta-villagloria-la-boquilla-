import { Router } from "express";
import { IngresarHorario, ListarHorarios } from "../Controladores/Horarios.controlador.mjs";

const router = Router();

router.post("/agg_horarios", IngresarHorario);
router.get("/listar_horarios", ListarHorarios);

export default router; // exporta las rutas para usarlas en otros archivos