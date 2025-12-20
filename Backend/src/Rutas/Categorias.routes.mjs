import { Router } from "express";
import { VerificarToken } from "../Middlewares/Auth.mjs";
import { ListarCategorias,CrearCategoria,EditarCategoria,EliminarCategoria } from "../Controladores/Categorias.Controlador.mjs";

const router = Router(); // esta variable nos permite crear rutas

router.get("/", VerificarToken, ListarCategorias);
router.post("/Crear", VerificarToken, CrearCategoria);
router.put("/Editar/:id", VerificarToken, EditarCategoria);
router.delete("/Eliminar/:id", VerificarToken, EliminarCategoria);


export default router; // exporta las rutas para usarlas en otros archivos