import {Router} from "express";
import {VerificarToken} from "../Middlewares/Auth.mjs";
import {ObtenerSubcategorias,Crear_subcategoria,Modificar_subcategorias,Eliminar_subcategoria} from "../Controladores/Subcategorias.Controlador.mjs";

const router = Router(); // esta variable nos permite crear rutas

router.get("/", VerificarToken, ObtenerSubcategorias);
router.post("/Crear", VerificarToken, Crear_subcategoria);
router.put("/Editar/:id", VerificarToken, Modificar_subcategorias);
router.delete("/Eliminar/:id", VerificarToken, Eliminar_subcategoria);

export default router; // exporta las rutas para usarlas en otros archivos