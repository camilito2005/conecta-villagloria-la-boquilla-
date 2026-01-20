import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

import CargosRoutes from './src/Rutas/Cargos.routes.mjs';
import UsuariosRoutes from './src/Rutas/Usuarios.routes.mjs';
import TablasRoutes from './src/Rutas/Tablas.routes.mjs';
import HorariosRoutes from './src/Rutas/Horarios.routes.mjs';
import ReservasRoutes from './src/Rutas/Reservas.routes.mjs';
import CategoriasRoutes from './src/Rutas/Categorias.routes.mjs';
import SubcategoriasRoutes from './src/Rutas/Subcategorias.routes.mjs';
import Productosrouter from './src/Rutas/Productos.routes.mjs';
import Negociosrouter from './src/Rutas/Negocios.routes.mjs';
import Reseñasroutes from './src/Rutas/Resenas.routes.mjs';
import Carritosroutes from './src/Rutas/Carrito.routes.mjs';

dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cookieParser());

// CORS CONFIGURACIÓN COMPLETA
// app.use(cors({
//   origin: function (origin, callback) {
//     const allowedOrigins = [
//       'http://localhost:5173',
//       'https://conecta-villagloria-la-boquilla-frontend.onrender.com'
//     ];
    
//     // Permitir peticiones sin origin (Postman, apps móviles)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.includes(origin)) {
//       return callback(null, true);
//     }
    
//     console.log('Origen bloqueado por CORS:', origin);
//     return callback(new Error('No permitido por CORS'));
//   },
console.log('VITE_NODE_ENV:', process.env.VITE_NODE_ENV);
app.use(cors({
  origin: process.env.VITE_NODE_ENV === 'production' 
    ? 'https://conecta-villagloria-la-boquilla-frontend.onrender.com'
    : 'http://localhost:5173',
  credentials: true,
  // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // allowedHeaders: ['Content-Type', 'Authorization'],
  // exposedHeaders: ['Set-Cookie'],
  // preflightContinue: false,
  // optionsSuccessStatus: 204
}));

// ⚠️ NO INCLUIR: app.options('*', cors());
// Esta línea causaba el PathError

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/Recursos', express.static(path.join(__dirname, "src", "/Recursos")));

app.use('/api/cargos', CargosRoutes);
app.use('/api/usuarios', UsuariosRoutes);
app.use("/api/horarios", HorariosRoutes);
app.use("/api/tablas", TablasRoutes);
app.use("/api/reservas", ReservasRoutes);
app.use("/api/categorias", CategoriasRoutes);
app.use("/api/subcategorias", SubcategoriasRoutes);
app.use("/api/productos", Productosrouter);
app.use("/api/negocios", Negociosrouter);
app.use("/api/resenas", Reseñasroutes);
app.use("/api/carrito", Carritosroutes);

app.listen(process.env.PORT || 3000, () =>
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`)
);