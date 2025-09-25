<?php
include_once("../Controlador/CargosControlador.php");
include_once("../Controlador/UsuariosControlador.php");

$accion = $_GET['accion'] ?? '';
if ($accion === 'cargos') {
    Cargos();
}
if ($accion === 'Registrarusuarios') {
    RegistrarUsuarios();
}
?>