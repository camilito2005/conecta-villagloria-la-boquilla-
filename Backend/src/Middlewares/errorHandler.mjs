// handleMulterErrors.mjs
import multer from "multer";
// Middlewares/errorHandler.js
export const manejarErroresMulter = (err, req, res, next) => {
  // ✅ Error de tipo de archivo inválido
  if (err.code === "INVALID_FILE_TYPE") {
    return res.status(400).json({
      mensaje: "Tipo de archivo no permitido",
      showModal: true,
      modal: {
        title: "Extensión no permitida",
        message: "Solo se permiten imágenes en formato JPG, PNG o WEBP.",
        type: "error",
      },
    });
  }

  // ✅ Error de tamaño de archivo
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      mensaje: "Archivo muy grande",
      showModal: true,
      modal: {
        title: "Archivo muy grande",
        message: "La imagen no puede superar los 5MB.",
        type: "error",
      },
    });
  }

  // ✅ Error de campo inesperado
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      mensaje: "Campo de archivo inesperado",
      showModal: true,
      modal: {
        title: "Error",
        message: "Se detectó un campo de archivo no esperado.",
        type: "error",
      },
    });
  }

  // ✅ Otros errores de Multer
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      mensaje: "Error al subir archivo",
      showModal: true,
      modal: {
        title: "Error de carga",
        message: `Error al procesar el archivo: ${err.message}`,
        type: "error",
      },
    });
  }

  // ✅ Pasar al siguiente middleware si no es error de Multer
  next(err);
};