<?php
function UsuariosModel($conexion, $nombre, $identificacion, $telefono, $direccion, $email, $contraseña_hash, $cargo) {
    // inserto los parametros en la base de datos
    $sql = "INSERT INTO usuarios (nombre, email, contraseña, cargo ,telefono, direccion, , , ,identificacion) VALUES (?, ?, ?, ?, ?, ?, ?)";
}
?>