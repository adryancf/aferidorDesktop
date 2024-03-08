<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once('../../../../includes/functions.inc.php');
require_once('../../../../includes/conexao.class.php');

function extrairDadosSw($dados)
{
    $values = "";
    foreach ($dados as $item)
    {
        if($item != "")
            $values .= $item . ", ";
    }
    $values = rtrim($values, ', ');
    $envio = '"'. $values .'"';

    return array("softwares", $envio);

    
}

function str($valor) {
    if($valor == "desktop")
        $valor = 'd';
    else if($valor == "notebook")
        $valor = 'n';
    
    $str = "'". $valor . "'";
    return $str;
}

function extrairDadosInfos_HW($dados)
{
    $colunas = implode(",", array_keys($dados));
    $colunas = rtrim($colunas, ',');
    
    // Obtém os valores e envolve cada valor com aspas simples
    $values = implode(",", array_map('str', array_values($dados)));

    $values = rtrim($values, ',');

    return array($colunas, $values);

}

// Verifica se a requisição é do tipo POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Decodifica os dados JSON
    $dados = json_decode(file_get_contents('php://input'), true);

    $hw = extrairDadosInfos_HW($dados['hardwares']);
    $sw = extrairDadosSw($dados['softwares']);
    $infos = extrairDadosInfos_HW($dados['infos']);

    $colunas = $hw[0] . "," . $sw[0] . "," . $infos[0];
    $values = $hw[1] . "," . $sw[1] . "," . $infos[1];
    

    $sql = "INSERT INTO aferidorDesktop_dadosRecebidos (" . $colunas . ") VALUES (" . $values . ")";
    
    $conexao  = new ConBD;
    $stmt = $conexao->processa($sql, 1);
    
    if(!$stmt){
        header('HTTP/1.1 500 Internal Server Error');
        echo (mysql_error($conexao->conecta));
    }
    else{
        header('HTTP/1.1 200 OK');
        echo json_encode("Dados inseridos com sucesso!");
    }
    
    
   
}

    

?>
