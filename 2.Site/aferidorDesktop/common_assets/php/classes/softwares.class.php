<?php
/*
#           Classe softwares
#			Atributos
#				N/A
#			Metodos.
#				softwares();
#				cadastrar($dados_);
#				excluir($id_);
#				modificar($id_,$dados_);
#				Listar($id_)
*/
require_once("conexao.class.php");
require_once("functions.inc.php");
class Softwares{
	private $tabela = "softwares";
	private $id = "id_software";
	
	public function softwares(){	
	}
	/*
		Funcao para cadastrar um novo software.
		Tem como parametro um array com os dados do funcionrio.
		Retorna uma mensagem indicando se o software foi inserido ou ocorreu um erro.
	*/
	public function cadastrar($dados_){		
		#inicializacao das variaveis de controle
		# $msg contem a mensagem de erro
		# $erro caso for maior que 0 existe um erro.
		$msg = "";
		$erro = 0;
		
		#Validacao do preenchimento do formulario.
		if(empty($dados_["nome"])){
			$erro++;
			echo("Você precisa preencher o campo <strong>Nome</strong><br />");
		}
		if($dados_["n_licencas"] == ""){
			$erro++;
			echo("Você precisa preencher o campo <strong>Número de licenças</strong><br />");
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
		Funcao que exclui um software do BD
		Parametro ID do software
		Retorna uma mensagem indicando se o software foi inserido ou ocorreu um erro.
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
			echo("Software excluído com sucesso");
		}
	}
	public function modificar($id_,$dados_){
		$msg = "";
		$erro = 0;
		if(empty($dados_["nome"])){
			$erro++;
			echo("Você precisa preencher o campo <strong>Nome</strong><br />");
		}
		if($dados_["n_licencas"] == ""){
			$erro++;
			echo("Você precisa preencher o campo <strong>Número de licenças</strong><br />");
		}elseif($dados_["n_licencas"] == "0"){
			$dados_["n_licencas"] = '00';
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
	public function numLicencasInstaladas($id_,$fk_setor = 0){
		$sql = "Select * from softwares_instalados where fk_software = '$id_'";
		if($fk_setor > 0)
			$sql .= " and fk_setor = $fk_setor";
		$conexao = new ConBD;
		$stmt = $conexao->processa($sql,0);
		if(!$stmt){
			echo(mysqli_errno($conexao->conecta) . " : Não foi possível selecionar este item devido a um erro.<br>
			Tente novamente mais tarde ou contate o administrador do sistema.");
		}else{
			$i = 0;
			while($row = mysqli_fetch_object($stmt)){
				$i++;
			}
			return $i;
		}
	}
	public function gerarSelect($id_software){
		$sql = "Select * from $this->tabela ORDER BY nome";
		$conexao = new ConBD;
		$stmt = $conexao->processa($sql,0);
		if(!$stmt){
			echo(mysqli_errno($conexao->conecta) . " : Não foi possível selecionar este item devido a um erro.<br>
			Tente novamente mais tarde ou contate o administrador do sistema.");
		}else{
			$select = '<select id="fk_software" name="fk_software" style="width:90%">
	<option value="" >Selecione</option>';
			while($row = mysqli_fetch_object($stmt)){
				if($id_software == $row->id_software)
					$selecionado  = 'selected="selected"';
				else
					$selecionado  = '';
				$select .= '<option value="'.$row->id_software.'" '.$selecionado.'>'.$row->nome . " - " .$row->n_licencas . '</option>';
			}
			return $select;
		}
	}
}
?>