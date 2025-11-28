// handleMulterErrors.mjs
import multer from "multer";

/**
 * Middleware personalizado para manejar errores de Multer
 * @param {Function} upload - función de subida generada por multer
 * @returns {Function} middleware de Express
 */
export function handleMulterErrors(upload) {
  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // Errores específicos de Multer (ej: límite de tamaño, campos inválidos)
        return res.status(400).json({
          showModal: true,
          modal: {
            title: "Error al subir la imagen",
            message: err.message,
            type: "error",
            code: err.code,
          },
        });
      }

      if (err) {
        // Errores generales (ej: tipo de archivo inválido)
        return res.status(400).json({
          showModal: true,
          modal: {
            title: "Archivo inválido",
            message: err.message,
            type: "error",
          },
        });
      }

      // Si no hay errores, continúa con el flujo normal
      next();
    });
  };
}