<?php
/*
#           Classe usuarios
#			Atributos
#				N/A
#			Metodos.
#				usuarios();
#				cadastrar($dados_);
#				excluir($id_);
#				modificar($id_,$dados_);
#				Listar($id_)
*/
require_once("conexao.class.php");
require_once("functions.inc.php");
class Usuarios{
	private $tabela = "usuarios";
	private $id = "id_usuario";
	
	public function usuarios(){	
	}
	/*
		Funcao para cadastrar um novo usuario.
		Tem como parametro um array com os dados do funcionrio.
		Retorna uma mensagem indicando se o usuario foi inserido ou ocorreu um erro.
	*/
	public function cadastrar($dados_){		
		#inicializacao das variaveis de controle
		# $msg contem a mensagem de erro
		# $erro caso for maior que 0 existe um erro.
		$msg = "";
		$erro = 0;
		
		#Validacao do preenchimento do formulario.
		if(empty($dados_["nome_usuario"])){
			$erro++;
			echo("Voce precisa preencher o campo <strong>nome</strong><br />");
		}
		if($dados_['senha'] != $dados_['conf_senha']){
			$erro++;
			echo("As <strong>senhas</strong> nao conferem");
		}
		#Caso nao haja nenhum erro cadastra no BD
		if(empty($erro)){
			$indices = "";
			$values = "";
			$ligacao = "";
			foreach($dados_ as $chave=>$valor){
				if(!empty($valor)){
					if(substr_count($chave,"data") > 0){
						$indices .= $ligacao.$chave;
						$values .= $ligacao."'".converteData(1,$valor)."'";
					}elseif(substr_count($chave,"conf_senha") > 0){
					}elseif(substr_count($chave,"senha") > 0){
						$indices .= $ligacao.$chave;
						$values .= $ligacao."'".md5($dados_['senha'] . "2012" . $dados_['login'])."'";
					}else{
						$indices .= $ligacao.$chave;
						$values .= $ligacao."'".$valor."'";
					}
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
				echo(mysqli_error($conexao->conecta) . " :N&atilde;o foi possivel $msg este item devido a um erro.<br />Tente novamente mais tarde, ou contate o administrador do sistema.");
				$conexao->fecharConexao();
			}else{
				echo("Item $msg com sucesso<br />");
			}
		}else {
			echo($msg);
		}
		
	}
	/*
		Funcao que exclui um usuario do BD
		Parametro ID do usuario
		Retorna uma mensagem indicando se o usuario foi inserido ou ocorreu um erro.
	*/
	public function excluir($id_){
		if($id_ != 100){
			$sql = "Delete from $this->tabela where $this->id = '$id_'";
			#conecta no BD
			$conexao = new ConBD;
			#Executa o sql
			$stmt = $conexao->processa($sql,0);
			#Verifica se houve algum erro no processamento do SQL
			#Retorna a mensagem correspondente.
			if(!$stmt){
				#Numero do erro juntamente com uma mensagem explicativa.
				echo(mysqli_errno($conexao->conecta) . " : N&atilde;o foi possivel Selecionar este item devido a um erro.<br />Tente novamente mais tarde, ou contate o administrador do sistema.");
			}else{
				echo("Servico excluido com sucesso");
			}
		}else{
			echo("Este usuario nao pode ser excluido.");
		}
	}
	public function modificar($id_,$dados_){
		$msg = "";
		$erro = 0;
		if(empty($dados_["nome_usuario"])){
			$erro++;
			echo("Voce precisa preencher o campo <strong>nome</strong><br />");
		}
		if(empty($dados_['senha'])){
		}elseif($dados_['senha'] != $dados_['conf_senha']){
			$erro++;
			echo("As <strong>senhas</strong> nao conferem");
		}
		if(empty($erro)){
			$indices = "";
			$values = "";
			$ligacao = "";
			foreach($dados_ as $chave=>$valor){
				if(!empty($valor) && $chave != "$this->id"){
					if(substr_count($chave,"data") > 0){
						$values .= $ligacao."
";
						$values .= $chave." = '".converteData(1,$valor)."'";
						$ligacao = ",";
					}elseif(substr_count($chave,"conf_senha") > 0){
						$ligacao = "";
					}elseif(substr_count($chave,"senha") > 0){
						if(!empty($valor)){
							$values .= $ligacao."
";
							$values .= $chave ." = '".md5($dados_['senha'] . "2012" . $dados_['login'])."'";
							$ligacao = ",";
						}
					}else{
						$values .= $ligacao."
";
						$values .= $chave . " = '".$valor."'";
						$ligacao = ",";
					}						
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
				echo("N&atilde;o foi possivel $msg este item devido a um erro.<br />Tente novamente mais tarde, ou contate o administrador do sistema.");
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
			echo(mysqli_errno($conexao->conecta) . " : N&atilde;o foi possivel Selecionar este item devido a um erro.<br />Tente novamente mais tarde, ou contate o administrador do sistema.");
		}else{
			$row = mysqli_fetch_object($stmt);
			foreach($row as $chave=>$valor){
				$dados[$chave] = $valor;
			}
			return $dados;
		}
	}
	public function gerarSelect(){
		$sql = "Select * from $this->tabela";
		$conexao = new ConBD;
		$stmt = $conexao->processa($sql,0);
		if(!$stmt){
			echo(mysqli_errno($conexao->conecta) . " : N&atilde;o foi possivel Selecionar este item devido a um erro.<br />Tente novamente mais tarde, ou contate o administrador do sistema.");
		}else{
			$select = '<select id="fk_usuario" style="width:90%">
	<option value="" >Selecione</option>';
			while($row = mysqli_fetch_object($stmt)){
				$select .= '<option value="'.$row->id_usuario.'" >'.$row->descricao . " - " .$row->nome . '</option>';
			}
			return $select;
		}
	}
	public function selectSetor($edicao,$id_usuario){
		$sql = "Select * from $this->tabela";
		$conexao = new ConBD;
		$stmt = $conexao->processa($sql,0);
		if(!$stmt){
			echo(mysqli_errno($conexao->conecta) . " : N&atilde;o foi possivel Selecionar este item devido a um erro.<br />Tente novamente mais tarde, ou contate o administrador do sistema.");
		}else{
			if($edicao == 1)
				$edicao = 'disabled="disabled"';
			else
				$edicao = '';
			$dados = '<select id="fk_usuario" '.$edicao.'>';
			$selecionado  = '';
			while ($row = mysqli_fetch_object($stmt)){
				if($id_usuario == $row->id_usuario)
					$selecionado  = 'selected="selected"';
				else
					$selecionado  = '';
				$dados .= '<option value="'.$row->id_usuario .'" '.$selecionado.'>'.$row->nome.'</option>';
			}
			$dados .= '</select>';
			return $dados;
		}
	} 
}
?>