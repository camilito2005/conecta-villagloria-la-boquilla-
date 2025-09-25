
const BASE_URL = 'http://localhost/conecta-con-villagloria/Backend/Rutas/rutas.php?accion=';
// async = siempre devuelve una promesa (Promise) y puedes usar await dentro de ella.

async function Fetchapi(accion, options = {}) {
    try{
        const response = await fetch(`${BASE_URL}${accion}`,{
            headers: {
            'Content-Type': 'application/json'},
        ...options, // los tres puntos es el operador spread que permite expandir un objeto en otro
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }catch (error) {
    console.error("Error en apiFetch:", error);
    throw error;
  }
}
// Llamada GET para obtener datos
export function Getdata(accion) {
    return Fetchapi(accion);
}

// llamada POST para enviar datos a la API
export function Postdata(accion, data) {
    return Fetchapi(accion, {
        method: 'POST',
        body: JSON.stringify(data),
    });
}

// llamada PUT para actualizar datos en la API
export function Putdata(accion, data) {
    return Fetchapi(accion, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

// llamada DELETE para eliminar datos en la API
export function Deletedata(accion, id) {
     return Fetchapi(`${accion}&id=${id}`, {
    method: "DELETE",
  });
}

