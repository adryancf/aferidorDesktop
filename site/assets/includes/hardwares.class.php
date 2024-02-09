<?php
/*
#           Classe hardwares
#			Atributos
#				N/A
#			Metodos.
#				hardwares();
#				cadastrar($dados_);
#				excluir($id_);
#				modificar($id_,$dados_);
#				Listar($id_)
*/
require_once("conexao.class.php");
require_once("functions.inc.php");
class Hardwares{
	private $tabela = "hardwares_novo";
	private $id = "id_hardware";
	
	public function hardwares(){	
	}
	/*
		Funcao para cadastrar um novo hardware.
		Tem como parametro um array com os dados do funcionrio.
		Retorna uma mensagem indicando se o hardware foi inserido ou ocorreu um erro.
	*/
	public function cadastrar($dados_){		
		#inicializacao das variaveis de controle
		# $msg contem a mensagem de erro
		# $erro caso for maior que 0 existe um erro.
		$msg = "";
		$erro = 0;
		
		#Validacao do preenchimento do formulario.
		if(empty($dados_["numero"])){
			$erro++;
			echo("Você precisa preencher o campo <strong>Número</strong><br />");
		}
		if(empty($dados_["fk_funcionario"])){
			$erro++;
			echo("Você precisa selecionar um <strongb>Funcionário</strongb
			r />");
		}

		#Caso nao ha nenhum erro cadastra no BD
		if(empty($erro)){

			//Verificação se o nome do funcionário ja esta vinculado a uma maquina
			$conexao = new ConBD;
			$id_funcionario = $dados_["fk_funcionario"];
			$maquina = $dados_["numero"];

			//A consulta retornará o número total de registros na tabela que possuem o mesmo nome. Esse valor será armazenado na coluna "total" do resultado da consulta.
			$sql = "SELECT COUNT(*) AS total FROM $this->tabela WHERE fk_funcionario = '$id_funcionario'";
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
					echo("O funcionario selecionado ja esta vinculado a uma maquina<br>");
				} 
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

  public function cadastrar_aferidorDesktop($dados_){		
		#inicializacao das variaveis de controle
		# $msg contem a mensagem de erro
		# $erro caso for maior que 0 existe um erro.
		
		
		#Validacao do preenchimento do formulario.
		if(empty($dados_["numero"])){
			return ("Você precisa preencher o numero da máquina!");
		}
		if(empty($dados_["fk_funcionario"])){
			return ("Você precisa selecionar um Funcionário!");
		}

    //Verificação se o nome do funcionário ja esta vinculado a uma maquina
    $conexao = new ConBD;

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
    $conexao = new ConBD;
    $stmt = $conexao->processa($sql,1);

    if(!$stmt){
      return("ERRO: " . mysql_error($conexao->conecta));
      $conexao->fecharConexao();
    }else{
      $last_id = mysql_insert_id($conexao->conecta);
      return $last_id;
    }
		
		
	}
	/*
		Funcao que exclui um hardware do BD
		Parametro ID do hardware
		Retorna uma mensagem indicando se o hardware foi inserido ou ocorreu um erro.
	*/
	public function excluir($id_){
		if($id_ != 100){
			// Desinstala programas 
			$sql = "Delete from softwaresfunc where fk_hardware = '$id_'";
			#conecta no BD
			$conexao = new ConBD;
			#Executa o sql
			$stmt = $conexao->processa($sql,0);
			
			// Apaga hardware
			$sql = "Delete from $this->tabela where $this->id = '$id_'";
			
			#conecta no BD
			$conexao = new ConBD;
			#Executa o sql
			$stmt = $conexao->processa($sql,1);
			#Verifica se houve algum erro no processamento do SQL
			#Retorna a mensagem correspondente.
			if(!$stmt){
				#Numero do erro juntamente com uma mensagem explicativa.
				echo(mysql_errno($conexao->conecta) . " : Não foi possível selecionar este item devido a um erro.<br>
				Tente novamente mais tarde ou contate o administrador do sistema.");
			}else{
				echo("Hardware excluído com sucesso");
			}
			$conexao->fecharConexao();
		}else{
			echo("Você nao pode excluir este hardware.");
		}
	}
	public function modificar($id_,$dados_){
		if($id_ != 100){
			$msg = "";
			$erro = 0;
			if($dados_["numero"] == ""){
				$erro++;
				echo("Você precisa preencher o campo <strong>Número</strong><br />");
			}/*elseif(!is_numeric($dados_["numero"])){
				$erro++;
				echo("Você precisa preencher o campo <strong>numero</strong> apenas com numeros<br />");
			}*/
			if(empty($dados_["fk_funcionario"])){
				$erro++;
				echo("Você precisa selecionar um <strongbr>Funcionário</strongb
				r />");
			}
			if(empty($erro)){
				$indices = "";
				$values = "";
				$ligacao = "";
				$dados_["data_atualizacao"] = date("d/m/Y");
				//quando o usuario clica em enviar, ele troca o valor da data de atualiza��o pela data do dia, para tirar essa troca basta tirar a linha $dados_["data_atualizacao"] = date("d/m/Y");
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
				echo($sql);
				$msg = " Modificado ";
				$conexao = new ConBD;
				$stmt = $conexao->processa($sql,0);
				if(!$stmt){
					echo("Não foi possível $msg este item devido a um erro.<br>
					Tente novamente mais tarde ou contate o administrador do sistema.");
				}else{
					echo("Item $msg com sucesso<br>");
				}
			}else {
				echo($msg);
			}
		}else{
			echo("Você não pode modificar este hardware.");
		}
	}

  public function modificar_aferidorDesktop($id_,$dados_){
		if($id_ != 100){
			
      $values = "";
      $ligacao = "";
      $dados_["data_atualizacao"] = date("d/m/Y");

      foreach($dados_ as $chave=>$valor){
        if(!empty($valor) && $chave != "$this->id"){
          $values .= $ligacao."";
          if(substr_count($chave,"data") > 0)
            $values .= $chave." = '".converteData(1,$valor)."'";
          else
            $values .= $chave . " = '".$valor."'";
            
          $ligacao = ",";
        }
      }	
      
      $sql = "UPDATE $this->tabela SET $values WHERE id_hardware = '".$dados_["id_hardware"]."'";// $sql - caso edi��o
      //echo($sql);

      $conexao = new ConBD;
      $stmt = $conexao->processa($sql,0);
      if(!$stmt){
        return ("ERRO: Não foi possível atualizar o item devido a um erro. - [function:modificar_aferidorDesktop]");
      }else{
        //retornar id do elemento modificado
        return $dados_["id_hardware"];
        //return("Item modificado com sucesso");
      }
		}else{
			return("ERRO: Você não pode modificar este hardware.");
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
				if(substr_count($chave,"data") > 0)
					$dados[$chave] = converteData(0,$valor);
				else
					$dados[$chave] = $valor;
			}
			return $dados;
		}
	}
	public function pegarFk($numero){
		$sql = "Select * from $this->tabela where numero = '$numero'";
		$conexao = new ConBD;
		$stmt = $conexao->processa($sql,0);
		if(!$stmt){
			echo(mysql_errno($conexao->conecta) . " : Não foi possível selecionar este item devido a um erro.<br>
			Tente novamente mais tarde ou contate o administrador do sistema.");
		}else{
			$fk_hardware = 100;
			while($row = mysql_fetch_object($stmt)){
				$fk_hardware = $row->id_hardware;
			}
			return $fk_hardware;
		}
	}
	public function gerarSelect($id_hardware){
		$sql = "Select * from vw_$this->tabela order by numero asc";
		$conexao = new ConBD;
		$stmt = $conexao->processa($sql,0);
		if(!$stmt){
			echo(mysql_errno($conexao->conecta) . " : Não foi possível selecionar este item devido a um erro.<br>
			Tente novamente mais tarde ou contate o administrador do sistema.");
		}else{
			$select = '<select id="fk_hardware" name="fk_hardware" style="width:90%">
	<option value="" >Selecione</option>';
			while($row = mysql_fetch_object($stmt)){
				if($id_hardware == $row->id_hardware){
					$selecionado  = 'selected="selected"';
				}else{
					$selecionado  = '';
				}
				
				$select .= '<option value="'.$row->id_hardware.'" '.$selecionado .'>'. "[" . $row->numero . "] - " .$row->nome_funcionario . '</option>';
			}
			return $select;
		}
	}
	public function gerarSelectNumero(){
		$sql = "Select * from vw_$this->tabela order by numero asc";
		$conexao = new ConBD;
		$stmt = $conexao->processa($sql,0);
		if(!$stmt){
			echo(mysql_errno($conexao->conecta) . " : Não foi possível selecionar este item devido a um erro.<br>
			Tente novamente mais tarde ou contate o administrador do sistema.");
		}else{
			$select = '<select id="fk_hardware" name="fk_hardware" style="width:90%">
	<option value="" >Selecione</option>';
			while($row = mysql_fetch_object($stmt)){
				$select .= '<option value="'.$row->id_hardware.'" >'.$row->numero .'</option>';
			}
			return $select;
		}
	}
}
?>