<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once('../../../common_assets/php/classes/conexao.class.php');

function obterSotwaresInstalados($fk_hardware){//id_softwarefunc, id_software, data_instalacao, nome as nome_software, n_licencas, fk_setor, 
    $sql = "SELECT id_softwarefunc, id_software, data_instalacao, nome as nome_software, n_licencas, fk_setor FROM softwares_instalados WHERE fk_hardware = '$fk_hardware'";
    $conexao = new ConBD;
    $stmt = $conexao->processa($sql, 0);
    if(!$stmt){
        return;
    }
    else{
        $softwares = array();
        while ($row = mysqli_fetch_object($stmt)) {
            $softwares[] = $row;
        }
        return $softwares;
    }
}

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

function obterDadosMaquina($numero){
    $sql = "SELECT * FROM hardwares WHERE numero = '$numero'";
    $conexao = new ConBD;
    $stmt = $conexao->processa($sql, 0);
    if(!$stmt){
        return;
    }
    else{
        $pcs = array();
        while ($row = mysqli_fetch_object($stmt)) {

            //Obtendo os softwares instalados
            $row->softwares = obterSotwaresInstalados($row->id_hardware);

            //Obtendo o nome e cc do setor do funcionario
            $setor = obterSetorFuncionario($row->fk_funcionario);
            $row->fk_setor = $setor->fk_setor;
            $row->nome_setor = $setor->nome_setor;
            $row->cc = $setor->cc;

            $row->nome_funcionario = $setor->nome_funcionario;

            $pcs[] = $row;
        }
        return $pcs;
    }
}

if($_SERVER['REQUEST_METHOD'] === 'GET') {


    //$sql = "SELECT * FROM aferidorDesktop_dadosRecebidos";
    $sql = "SELECT * FROM aferidorDesktop_dadosRecebidos WHERE enviado = '0'";

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
            $row->dadosMaquinaAferidor = obterDadosMaquina($row->numero);
            $row->fk_setor_funcionario = obterSetorFuncionario($row->fk_funcionario)->fk_setor;

            if($row->softwaresResumido != null){

              $row->softwaresResumido = json_decode($row->softwaresResumido, true);
            }

            $registros[] = $row;  
        }
        echo json_encode($registros);
       
    }
}


