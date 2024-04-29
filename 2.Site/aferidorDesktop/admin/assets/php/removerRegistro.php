<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// require_once('../../../common_assets/php/classes/functions.inc.php');
require_once('../../../common_assets/php/classes/conexao.class.php');


// Verifica se a requisição é do tipo POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  
  $id_registro = null;
  
  if(isset($_POST["id"])){
    $id_registro = $_POST["id"];
  }
  else {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode("Erro: Nenhum dado recebido.");
    return;
  }

  $sql = "DELETE FROM aferidorDesktop_dadosRecebidos WHERE id = ". $id_registro;
  //echo($sql);
  
  $conexao  = new ConBD;
  $stmt = $conexao->processa($sql, 1);
  
  if(!$stmt){
    header('HTTP/1.1 500 Internal Server Error');
    echo (mysqli_error($conexao->conecta));
  }
  else{
    header('HTTP/1.1 200 OK');
    echo json_encode("Registro excluido com sucesso!");
  } 

}

    

?>
