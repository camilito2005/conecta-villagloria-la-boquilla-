
// useVerificarSesion.js
import { useEffect } from "react";
import { Postdata } from "../servicios/Apis.js";
import { useCarrito } from "../globales/CarritoContext";

// voy a agregar un parametro solo para usarlo en el catalogo, nesecito que no me redirija al login 

export function  useVerificarSesion ({ setUsuario, setModalData, navigate, noRedirect = false, sincronizarCarrito = false }) {

  // ✅ Solo obtener funciones del carrito si es necesario
  const carritoContext = sincronizarCarrito ? useCarrito() : { 
    setUsuarioCarrito: () => {}, 
    cargarCarritoDesdeDB: async () => {} 
  };

  const { setUsuarioCarrito, cargarCarritoDesdeDB } = carritoContext;

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
        // ✅ NORMALIZAR: Asegurar que siempre tenga 'id'
        const usuarioNormalizado = {
          ...result.usuario,
          id: result.usuario.id || result.usuario.id_usuario, // ✅ Priorizar 'id', si no existe usar 'id_usuario'
        };
        
        setUsuario(usuarioNormalizado);

        // ✅ Actualizar usuario en el carrito
        setUsuarioCarrito(usuarioNormalizado);

        // ✅ Solo sincronizar carrito si se solicitó explícitamente
          if (sincronizarCarrito) {
            setUsuarioCarrito(usuarioNormalizado);
            
            if (usuarioNormalizado.id) {
              await cargarCarritoDesdeDB(usuarioNormalizado.id);
            }
          }
        
      }
    };

    verificar();
  }, [setUsuario, setModalData, navigate]);
};