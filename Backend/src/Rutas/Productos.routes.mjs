import {Router} from 'express';
import {VerificarToken} from '../Middlewares/Auth.mjs';
import { manejarErroresMulter } from '../Middlewares/errorHandler.mjs';
import { uploadProducto } from '../Middlewares/upload.mjs';
import { Obtener_productos,Obtener_productos_usuario,Crear_productos,Editar_producto,Eliminar_producto,ObtenerProductosPublicos } from '../Controladores/Productos.Controlador.mjs';

const router = Router();

router.get("/",Obtener_productos);
router.get("/usuario/:id_usuario",VerificarToken,Obtener_productos_usuario);
router.get("/publicos", ObtenerProductosPublicos);
router.post("/crear", uploadProducto.single('imagen'), VerificarToken, manejarErroresMulter, Crear_productos);
router.put("/editar/:id_producto", uploadProducto.single('imagen'), VerificarToken, manejarErroresMulter, Editar_producto );
router.delete("/Eliminar/:id_producto", uploadProducto.single('imagen'), VerificarToken,manejarErroresMulter, Eliminar_producto );

export default router;