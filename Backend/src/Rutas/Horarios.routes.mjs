import { Router } from "express";
import { IngresarHorario, ListarHorarios } from "../Controladores/Horarios.controlador.mjs";
import { VerificarToken } from "../Middlewares/Auth.mjs";

const router = Router();

router.post("/agg_horarios",VerificarToken, IngresarHorario);
router.get("/listar_horarios",VerificarToken, ListarHorarios);

export default router; // exporta las rutas para usarlas en otros archivos