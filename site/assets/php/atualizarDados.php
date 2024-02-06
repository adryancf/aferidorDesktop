<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once('../../../includes/functions.inc.php');
require_once('../../../includes/conexao.class.php');

function extrairValores($dados)
{
  $values = array();
  foreach($dados as $nome => $valor){
    $values[] = $nome . " = '" . $valor. "'";
  }

  return implode(", ", $values);

}

// Verifica se a requisição é do tipo POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Decodifica os dados JSON
    $dados = json_decode($_POST["dados"], true);
    $id = $_POST["id"];
    
    $valores = extrairValores($dados);
    
    $sql = "UPDATE aferidorDesktop_dadosRecebidos SET " . $valores . " WHERE id = ". $id;
    
    $conexao  = new ConBD;
    $stmt = $conexao->processa($sql, 1);
    
    if(!$stmt){
        header('HTTP/1.1 500 Internal Server Error');
        echo (mysql_error($conexao->conecta));
    }
    else{
        header('HTTP/1.1 200 OK');
        echo json_encode("Dados atualizados com sucesso!");
    }
    
    
   
}

    

?>