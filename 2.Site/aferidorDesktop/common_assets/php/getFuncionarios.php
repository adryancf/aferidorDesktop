<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once('classes/conexao.class.php');

if($_SERVER['REQUEST_METHOD'] === 'GET') {


    $sql = "SELECT * FROM funcionarios";

    $conexao = new ConBD;
    $stmt = $conexao->processa($sql, 1);
    
    if(!$stmt){
        header('HTTP/1.1 500 Internal Server Error');
        echo (mysqli_error($conexao->conecta));
    }
    else{
        header('HTTP/1.1 200 OK');
        $funcionarios = array();
        
        while ($row = mysqli_fetch_object($stmt)) {
            $funcionarios[] = $row;  
        }
        echo json_encode($funcionarios);
       
    }
}


