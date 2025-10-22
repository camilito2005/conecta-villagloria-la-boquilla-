import { json } from "express";
import { ObtenerCargos } from "../Modelos/Cargos.modelo.mjs";

export async function GetCargos(req, res) {
  try {
    const respuesta = await ObtenerCargos();
    res.json(respuesta); // ✅ devolver los datos
  } catch (error) {
    console.error("Error en GetCargos:", error); // 👈 log para ver en contenedor
    res.status(500).json({ error: "Error al obtener los cargos" });
  }
}

export async function Prueba(req, res) {
  res.json({ mensaje: "hola desde cargos controlador" }); // ✅ usar res.json()
}