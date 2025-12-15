import { Router } from "express";
import { GetCargos,Registrar_cargos,Prueba,Editar,Eliminar_cargo } from "../Controladores/Cargos.controlador.mjs";
import { VerificarToken } from "../Middlewares/Auth.mjs";

const router = Router(); // esta variable nos permite crear rutas

router.get("/", GetCargos);
router.get("/prueba", Prueba); // ruta de prueba para verificar que las rutas funcionan
router.post("/Registrar",VerificarToken,Registrar_cargos);
router.put("/Editar/:id_cargo",VerificarToken,Editar)
router.delete("/Eliminar/:id_cargo",VerificarToken,Eliminar_cargo);
// ahora prueba la ruta en el navegador: http://localhost:3000/api/cargos/prueba


export default router; // exporta las rutas para usarlas en otros archivos
