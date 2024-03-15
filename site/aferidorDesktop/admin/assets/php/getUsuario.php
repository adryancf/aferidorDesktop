<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once('../../../../includes/functions.inc.php');
require_once('../../../../includes/conexao.class.php');


if($_SERVER['REQUEST_METHOD'] === 'POST') {
  //RECEBER ID DO REGISTRO
  $dados = json_decode(file_get_contents('php://input'), true);

  $id = $dados['id'];
  
  
  $sql = "SELECT nome_usuario FROM aferidordelicensas.usuarios WHERE id_usuario = '$id'";

  $conexao = new ConBD;
  $stmt = $conexao->processa($sql, 1);
  
  if(!$stmt || $id == null){
    header('HTTP/1.1 500 Internal Server Error');
    echo (mysql_error($conexao->conecta));
  }
  else{
    header('HTTP/1.1 200 OK');
    echo mysql_fetch_object($stmt)->nome_usuario;
  }
}




