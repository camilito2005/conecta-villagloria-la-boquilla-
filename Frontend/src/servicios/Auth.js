
// useVerificarSesion.js
import { useEffect } from "react";
import { Postdata } from "../servicios/Apis.js";

// voy a agregar un parametro solo para usarlo en el catalogo, nesecito que no me redirija al login 

export function  useVerificarSesion ({ setUsuario, setModalData, navigate, noRedirect = false }) {
  useEffect(() => {
    const verificar = async () => {
      const result = await Postdata("usuarios/verificar", { enviarJson: true });
    
      // Si no está autenticado y noRedirect es true, no hacer nada
      if (noRedirect && result.autenticado === false) {
        return;
      }

      if (result.showModal && result.modal && result.autenticado === false) {
        setModalData({
          title: result.modal.title,
          message: result.modal.message,
          type: result.modal.type,
        });

        setTimeout(() => navigate("/login"), 3000);
        return;
      }

      if (result.usuario) {
        setUsuario(result.usuario);
      }
    };

    verificar();
  }, [setUsuario, setModalData, navigate]);
};