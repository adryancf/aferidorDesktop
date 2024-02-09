<?php
require_once("../functions.inc.php");
require_once("../softwares.class.php");
if(!empty($_POST))	{
	$id_software = $_POST["id_software"];
	
	$software = new Softwares();
	$retorno = $software->excluir($id_software);
}else{
	echo("Acesso negado!");
}