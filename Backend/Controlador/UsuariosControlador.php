<?php
function RegistrarUsuarios(){
    include_once("../Configuraciones/conexion.php");
    // include_once("../Modelo/UsuariosModelo.php");
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
    $datos = json_decode(file_get_contents("php://input"), true);
    if (!isset($datos['nombre']) || !isset($datos['identificacion']) || !isset($datos['telefono']) || !isset($datos['direccion']) || !isset($datos['email']) || !isset($datos['contraseña'])|| !isset($datos['cargo'])) {
        echo json_encode(["error" => "Faltan datos obligatorios"]);
        exit();
    }
    // verifico que la foto no sea mayor a 2MB
    if (isset($datos['foto']) && strlen($datos['foto']) > 2000000) {
        echo json_encode(["error" => "La foto no debe ser mayor a 2MB"]);
        exit();
    }
    //verifico que la foto  sea una imagen jpg, png o jpeg
    if (isset($datos['foto']) && !preg_match("/^data:image\/(jpg|jpeg|png);base64,/", $datos['foto'])) {
        echo json_encode(["error" => "La foto debe ser una imagen jpg, png o jpeg"]);
        exit();
    }

    $nombre = $datos['nombre'];
    $identificacion = $datos['identificacion'];
    $foto = isset($datos['foto']) ? $datos['foto'] : null; // si no viene la foto, la dejo en null
    if (!preg_match("/^\d{10}$/", $identificacion)) {
        echo json_encode(["error" => "La identificación debe tener exactamente 10 dígitos."]);
        exit();
    }
    // guardo la imagen el la carpeta recursos y guardo la ruta en la base de datos
    if ($foto) {
        $foto = str_replace('data:image/png;base64,', '', $foto);
        $foto = str_replace('data:image/jpg;base64,', '', $foto);
        $foto = str_replace('data:image/jpeg;base64,', '', $foto);
        $foto = str_replace(' ', '+', $foto);
        $foto_data = base64_decode($foto);
        $foto_nombre = 'recursos/' . uniqid() . '.png';
        file_put_contents('../' . $foto_nombre, $foto_data);
        $foto = $foto_nombre; // guardo la ruta de la imagen
    }
    $telefono = $datos['telefono']; // verifico que solo sean numeros
    if (!preg_match("/^\d+$/", $telefono)) {
        echo json_encode(["error" => "El teléfono debe contener solo números."]);
        exit();
    }

    $direccion = $datos['direccion'];
    $email = $datos['email'];
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["error" => "El correo electrónico no es válido."]);
        exit();
    }
    $contraseña = $datos['contraseña'];
    if (strlen($contraseña) <= 6) {
        echo json_encode(["error" => "La contraseña debe tener al menos 6 caracteres."]);
        exit();
    }
    $contraseña_hash = password_hash($contraseña, PASSWORD_BCRYPT);
    $cargo = $datos['cargo'];

    echo json_encode(["success" => "Datos recibidos", "nombre" => $nombre,"identificacion"=>$identificacion,"imagen"=> $foto, "telefono" => $telefono, "direccion" => $direccion, "email" => $email, "contraseña" => $contraseña, "contraseña-hasheada" => $contraseña_hash, "cargo" => $cargo]);
}
?>