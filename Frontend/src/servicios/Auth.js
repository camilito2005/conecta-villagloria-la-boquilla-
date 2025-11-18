
// useVerificarSesion.js
import { useEffect } from "react";
import { Postdata } from "../servicios/Apis.js";

export const VerificarSesion = ({ setUsuario, setModalData, navigate }) => {
  useEffect(() => {
    const verificar = async () => {
      const result = await Postdata("usuarios/verificar", { enviarJson: true });

      if (result.showModal && result.modal) {
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