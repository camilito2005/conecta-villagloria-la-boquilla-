<?php
 function Headers($numero1, $numero2, $numero3, $opcional) {
    header($numero1); // tu frontend
    header($numero2);
    header($numero3);
    if ($opcional != "") {
        header($opcional);
    }
}

?>