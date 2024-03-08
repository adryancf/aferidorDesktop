<?php
require_once("../functions.inc.php");
require_once("../hardwares.class.php");
require_once("../conexao.class.php");

if(!empty($_POST))	{

	//Verificação se o nome do funcionário ja esta vinculado a uma maquina
    $conexao = new ConBD;
    $id_funcionario = $_POST["idFuncionario"];
    $tabela = "hardwares_novo";

    //A consulta retornará o número total de registros na tabela que possuem o mesmo nome. Esse valor será armazenado na coluna "total" do resultado da consulta.
    $sql = "SELECT COUNT(*) AS total FROM $tabela WHERE fk_funcionario = '$id_funcionario'";
    
    $stmt = $conexao->processa($sql,0);

    if(!$stmt){
        echo(mysql_error($conexao->conecta) . " :Não foi possível $msg este item devido a um erro.<br>
        Tente novamente mais tarde ou contate o administrador do sistema.");
        $conexao->fecharConexao();
    }
    else{
        $resultado = mysql_fetch_assoc($stmt);
        $total = $resultado['total'];
    
        if ($total > 0) {
            echo("true");
        } 
        else
        {
            echo("false");
        }
    }
}

//Fazer um post para ca, e verificar a duplicidade. Se houver retorna 200, se nao 404
?>
