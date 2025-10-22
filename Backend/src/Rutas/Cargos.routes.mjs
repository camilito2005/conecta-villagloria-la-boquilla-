import { Router } from "express";
import { GetCargos } from "../Controladores/Cargos.controlador.mjs";
import { Prueba } from "../Controladores/Cargos.controlador.mjs";

const router = Router(); // esta variable nos permite crear rutas

router.get("/", GetCargos);
router.get("/prueba", Prueba); // ruta de prueba para verificar que las rutas funcionan
// ahora prueba la ruta en el navegador: http://localhost:3000/api/cargos/prueba


export default router; // exporta las rutas para usarlas en otros archivos
