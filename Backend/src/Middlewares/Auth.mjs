import jwt from "jsonwebtoken";
//recibo enviarJson para saber si la peticion viene del frontend


export function VerificarToken(req, res, next) {
  const token = req.cookies?.token_acceso;
  const enviarJson = req.body?.enviarJson;
  //

  if (!token) {
    return res.status(401).json({
      autenticado: false,
      showModal: true,
      modal: {
        title: "Sesión no iniciada",
        message: "Por favor inicia sesión para continuar.",
        type: "error",
      },
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // puedes guardar el usuario en el request
    if (enviarJson) {
      res.json({ autenticado: true, usuario: req.usuario });
      return; // Evita llamar a next() si ya se envió una respuesta
    }
    
    next(); // ✅ permite que ListarUsuarios se ejecute
  } catch (error) {
    console.log(error)
     return res.status(403).json({
      autenticado: false,
      showModal: true,
      modal: {
        title: "Sesión expirada",
        message: "Tu sesión ha caducado. Inicia sesión nuevamente.",
        type: "error",
      },
    });
  }
}
