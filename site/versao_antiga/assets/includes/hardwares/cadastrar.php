<?php
require_once("../functions.inc.php");
require_once("../hardwares.class.php");
if(!empty($_POST))	{
	$nome_itens = explode(";",$_POST["nome_itens"]);
  
	$i = 0;
	$dados = array();
	foreach($_POST as $chave=>$valor){
		if($chave != "nome_itens"){
			$dados[$chave] = $valor;
		}
	}
	$hardware = new hardwares();

	if(empty($dados["id_hardware"])){
		$retorno = $hardware->cadastrar($dados);	
  }
	else{
		$retorno = $hardware->modificar($id_hardware,$dados);
  }
}else{
	echo("cadastrar.php | Acesso negado!");
}

