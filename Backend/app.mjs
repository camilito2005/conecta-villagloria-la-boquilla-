import express from 'express';// esta línea importa el paquete express
import dotenv from 'dotenv';// esta línea importa el paquete dotenv
import cors from 'cors'; // esta línea importa el paquete cors lo cual permite compartir recursos entre diferentes orígenes
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";

import CargosRoutes from './src/Rutas/Cargos.routes.mjs'; // esta línea importa las rutas de usuarios
import UsuariosRoutes from './src/Rutas/Usuarios.routes.mjs'; // esta línea importa las rutas de usuarios
import TablasRoutes from './src/Rutas/Tablas.routes.mjs'; //
import HorariosRoutes from './src/Rutas/Horarios.routes.mjs'; //
import ReservasRoutes from './src/Rutas/Reservas.routes.mjs'; 
import CategoriasRoutes from './src/Rutas/Categorias.routes.mjs';
import SubcategoriasRoutes from './src/Rutas/Subcategorias.routes.mjs';
import Productosrouter from './src/Rutas/Productos.routes.mjs';
import Negociosrouter from './src/Rutas/Negocios.routes.mjs';
import Reseñasroutes from './src/Rutas/Resenas.routes.mjs';
import Carritosroutes from './src/Rutas/Carrito.routes.mjs';

dotenv.config();// esta línea carga las variables de entorno desde el archivo .env
const app = express();// esta línea crea una instancia de una aplicación express
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir la carpeta Recursos públicamente
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://conecta-villagloria-la-boquilla-frontend.onrender.com'  // ← URL exacta de producción
];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones sin origin (Postman, apps móviles)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    console.log('Origen bloqueado por CORS:', origin);
    return callback(new Error('No permitido por CORS'), false);
  },
  credentials: true
}));

// mensaje de configuración CORS previo

// app.use(
//   cors({
//     origin: "http://localhost:5173", // la URL de tu frontend
//     credentials: true,               // ⬅️ necesario para enviar/recibir cookies
//   })
// );

app.use(express.json());// esta línea permite que la aplicación pueda interpretar solicitudes con cuerpo en formato JSON
app.use(express.urlencoded({ extended: true })); // Para formularios normales

app.use('/Recursos', express.static(path.join(__dirname, "src","/Recursos")));

//  IMPORTANTE: Servir archivos estáticos desde la carpeta Recursos
// app.use('/imagenes', express.static(path.join(__dirname, 'Recursos')));

app.use('/api/cargos', CargosRoutes);// esta línea monta las rutas de usuarios en la ruta /cargos
app.use('/api/usuarios', UsuariosRoutes);// esta línea monta las rutas de usuarios en la ruta /usuarios
app.use("/api/horarios", HorariosRoutes);
app.use("/api/tablas", TablasRoutes);
app.use("/api/reservas", ReservasRoutes);
app.use("/api/categorias", CategoriasRoutes);
app.use("/api/subcategorias", SubcategoriasRoutes);
app.use("/api/productos", Productosrouter);
app.use("/api/negocios", Negociosrouter);
app.use("/api/resenas", Reseñasroutes);
app.use("/api/carrito", Carritosroutes);


app.listen(process.env.PORT || 3000, () => // esta línea inicia el servidor en el puerto especificado en las variables de entorno o en el puerto 3000 si no está especificado
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`)
);