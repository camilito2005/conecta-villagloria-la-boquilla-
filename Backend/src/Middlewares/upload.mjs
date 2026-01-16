import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//  Función para crear upload con carpeta específica
export const crearUpload = (carpeta) => {
  const rutaDestino = path.join(__dirname, `../Recursos/${carpeta}`);

  // Crear la carpeta si no existe
  if (!fs.existsSync(rutaDestino)) {
    fs.mkdirSync(rutaDestino, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, rutaDestino);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const nombreSeguro = Date.now() + ext;
      cb(null, nombreSeguro);
    },
  });

  const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;

    const extensionesValidas = [".jpg", ".jpeg", ".png", ".webp"];

    const mimeValidos = ["image/jpeg", "image/png", "image/webp"];

    // if (!extensionesValidas.includes(ext) || !mimeValidos.includes(mime)) {
    //   return cb(
    //     new Error("Solo se permiten imágenes reales (jpg, png, webp)"),
    //     false
    //   );
    // }

     if (!extensionesValidas.includes(ext) || !mimeValidos.includes(mime)) {
      //  Crear error personalizado con tipo específico
      const error = new Error("INVALID_FILE_TYPE");
      error.code = "INVALID_FILE_TYPE";
      return cb(error, false);
    }

    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  });
};

export const uploadProducto = crearUpload("Productos");
// export const uploadUsuario = crearUpload("Usuarios");
// export const uploadCategoria = crearUpload("Categorias");