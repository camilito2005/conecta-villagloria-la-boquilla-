// const BASE_URL = "http://localhost:3000/api/";
const BASE_URL = `${import.meta.env.NODE_ENV}` === "production"
  ? "https://conecta-con-villagloria-backend.onrender.com/api/"
  : "http://localhost:3000/api/";
  console.log("BASE_URL:", BASE_URL);
// const BASE_URL = `${import.meta.env.VITE_URL || "http://localhost:3000"}/api/`;
// async = siempre devuelve una promesa (Promise) y puedes usar await dentro de ella.

async function Fetchapi(accion, options = {}) {
  try {
    const headers = {};

    // Solo agregamos Content-Type si el body NO es FormData
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${BASE_URL}${accion}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
       credentials: "include", // 👈 permite enviar cookies/sesiones
    });

    // Si el servidor responde con error (400, 401, etc.)
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      // Si el backend envía showModal, lo devolvemos para manejarlo en el front
      if (errorData?.showModal) return errorData;
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Error en apiFetch:", error);
    return {
      showModal: true,
      modal: {
        title: "Error de conexión",
        message: "No se pudo contactar con el servidor",
        type: "error",
      },
    };
  }
}
  // catch (error) {
  //   console.error("Error en apiFetch:", error);
  //   throw error;
  // }
// }
// Llamada GET para obtener datos
export function Getdata(accion) {
  return Fetchapi(accion);
}

// llamada POST para enviar datos a la API
export function Postdata(accion, data) {
  return Fetchapi(accion, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// llamadas POST pero sin json, para enviar formularios con archivos (fotos, pdf, etc)
export function PostFormData(accion, data) {
  return Fetchapi(accion, {
    method: "POST",
    body: data, // sin JSON.stringify
  });
}
// llamada PUT para actualizar datos en la API
export function Putdata(accion, data) {
  return Fetchapi(accion, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// llamada Put pero sin json, para editar formularios con archivos (fotos, pdf, etc)
export function PutFormData(accion, data) {
  return Fetchapi(accion, {
    method: "PUT",
    body: data, // sin JSON.stringify
  });
}

// llamada DELETE para eliminar datos en la API
export function Deletedata(accion, id) {
  return Fetchapi(`${accion}`, {
    method: "DELETE",
  });
}

export function DeletedataWithBody(accion, data) {
  return Fetchapi(accion, {
    method: "DELETE",
    body: JSON.stringify(data),
  });
}
