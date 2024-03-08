<?php
require_once("../functions.inc.php");
require_once("../hardwares.class.php");
if(!empty($_POST))	{
	$id_hardware = $_POST["id_hardware"];
	
	$hardware = new Hardwares();
	$retorno = $hardware->excluir($id_hardware);
}else{
	echo("Acesso negado!");
}