<?php

function getCargos($conexion)
{
    $sql = "SELECT * FROM cargo";
    $stmt = $conexion->prepare($sql);
    $stmt->execute();
    $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $cargos = [];
    foreach ($resultado as $fila) {
        $cargos[] = $fila;
    }

    echo json_encode($cargos);
}
?>