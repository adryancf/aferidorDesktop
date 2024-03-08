<?php
require_once("../functions.inc.php");
require_once("../softwares.class.php");
if(!empty($_POST))	{
	$nome_itens = explode(";",$_POST["nome_itens"]);
	
	$i = 0;
	$dados = array();
	foreach($_POST as $chave=>$valor){
		if($chave != "nome_itens"){
			$dados[$chave] = $valor;
		}
	}
	$software = new softwares();
	if(empty($dados["id_software"]))
		$retorno = $software->cadastrar($dados);	
	else
		$retorno = $software->modificar($id_software,$dados);
}else{
	echo("Acesso negado!");
}