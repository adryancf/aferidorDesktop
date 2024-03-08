<?php
/*
#           Classe setores
#			Atributos
#				N/A
#			Metodos.
#				setores();
#				cadastrar($dados_);
#				excluir($id_);
#				modificar($id_,$dados_);
#				Listar($id_)
*/
require_once("conexao.class.php");
require_once("functions.inc.php");
class Setores{
	private $tabela = "padrao.setores";
	private $id = "id_setor";
	
	public function setores(){	
	}
	/*
		Funcao para cadastrar um novo setor.
		Tem como parametro um array com os dados do funcionrio.
		Retorna uma mensagem indicando se o setor foi inserido ou ocorreu um erro.
	*/

	public function array_(){
		$sql = "Select * from $this->tabela order by nome_setor asc";
		$conexao = new ConBD;
		$stmt = $conexao->processa($sql,0);
		if(!$stmt){
			echo(mysql_errno($conexao->conecta) . " : N&atilde;o foi possivel Selecionar este item devido a um erro.<br />Tente novamente mais tarde, ou contate o administrador do sistema.");
		}else{
			$items = array();
			while($row = mysql_fetch_object($stmt)){
				$items[$row->cc."-".$row->nome_setor]=$row->id_setor;
			}
			return $items;
		}
	}


	public function cadastrar($dados_){		
		#inicializacao das variaveis de controle
		# $msg contem a mensagem de erro
		# $erro caso for maior que 0 existe um erro.
		$msg = "";
		$erro = 0;
		
		#Validacao do preenchimento do formulario.
		if(empty($dados_["nome_setor"])){
			$erro++;
			echo("Você precisa preencher o campo <strong>Nome</strong><br />");
		}
		if($dados_["cc"] == ""){
			$erro++;
			echo("Você precisa preencher o campo <strong>CC</strong><br />");
		}
		#Caso nao haja nenhum erro cadastra no BD
		if(empty($erro)){
			$indices = "";
			$values = "";
			$ligacao = "";
			foreach($dados_ as $chave=>$valor){
				if(!empty($valor)){
					$indices .= $ligacao.$chave;
					if(substr_count($chave,"data") > 0)
						$values .= $ligacao."'".converteData(1,$valor)."'";
					else
						$values .= $ligacao."'".$valor."'";
					$ligacao = ",";
				}
			}
			$sql = "INSERT INTO $this->tabela($indices) VALUES ($values)";// $sql - instrucao sql
			//echo($sql);
			#acao efetuada
			$msg = "Inserido";
			#conecta no BD
			$conexao = new ConBD;
			#Executa o sql
			$stmt = $conexao->processa($sql,1);
			#Verifica se houve algum erro no processamento do SQL
			#Retorna a mensagem correspondente.
			if(!$stmt){
				#Numero do erro juntamente com uma mensagem explicativa.
				echo(mysql_error($conexao->conecta) . " :Não foi possível $msg este item devido a um erro.<br>
				Tente novamente mais tarde ou contate o administrador do sistema.");
				$conexao->fecharConexao();
			}else{
				echo("Item $msg com sucesso<br />");
			}
		}else {
			echo($msg);
		}
		
	}
	/*
		Funcao que exclui um setor do BD
		Parametro ID do setor
		Retorna uma mensagem indicando se o setor foi inserido ou ocorreu um erro.
	*/
	public function excluir($id_){
			$sql = "Delete from $this->tabela where $this->id = '$id_'";
			#conecta no BD
			$conexao = new ConBD;
			#Executa o sql
			$stmt = $conexao->processa($sql,0);
			#Verifica se houve algum erro no processamento do SQL
			#Retorna a mensagem correspondente.
			if(!$stmt){
				#Numero do erro juntamente com uma mensagem explicativa.
				echo(mysql_errno($conexao->conecta) . " : Não foi possível selecionar este item devido a um erro.<br>
				Tente novamente mais tarde ou contate o administrador do sistema.");
			}else{
				echo("Servico excluido com sucesso");
			}
	}
	public function modificar($id_,$dados_){
		$msg = "";
		$erro = 0;
		if(empty($dados_["nome_setor"])){
			$erro++;
			echo("Você precisa preencher o campo <strong>Nome</strong><br />");
		}
		if($dados_["cc"] == ""){
			$erro++;
			echo("Você precisa preencher o campo <strong>CC</strong><br />");
		}
		if(empty($erro)){
			$indices = "";
			$values = "";
			$ligacao = "";
			foreach($dados_ as $chave=>$valor){
				if(!empty($valor) && $chave != "$this->id"){
					$values .= $ligacao."
";
					if(substr_count($chave,"data") > 0)
						$values .= $chave." = '".converteData(1,$valor)."'";
					else
						$values .= $chave . " = '".$valor."'";
						
					$ligacao = ",";
				}
			}		
			$sql = "UPDATE $this->tabela SET 
						$values
						WHERE $this->id = '".$dados_["$this->id"]."'";// $sql - caso edi��o
			//echo($sql);
			$msg = " Modificado ";
			$conexao = new ConBD;
			$stmt = $conexao->processa($sql,0);
			if(!$stmt){
				echo("Não foi possível $msg este item devido a um erro.<br>
				Tente novamente mais tarde ou contate o administrador do sistema.");
			}else{
				echo("Item $msg com sucesso<br />");
			}
		}else {
			echo($msg);
		}
	}
	public function Listar($id_){
		$sql = "Select * from $this->tabela where $this->id = '$id_'";
		$conexao = new ConBD;
		$stmt = $conexao->processa($sql,0);
		if(!$stmt){
			echo(mysql_errno($conexao->conecta) . " : Não foi possível selecionar este item devido a um erro.<br>
			Tente novamente mais tarde ou contate o administrador do sistema.");
		}else{
			$row = mysql_fetch_object($stmt);
			foreach($row as $chave=>$valor){
				$dados[$chave] = $valor;
			}
			return $dados;
		}
	}
	public function gerarSelect($id_setor){
		//$sql = "Select * from $this->tabela";
		$sql = "Select * from $this->tabela ORDER BY cc";
		$conexao = new ConBD;
		$stmt = $conexao->processa($sql,0);
		if(!$stmt){
			echo(mysql_errno($conexao->conecta) . " : Não foi possível selecionar este item devido a um erro.<br>
			Tente novamente mais tarde ou contate o administrador do sistema.");
		}else{
			$select = '<select id="fk_setor" name="fk_setor" style="width:90%">
	<option value="" >Selecione</option>';
			while($row = mysql_fetch_object($stmt)){
				if($id_setor == $row->id_setor)
					$selecionado  = 'selected="selected"';
				else
					$selecionado  = '';
				$select .= '<option value="'.$row->id_setor.'" '.$selecionado.'>'.$row->cc . " - " .$row->nome_setor . '</option>';
			}
			return $select;
		}
	}

	public function gerarSelect2($id_setor){
		//$sql = "Select * from $this->tabela";
		$sql = "Select * from $this->tabela ORDER BY cc";
		$conexao = new ConBD;
		$stmt = $conexao->processa($sql,0);
		if(!$stmt){
			echo(mysql_errno($conexao->conecta) . " : N&atilde;o foi possivel Selecionar este item devido a um erro.<br />Tente novamente mais tarde, ou contate o administrador do sistema.");
		}else{
			$select = '<select id="fk_setor2" name="fk_setor2" style="width:90%">
	<option value="" >Selecione</option>';
			while($row = mysql_fetch_object($stmt)){
				if($id_setor == $row->id_setor)
					$selecionado  = 'selected="selected"';
				else
					$selecionado  = '';
				$select .= '<option value="'.$row->id_setor.'" '.$selecionado.'>'.$row->cc . " - " .$row->nome_setor . '</option>';
			}
			return $select;
		}
	}
}




?>