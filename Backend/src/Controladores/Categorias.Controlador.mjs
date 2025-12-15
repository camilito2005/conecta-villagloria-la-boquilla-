import { ObtenerCategorias } from "../Modelos/Categorias.Modelo.mjs";

export async function ListarCategorias(req, res) {
    try {
        const categorias = await ObtenerCategorias();
        if (!categorias) {
            return res.status(404).json({
                mensaje: "No se encontraron categorías",
                showModal: true,    
                modal: {
                    title: "Categorías",
                    message: "No hay categorías disponibles",
                    type: "info",
                },
            });
        }
        res.status(200).json(categorias);
    } catch (error) {
        console.error("Error al listar categorías:", error);
        res.status(500).json({
            mensaje: "Error al listar categorías",
            showModal: true,
            modal: {
                title: "Error",
                message: "Hubo un problema al listar las categorías",
                type: "error",
            },
        });
    }
}