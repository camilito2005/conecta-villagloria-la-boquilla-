import express from "express";
import {
  ObtenerCarrito,
  AgregarProductoAlCarrito,
  SincronizarCarritoController,
  ActualizarCantidad,
  EliminarProductoDelCarrito,
  VaciarCarritoController,
} from "../Controladores/Carrito.Controlador.mjs";
import { VerificarToken } from "../Middlewares/Auth.mjs";

const router = express.Router();

// Obtener carrito de un usuario
router.get("/Obtenercarrito/:id_usuario", VerificarToken, ObtenerCarrito);

// Agregar producto al carrito
router.post("/AgregarCarrito", VerificarToken, AgregarProductoAlCarrito);

// Sincronizar carrito desde localStorage
router.post("/sincronizar", VerificarToken, SincronizarCarritoController);

// Actualizar cantidad
router.put("/ActualizarCantidad", VerificarToken, ActualizarCantidad);

// Eliminar producto del carrito
router.delete("/EliminarProducto/:id_usuario/:id_producto", VerificarToken, EliminarProductoDelCarrito);

// Vaciar carrito
router.delete("/VaciarCarrito/:id_usuario", VerificarToken, VaciarCarritoController);

export default router;