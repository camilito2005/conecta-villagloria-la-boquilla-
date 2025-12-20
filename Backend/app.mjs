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

dotenv.config();// esta línea carga las variables de entorno desde el archivo .env
const app = express();// esta línea crea una instancia de una aplicación express
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir la carpeta Recursos públicamente
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // la URL de tu frontend
    credentials: true,               // ⬅️ necesario para enviar/recibir cookies
  })
);

app.use(express.json());// esta línea permite que la aplicación pueda interpretar solicitudes con cuerpo en formato JSON
app.use(express.urlencoded({ extended: true })); // Para formularios normales

app.use("/Recursos", express.static(path.join(__dirname, "src","/Recursos")));

app.use('/api/cargos', CargosRoutes);// esta línea monta las rutas de usuarios en la ruta /cargos
app.use('/api/usuarios', UsuariosRoutes);// esta línea monta las rutas de usuarios en la ruta /usuarios
app.use("/api/horarios", HorariosRoutes);
app.use("/api/tablas", TablasRoutes);
app.use("/api/reservas", ReservasRoutes);
app.use("/api/categorias", CategoriasRoutes);
app.use("/api/subcategorias", SubcategoriasRoutes);





app.listen(process.env.PORT || 3000, () => // esta línea inicia el servidor en el puerto especificado en las variables de entorno o en el puerto 3000 si no está especificado
  console.log(`Servidor corriendo en http://localhost:${process.env.PORT}`)
);