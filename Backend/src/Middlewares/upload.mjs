// import multer from "multer";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const storage = multer.diskStorage({
//   destination: path.join(__dirname, "../Recursos"), // crea una carpeta uploads
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     cb(null, `${Date.now()}${ext}`); // nombre único
//   }
// });

// export const upload = multer({ storage });


import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Recursos/");
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

  if (!extensionesValidas.includes(ext) || !mimeValidos.includes(mime)) {
    return cb(
      new Error("Solo se permiten imágenes reales (jpg, png, webp)"),
      false
    );
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});


// export const upload = multer({ storage });