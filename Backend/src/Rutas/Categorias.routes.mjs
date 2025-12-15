import { Router } from "express";
import { VerificarToken } from "../Middlewares/Auth.mjs";
import { ListarCategorias } from "../Controladores/Categorias.Controlador.mjs";

const router = Router(); // esta variable nos permite crear rutas

router.get("/", VerificarToken, ListarCategorias);


export default router; // exporta las rutas para usarlas en otros archivos