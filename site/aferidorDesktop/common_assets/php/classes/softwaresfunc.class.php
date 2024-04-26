<?php
/*
#           Classe softwaresfunc
#			Atributos
#				N/A
#			Metodos.
#				softwaresfunc();
#				cadastrar($dados_);
#				excluir($id_);
#				modificar($id_,$dados_);
#				Listar($id_)
*/
require_once("conexao.class.php");
require_once("functions.inc.php");
class Softwaresfunc{
	private $tabela = "softwaresfunc";
	private $id = "id_softwarefunc";
	
	public function softwaresfunc(){	
	}
	/*
		Funcao para cadastrar um novo softwarefunc.
		Tem como parametro um array com os dados do funcionrio.
		Retorna uma mensagem indicando se o softwarefunc foi inserido ou ocorreu um erro.
	*/
	public function cadastrar($dados_){		
		#inicializacao das variaveis de controle
		# $msg contem a mensagem de erro
		# $erro caso for maior que 0 existe um erro.
		$msg = "";
		$erro = 0;
		
		#Validacao do preenchimento do formulario.
		if(empty($dados_["fk_hardware"])){
			$erro++;
			echo("Voce precisa selecionar uma <strong>maquina</strong><br />");
		}
		if(empty($dados_["fk_software"])){
			$erro++;
			echo("Voce precisa selecionar um <strong>fk_software</strong><br />");
		}
		if(empty($dados_["data_instalacao"])){
			$erro++;
			echo("Voce precisa preencher o campo <strong>Data de instalacao</strong><br />");
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
			
			#conecta no BD
			$conexao = new ConBD;
			#Executa o sql
			$stmt = $conexao->processa($sql,1);
			#Verifica se houve algum erro no processamento do SQL
			#Retorna a mensagem correspondente.
			if(!$stmt){
				#Numero do erro juntamente com uma mensagem explicativa.
				echo(mysql_error($conexao->conecta) . " :N&atilde;o foi possivel $msg este item devido a um erro.<br />Tente novamente mais tarde, ou contate o administrador do sistema.");
				$conexao->fecharConexao();
			}else{
				echo("Item inserido com sucesso<br />");
			}
		}
    
    else {
			echo($msg);
		}
		
	}

  //Função adcionar com tratamento de erro mais adequado
  public function cadastrar_aferidorDesktop($dados_){		
    #Validacao do preenchimento do formulario.
    if(empty($dados_["fk_hardware"])){
      return ("ERRO: [Software] Você precisa selecionar uma máquina.");
    }
    if(empty($dados_["fk_software"])){
      return ("ERRO: [Software] Você precisa selecionar um software.");
    }
    if(empty($dados_["data_instalacao"])){
      return ("ERRO: [Software] Campo [data_instalacao] está vazio.");
    }

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

    //Conecta o BD
    $conexao = new ConBD;
    
    //Executa o sql
    $stmt = $conexao->processa($sql,1);
    
    if(!$stmt){
      #Numero do erro juntamente com uma mensagem explicativa.
      $erro = mysqli_error($conexao->conecta);
      $conexao->fecharConexao();           
      return("ERRO: [Software] ". $erro);
    }else{
      return("Item inserido com sucesso");
    }
		
	}

