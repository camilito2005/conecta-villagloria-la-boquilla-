<?php
function Conexion(){
$host = "localhost";
$dbname = "conecta-con-villagloria";
$user = "postgres";
$pass = "camilo";
$port = "5432";
try {
    $conexion = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $pass);
    $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $conexion;
} catch (PDOException $e) {
    echo "Error de conexión: " . $e->getMessage();
    return null;
}
}
return Conexion();

?>