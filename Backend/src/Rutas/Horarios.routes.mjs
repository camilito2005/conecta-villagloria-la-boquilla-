import { Router } from "express";
import { AgregarHorario, ListarHorarios,ListarHorariosGuia,Editar,EliminarHorario,Cambiarestado } from "../Controladores/horarios.controlador.mjs";
import { VerificarToken } from "../Middlewares/Auth.mjs";

const router = Router();

router.get('/guia/:id_guia',VerificarToken, ListarHorariosGuia);
router.post("/agg_horarios",VerificarToken, AgregarHorario);
router.get("/listar_horarios",VerificarToken, ListarHorarios);
router.put("/Editar/:id_horario",VerificarToken,Editar);
router.put("/Cambio/:id_horario",VerificarToken,Cambiarestado);
router.delete("/Eliminar/:id_horario",VerificarToken,EliminarHorario);

export default router; // exporta las rutas para usarlas en otros archivos