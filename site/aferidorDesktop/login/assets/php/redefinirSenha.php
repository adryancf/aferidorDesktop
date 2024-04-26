<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once('../../../common_assets/php/classes/login.class.php');

if(!empty($_POST))	{
	$usuario = $_POST["usuario"];
	$novaSenha = $_POST["senha"];

	$login = new Login();
	$retorno = $login->redefinirSenha($usuario,$novaSenha);

  if (strpos($retorno, "ERRO") !== false) {
    header('HTTP/1.0 400');
  }
  echo ($retorno);

}else{
	echo("Acesso negado!");
}