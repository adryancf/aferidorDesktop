<?php
//ESSE ARQUIVO FOI FEITO, POIS O CADASTRAR.PHP INCLUIA APENAS UM SOFTWARE POR VEZ, E O AFERIDOR DESKTOP PODE INCLUIR VÁRIOS DE UMA VEZ
//E NESSA REQUISIÇÃO PREFERI USAR JSON, POIS ACHO MAIS FÁCIL DE MANIPULAR OS DADOS. NA CADASTRAR.PHP OS DADOS SÃO ENVIADOS POR POST VIA STRING EM FORMATO DE URL (application/x-www-form-urlencoded)

// require_once("../../../common_assets/php/classes/functions.inc.php");
require_once("../../../common_assets/php/classes/softwaresfunc.class.php");

if($_SERVER['REQUEST_METHOD'] === 'POST')	{
  
  $dados = json_decode(file_get_contents('php://input'), true);
  
	$softwarefunc = new softwaresfunc();

  foreach($dados as $dado){
    $retorno = $softwarefunc->cadastrar_aferidorDesktop($dado);
    if (strpos($retorno, "ERRO") !== false) {
      header('HTTP/1.0 400');
      echo $retorno;

      //Encerrar a requisição
      exit();
    }
  }
  header('HTTP/1.0 200');
  echo ("Softwares cadastrado com sucesso!");

}else{
  header('HTTP/1.0 400');
  echo("ERRO NA REQUISIÇÃO (['REQUEST_METHOD'] === 'POST')");
}

