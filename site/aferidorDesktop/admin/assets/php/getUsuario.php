<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// require_once('../../../common_assets/php/classes/functions.inc.php');
require_once('../../../common_assets/php/classes/conexao.class.php');


if($_SERVER['REQUEST_METHOD'] === 'POST') {
  //RECEBER ID DO REGISTRO
  $dados = json_decode(file_get_contents('php://input'), true);

  $id = $dados['id'];
  
  
  $sql = "SELECT nome_usuario FROM usuarios WHERE id_usuario = '$id'";

  $conexao = new ConBD;
  $stmt = $conexao->processa($sql, 1);
  
  if(!$stmt || $id == null){
    header('HTTP/1.1 500 Internal Server Error');
    echo (mysqli_error($conexao->conecta));
  }
  else{
    header('HTTP/1.1 200 OK');
    echo mysqli_fetch_object($stmt)->nome_usuario;
  }
}




