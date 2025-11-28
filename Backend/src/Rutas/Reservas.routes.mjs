import { Router } from "express";
import { CrearReserva } from "../Controladores/Reservas.Controlador.mjs";
import { VerificarToken } from "../Middlewares/Auth.mjs"
import { ObtenerReservasPendientesGuia } from "../Controladores/Reservas.Controlador.mjs";
import { ObtenerReservasPendientesTurista } from "../Controladores/Reservas.Controlador.mjs";
import { ActualizarEstado } from "../Controladores/Reservas.Controlador.mjs";

const router = Router(); // esta variable nos permite crear rutas

router.post("/crear_reserva",VerificarToken, CrearReserva);
// Ruta para obtener reservas pendientes de un guía específico con el id del guía como query param
router.get("/pendientes_guia/:id_guia", VerificarToken, ObtenerReservasPendientesGuia);
router.get("/estado_turista/:id_turista",VerificarToken,ObtenerReservasPendientesTurista);
// router.put("actualizar_estado/:id_reserva",VerificarToken, ActualizarEstado);
router.put("/actualizar_estado/:id_reserva",VerificarToken, ActualizarEstado);


export default router;