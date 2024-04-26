<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// require_once('../../../common_assets/php/classes/functions.inc.php');
require_once('../../../common_assets/php/classes/conexao.class.php');


if($_SERVER['REQUEST_METHOD'] === 'GET') {


    //$sql = "SELECT * FROM aferidorDesktop_dadosRecebidos";
    $sql = "SELECT * FROM hardwares WHERE utilizado = '0'";

    $conexao = new ConBD;
    $stmt = $conexao->processa($sql, 1);
    
    if(!$stmt){
        header('HTTP/1.1 500 Internal Server Error');
        echo (mysql_error($conexao->conecta));
    }
    else{
        header('HTTP/1.1 200 OK');
        $registros = array();
        
        while ($row = mysql_fetch_object($stmt)) {
            $registros[] = $row;  
        }
        echo json_encode($registros);
       
    }
}


?>


