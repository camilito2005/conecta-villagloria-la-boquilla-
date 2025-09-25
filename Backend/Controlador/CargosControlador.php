<?php

function Cargos()
{
    include_once("../Configuraciones/conexion.php");
    include_once("../Modelo/CargosModelo.php");
    include_once("../Global/headers.php");
    $numero1 = "Access-Control-Allow-Origin: http://localhost:5173";
    $numero2 = "Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS";
    $numero3 = "Access-Control-Allow-Headers: Content-Type";
    $opcional = "";

    Headers($numero1, $numero2, $numero3, $opcional);
    $conexion = Conexion();
    if (!$conexion) {
        echo json_encode(["error" => "No se pudo conectar a la base de datos"]);
        exit();
    }
    $cargo = getCargos($conexion);
    return $cargo;
}
