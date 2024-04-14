<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once('../../../common_assets/includes/functions.inc.php');
require_once('../../../common_assets/includes/conexao.class.php');


if($_SERVER['REQUEST_METHOD'] === 'POST') {
  //RECEBER ID DO REGISTRO
  $dados = json_decode(file_get_contents('php://input'), true);

  $id = $dados['id'];
  $fk_usuario = $dados['fk_usuario'];
  $tipoEnvio = $dados['tipoEnvio'];
  
  $sql = "UPDATE aferidorDesktop_dadosRecebidos SET enviado = '1', fk_usuario = '$fk_usuario', tipoEnvio = '$tipoEnvio' WHERE id = '$id'";

  $conexao = new ConBD;
  $stmt = $conexao->processa($sql, 1);
  
  if(!$stmt){
    header('HTTP/1.1 500 Internal Server Error');
    echo (mysqli_error($conexao->conecta));
  }
  else{
    header('HTTP/1.1 200 OK');
  }
}


