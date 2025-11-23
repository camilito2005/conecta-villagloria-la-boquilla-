import { Router } from "express";
import { CrearReserva } from "../Controladores/Reservas.Controlador.mjs";
import { VerificarToken } from "../Middlewares/Auth.mjs"
import { ObtenerReservasPendientesGuia } from "../Controladores/Reservas.Controlador.mjs";

const router = Router(); // esta variable nos permite crear rutas

router.post("/crear_reserva",VerificarToken, CrearReserva);
// Ruta para obtener reservas pendientes de un guía específico con el id del guía como query param
router.get("/pendientes_guia/:id_guia", VerificarToken, ObtenerReservasPendientesGuia);


export default router;