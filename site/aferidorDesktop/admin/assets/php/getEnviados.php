<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once('../../../common_assets/includes/functions.inc.php');
require_once('../../../common_assets/includes/conexao.class.php');

function obterSetorFuncionario($id_funcionario){
  $sql = "SELECT f.fk_setor, f.nome_funcionario, s.nome_setor, s.cc FROM funcionarios AS f INNER JOIN setores AS s ON f.fk_setor = s.id_setor WHERE id_funcionario = '$id_funcionario'";
    
  $conexao = new ConBD;
  $stmt = $conexao->processa($sql, 0);
  if(!$stmt){
    return;
  }
  else{
    return mysqli_fetch_object($stmt);
  }
}

function obterNomeUsuario($fk_usuario){
  $sql = "SELECT nome_usuario FROM usuarios WHERE id_usuario = '$fk_usuario'";
    
  $conexao = new ConBD;
  $stmt = $conexao->processa($sql, 0);
  if(!$stmt){
    return;
  }
  else{
    if(mysqli_num_rows($stmt) > 0)
      return mysqli_fetch_object($stmt)->nome_usuario;
    else
      return;
  }
}


if($_SERVER['REQUEST_METHOD'] === 'GET') {


    //$sql = "SELECT * FROM aferidorDesktop_dadosRecebidos";
    $sql = "SELECT * FROM aferidorDesktop_dadosRecebidos WHERE enviado = '1'";

    $conexao = new ConBD;
    $stmt = $conexao->processa($sql, 1);
    
    if(!$stmt){
        header('HTTP/1.1 500 Internal Server Error');
        echo (mysqli_error($conexao->conecta));
    }
    else{
        header('HTTP/1.1 200 OK');
        $registros = array();
        
        while ($row = mysqli_fetch_object($stmt)) {
            $row->fk_setor_funcionario = obterSetorFuncionario($row->fk_funcionario)->fk_setor;
            $row->nome_usuario = obterNomeUsuario($row->fk_usuario);

            if($row->softwaresResumido != null){

              $row->softwaresResumido = json_decode($row->softwaresResumido, true);
            }

            $registros[] = $row;  
        }
        echo json_encode($registros);
       
    }
}


