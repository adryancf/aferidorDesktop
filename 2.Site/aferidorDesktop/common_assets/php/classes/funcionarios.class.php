<?php
/*
#           Classe funcionarios
#			Atributos
#				N/A
#			Metodos.
#				funcionarios();
#				cadastrar($dados_);
#				excluir($id_);
#				modificar($id_,$dados_);
#				Listar($id_)
*/
require_once("conexao.class.php");
require_once("functions.inc.php");
class Funcionarios{
	private $tabela = "funcionarios";
	private $id = "id_funcionario";
	
	public function funcionarios(){	
	}
	/*
		Funcao para cadastrar um novo funcionario.
		Tem como parametro um array com os dados do funcionrio.
		Retorna uma mensagem indicando se o funcionario foi inserido ou ocorreu um erro.
	*/

	public function array_(){
		$sql = "Select * from $this->tabela where status_funcionario = 'Ativo' order by nome_funcionario asc";
		$conexao = new ConBD;
		$stmt = $conexao->processa($sql,0);
		if(!$stmt){
			echo(mysqli_errno($conexao->conecta) . " : N&atilde;o foi possivel Selecionar este item devido a um erro.<br />Tente novamente mais tarde, ou contate o administrador do sistema.");
		}else{
			$items = array();
			while($row = mysqli_fetch_object($stmt)){
				//$items[$row->nome_funcionario." [".$row->matricula."]"]=$row->id_funcionario;
				$items[$row->nome_funcionario]=$row->id_funcionario;
			}
			return $items;
		}
	}

  	public function array_setor(){
		$sql = "SELECT * from $this->tabela INNER JOIN padrao.setores AS s ON $this->tabela.fk_setor = s.id_setor WHERE status_funcionario = 'Ativo' order by nome_funcionario asc";
    
		$conexao = new ConBD;
		$stmt = $conexao->processa($sql,0);
		if(!$stmt){
			echo(mysqli_errno($conexao->conecta) . " : N&atilde;o foi possivel Selecionar este item devido a um erro.<br />Tente novamente mais tarde, ou contate o administrador do sistema.");
		}else{
			$items = array();
			while($row = mysqli_fetch_object($stmt)){
				//$items[$row->matricula."-".$row->nome_funcionario]=$row->id_funcionario;
        $items[$row->matricula . "-" . $row->nome_funcionario] = array(
          'id_funcionario' => $row->id_funcionario,
          'id_setor' => $row->id_setor
        );
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
		if(empty($dados_["nome_funcionario"])){
			$erro++;
			echo("Você precisa preencher o campo <strong>Nome</strong><br />");
		}

		if(empty($dados_["fk_setor"])){
			$erro++;
			echo("Você precisa selecionar um <strong>Setor</strong><br />");
		}

		if($dados_["funcao"] == ""){
			$erro++;
			echo("Voce precisa preencher o campo <strong>funcao</strong><br />");
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
				echo(mysqli_error($conexao->conecta) . " :Não foi possível $msg este item devido a um erro.<br>
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
		Funcao que exclui um funcionario do BD
		Parametro ID do funcionario
		Retorna uma mensagem indicando se o funcionario foi inserido ou ocorreu um erro.
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
				echo(mysqli_errno($conexao->conecta) . " : Não foi possível selecionar este item devido a um erro.<br>
				Tente novamente mais tarde ou contate o administrador do sistema.");
			}else{
				echo("Funcionário excluído com sucesso");
			}
	}
	public function modificar($id_,$dados_){
		$msg = "";
		$erro = 0;
		if(empty($dados_["nome_funcionario"])){
			$erro++;
			echo("Você precisa preencher o campo <strong>Nome</strong><br />");
		}
		if(empty($dados_["fk_setor"])){
			$erro++;
			echo("Você precisa selecionar um <strong>Setor</strong><br />");
		}
		if($dados_["funcao"] == ""){
			$erro++;
			echo("Voce precisa preencher o campo <strong>funcao</strong><br />");
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
			echo(mysqli_errno($conexao->conecta) . " : Não foi possível selecionar este item devido a um erro.<br>
			Tente novamente mais tarde ou contate o administrador do sistema.");
		}else{
			$row = mysqli_fetch_object($stmt);
			foreach($row as $chave=>$valor){
				$dados[$chave] = $valor;
			}
			return $dados;
		}
	}
	public function gerarSelect($id_funcionario){
		$sql = "Select * from $this->tabela where status_funcionario = 'Ativo' order by nome_funcionario";
		$conexao = new ConBD;
		$stmt = $conexao->processa($sql,0);
		if(!$stmt){
			echo(mysqli_errno($conexao->conecta) . " : Não foi possível selecionar este item devido a um erro.<br>
			Tente novamente mais tarde ou contate o administrador do sistema.");
		}else{
				$select = '<select id="fk_funcionario" name="fk_funcionario" style="width:90%">
				<option value="" >Selecione</option>';
				while($row = mysqli_fetch_object($stmt)){
					if($id_funcionario == $row->id_funcionario)
						$selecionado  = 'selected="selected"';
					else
						$selecionado  = '';
					$select .= '<option value="'.$row->id_funcionario.'" '.$selecionado.'>'. $row->nome_funcionario . '</option>';
				}
				return $select;
		}
	} 
}
?>