	/*
		Funcao que exclui um softwarefunc do BD
		Parametro ID do softwarefunc
		Retorna uma mensagem indicando se o softwarefunc foi inserido ou ocorreu um erro.
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
				echo(mysql_errno($conexao->conecta) . " : N&atilde;o foi possivel Selecionar este item devido a um erro.<br />Tente novamente mais tarde, ou contate o administrador do sistema.");
			}else{
				echo("Servico excluido com sucesso");
			}
		}else{
			echo("Este softwarefunc nao pode ser excluido.");
		}
	}
	public function modificar($id_,$dados_){
		$msg = "";
		$erro = 0;
		if(empty($dados_["fk_hardware"])){
			$erro++;
			echo("Voce precisa selecionar uma <strong>maquina</strong><br />");
		}
		if(empty($dados_["fk_software"])){
			$erro++;
			echo("Voce precisa selecionar um <strong>fk_software</strong><br />");
		}
		if(empty($dados_["data_instalacao"])){
			$erro++;
			echo("Voce precisa preencher o campo <strong>Data de instalacao</strong><br />");
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
			echo(mysql_errno($conexao->conecta) . " : N&atilde;o foi possivel Selecionar este item devido a um erro.<br />Tente novamente mais tarde, ou contate o administrador do sistema.");
		}else{
			$row = mysql_fetch_object($stmt);
			foreach($row as $chave=>$valor){
				if(substr_count($chave,"data") > 0)
					$dados[$chave] = converteData(0,$valor);
				else
					$dados[$chave] = $valor;
			}
			return $dados;
		}
	}
	public function gerarLista($fk_hardware){
		$sql = "Select * from softwares_instalados where fk_hardware = '$fk_hardware'";
		$conexao = new ConBD;
		$stmt = $conexao->processa($sql,0);
		if(!$stmt){
			echo(mysql_errno($conexao->conecta) . " : N&atilde;o foi possivel Selecionar este item devido a um erro.<br />Tente novamente mais tarde, ou contate o administrador do sistema.");
		}else{
			$retorno = '<table class="tabela">
						 <tr>
						 	<td collspan="2">

							<a href="http://192.168.3.129/sistemas/paginas/programas/page.php?name_page=softwaresfunc/softwaresfunc.php&id_page=563,566&fk_hardware=' . $fk_hardware . '" target="_blank"> 
							 	<img src="./includes/helpdesks/botao_mais.png" alt="Detalhes" width="8px" height="8px" verrtical-align ="middle" />
						 	</a>
								
							<span class="subtitulo">Programas instalados</span>
														
							</td>
							</td>
						</tr>
						<tr>
						 	<td bgcolor="#CCCCCC">Nome do programa</td>
							<td bgcolor="#CCCCCC">Data de instala&ccedil;&atilde;o</td>
							<td bgcolor="#CCCCCC">A&ccedil;&atilde;o</td>
						</tr>
						';
						

			$cor = "bgcolor=\"#F5F5F5\"";			

			while($row = mysql_fetch_object($stmt)){
				$retorno .= "<tr>
								<td ".$cor.">".$row->nome."</td>
								<td ".$cor.">".converteData(0,$row->data_instalacao)."</td>
								<td ".$cor.">
									<a href=\"http://192.168.3.129/sistemas/paginas/programas/page.php?name_page=softwaresfunc/softwaresfunc.php&id_page=563,566&id=".$row->id_softwarefunc."\" target=\"_blank\">Editar</a> | 
									<input type=\"button\" onclick=\"javascript: excluirsoftfunc(".$row->id_softwarefunc.",this);\" class=\"botaoAcao\" value=\"Excluir\"> | 
									<a href=\"http://192.168.3.129/sistemas/paginas/programas/page.php?name_page=softwaresfunc/softwaresfunc.php&id_page=563,566&fk_hardware=".$row->fk_hardware."\" target=\"_blank\">Novo</a>
								</td>
							</tr>";

				if($cor == "bgcolor=\"#F5F5F5\"")
					$cor = "bgcolor=\"#CCCCCC\"";
				else
					$cor = "bgcolor=\"#F5F5F5\"";
			}
			$retorno .= '</table>';	
			return $retorno;
		}
	}
	public function gerarSelect(){
		$sql = "Select * from $this->tabela";
		$conexao = new ConBD;
		$stmt = $conexao->processa($sql,0);
		if(!$stmt){
			echo(mysql_errno($conexao->conecta) . " : N&atilde;o foi possivel Selecionar este item devido a um erro.<br />Tente novamente mais tarde, ou contate o administrador do sistema.");
		}else{
			$select = '<select id="fk_softwarefunc" name="fk_softwarefunc" style="width:90%">
	<option value="" >Selecione</option>';
			while($row = mysql_fetch_object($stmt)){
				$select .= '<option value="'.$row->id_softwarefunc.'" >'.$row->nome . " - " .$row->n_licencas . '</option>';
			}
			return $select;
		}
	}
}
?>