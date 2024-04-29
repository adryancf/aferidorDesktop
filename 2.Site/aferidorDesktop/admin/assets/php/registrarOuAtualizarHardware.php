<?php
//ESSE ARQUIVO FOI FEITO, POIS O CADASTRAR.PHP UTILIZAVA UMA FUNÇÃO MODIFICAR QUE TINHA ALGUMAS RESTRIÇÕES QUE NAO FAZIA SENTIDO
//NO AFERIDOR DESKTOP OS ERROS SÃO TRATADOS ANTES DE ENVIAR, ENTÃO NÃO HÁ NECESSIDADE DESSA FUNÇÃO
//E NESSA REQUISIÇÃO PREFERI USAR JSON, POIS ACHO MAIS FÁCIL DE MANIPULAR OS DADOS. NA CADASTRAR.PHP OS DADOS SÃO ENVIADOS POR POST VIA STRING EM FORMATO DE URL (application/x-www-form-urlencoded)

// require_once("../../../common_assets/php/classes/functions.inc.php");
require_once("../../../common_assets/php/classes/hardwares.class.php");


if($_SERVER['REQUEST_METHOD'] === 'POST')	{
  
  $dados = json_decode(file_get_contents('php://input'), true);
  
	$hardware = new hardwares();

  $retorno = null;

	if(empty($dados["id_hardware"])){
		$retorno = $hardware->cadastrar_aferidorDesktop($dados);	
  }
	else{
		$retorno = $hardware->modificar_aferidorDesktop($dados["id_hardware"],$dados);
  }

  if (is_numeric($retorno) == false) {
    header('HTTP/1.0 400');
  }

  echo $retorno;

}else{
	echo("cadastrar_aferidorDesktop.php | ERRO NA REQUISIÇÃO (['REQUEST_METHOD'] === 'POST')");
}

