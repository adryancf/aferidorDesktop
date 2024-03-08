<?php
/*
#           Classe helpdesks
#			Atributos
#				N/A
#			Metodos.
#				helpdesks();
#				cadastrar($dados_);
#				excluir($id_);
#				modificar($id_,$dados_);
#				Listar($id_)
*/
require_once("conexao.class.php");
require_once("hardwares.class.php");
require_once("functions.inc.php");
require_once("email.class.php");
class Helpdesks
{
	private $tabela = "helpdesks_novo";
	private $id = "id_helpdesk";
	private $ano = '';
	public function helpdesks()
	{
		$ano = date('Y');
	}
	/*
		Funcao para cadastrar um novo helpdesk.
		Tem como parametro um array com os dados do funcionrio.
		Retorna uma mensagem indicando se o helpdesk foi inserido ou ocorreu um erro.
	*/
	public function cadastrar($dados_)
	{
		#inicializacao das variaveis de controle
		# $msg contem a mensagem de erro
		# $erro caso for maior que 0 existe um erro.
		$msg = "";
		$erro = 0;
		$numero = $dados_["fk_hardware"];
		#Validacao do preenchimento do formulario.
		if (empty($dados_["fk_hardware"])) {
			$erro++;
			echo ("Você precisa preencher o campo <strong>Código da máquina</strong><br />");
		} else {
			$hardware = new Hardwares();
			$dados_["fk_hardware"] = $hardware->pegarFk($dados_["fk_hardware"]);
			if(empty($dados_["fk_hardware"]))
			{
				echo "Maquina nao esta cadastrada!";
			}
		}
		if (empty($dados_["fk_funcionario"])) {
			$erro++;
			echo ("Você precisa preencher o campo <strong>Funcionário</strong><br />");
		}
		if (empty($dados_["fk_setor"])) {
			$erro++;
			echo ("Você precisa preencher o campo <strong>Departamento</strong><br />");
		}
		if (empty($dados_["descricao"])) {
			$erro++;
			echo ("Você precisa preencher o campo <strong>Descrição</strong><br />");
		} else {
			if ($dados_["fk_hardware"] == 100)
				$dados_["descricao"] .= "
Numero da maquina: $numero";
		}
		if (empty($dados_["email_solicitante"])) {
			$erro++;
			echo ("Você precisa preencher o campo <strong>Email</strong><br />");
		}
		#Caso nao haja nenhum erro cadastra no BD
		if (empty($erro)) {
			$indices = "";
			$values = "";
			$ligacao = "";
			foreach ($dados_ as $chave => $valor) {
				if (!empty($valor)) {
					$indices .= $ligacao . $chave;
					//echo $chave;
					if (substr_count($chave, "data") > 0)
						$values .= $ligacao . "'" . converteData(1, $valor) . "'";
					else
						$values .= $ligacao . "'" . $valor . "'";
					$ligacao = ",";
				}
			}
			$sql = "INSERT INTO $this->tabela($indices) VALUES ($values)"; // $sql - instrucao sql
			//echo($sql);
			#acao efetuada
			$msg = "Inserido";
			#conecta no BD
			$conexao = new ConBD;
			#Executa o sql
			$stmt = $conexao->processa($sql, 1);
			$id = mysql_insert_id($conexao->conecta);
			#Verifica se houve algum erro no processamento do SQL
			#Retorna a mensagem correspondente.
			if (!$stmt) {
				#Numero do erro juntamente com uma mensagem explicativa.
				echo (mysql_error($conexao->conecta) . " :Não foi possível $msg este item devido a um erro.<br>
				Tente novamente mais tarde ou contate o administrador do sistema.");
				$conexao->fecharConexao();
			} else {
				echo ("Solicitação efetuada com sucesso<br />");
				$email = new Email();
				$email->envia($numero, $dados_["fk_funcionario"], $dados_["fk_setor"], $dados_["fk_problemasconhecido"], $dados_["descricao"], "http://192.168.3.129/sistemas/paginas/programas/page.php?name_page=helpdesks/helpdesks.php&id_page=568,571&id=" . $id, $dados_["email_solicitante"], $dados_["responsavel"]);
			}
		} else {
			echo ($msg);
		}
	}
	/*
		Funcao que exclui um helpdesk do BD
		Parametro ID do helpdesk
		Retorna uma mensagem indicando se o helpdesk foi inserido ou ocorreu um erro.
	*/
	public function excluir($id_)
	{
		$sql = "Delete from $this->tabela where $this->id = '$id_'";
		#conecta no BD
		$conexao = new ConBD;
		#Executa o sql
		$stmt = $conexao->processa($sql, 0);
		#Verifica se houve algum erro no processamento do SQL
		#Retorna a mensagem correspondente.
		if (!$stmt) {
			#Numero do erro juntamente com uma mensagem explicativa.
			echo (mysql_errno($conexao->conecta) . " : Não foi possível selecionar este item devido a um erro.<br>
			Tente novamente mais tarde ou contate o administrador do sistema.");
		} else {
			echo ("Helpdesk excluído com sucesso");
		}
	}
	public function modificar($id_, $dados_)
	{
		$msg = "";
		$erro = 0;
		if (empty($dados_["fk_hardware"])) {
			$erro++;
			echo ("Você precisa preencher o campo <strong>Codigo da Máquina</strong><br />");
		}
		if (empty($dados_["fk_funcionario"])) {
			$erro++;
			echo ("Você precisa preencher o campo <strong>Funcionário</strong><br />");
		}
		if (empty($dados_["fk_setor"])) {
			$erro++;
			echo ("Você precisa preencher o campo <strong>Departamento</strong><br />");
		}
		if (empty($dados_["descricao"])) {
			$erro++;
			echo ("Você precisa preencher o campo <strong>Descrição</strong><br />");
		}
		if (empty($erro)) {
			$indices = "";
			$values = "";
			$ligacao = "";
			foreach ($dados_ as $chave => $valor) {
				if (!empty($valor) && $chave != "$this->id") {
					$values .= $ligacao . "
";
					if (substr_count($chave, "data") > 0)
						$values .= $chave . " = '" . converteData(1, $valor) . "'";
					else
						$values .= $chave . " = '" . $valor . "'";

					$ligacao = ",";
				}
			}
			$sql = "UPDATE $this->tabela SET 
						$values
						WHERE $this->id = '" . $dados_["$this->id"] . "'"; // $sql - caso edi��o
			//echo($sql);
			$msg = " Modificado ";
			$conexao = new ConBD;
			$stmt = $conexao->processa($sql, 0);
			if (!$stmt) {
				echo ("Não foi possível $msg este item devido a um erro.<br>
				Tente novamente mais tarde ou contate o administrador do sistema.");
			} else {
				echo ("Item $msg com sucesso<br />");
			}
		} else {
			echo ($msg);
		}
	}
	public function Listar($id_)
	{
		$sql = "Select * from $this->tabela where $this->id = '$id_'";
		$conexao = new ConBD;
		$stmt = $conexao->processa($sql, 0);
		if (!$stmt) {
			echo (mysql_errno($conexao->conecta) . " : Não foi possivel selecionar este item devido a um erro.<br>
			Tente novamente mais tarde ou contate o administrador do sistema.");
		} else {
			$row = mysql_fetch_object($stmt);
			foreach ($row as $chave => $valor) {
				if (substr_count($chave, "data") > 0)
					$dados[$chave] = converteData(0, $valor);
				else
					$dados[$chave] = $valor;
			}
			return $dados;
		}
	}
	public function gerarSelect($id_helpdesk)
	{
		$sql = "Select * from vw_$this->tabela";
		$conexao = new ConBD;
		$stmt = $conexao->processa($sql, 0);
		if (!$stmt) {
			echo (mysql_errno($conexao->conecta) . " : Não foi possível selecionar este item devido a um erro.<br>
			Tente novamente mais tarde, ou contate o administrador do sistema.");
		} else {
			$select = '<select id="fk_helpdesk" name="fk_helpdesk" style="width:90%">
	<option value="" >Selecione</option>';
			while ($row = mysql_fetch_object($stmt)) {
				if ($id_helpdesk == $row->id_helpdesk)
					$selecionado  = 'selected="selected"';
				else
					$selecionado  = '';
				$select .= '<option value="' . $row->id_helpdesk . '" ' . $selecionado . '>' . $row->cc . " - " . $row->nome_helpdesk . '</option>';
			}
			return $select;
		}
	}
	public function indicadores($data_inicio_ = '', $data_fim_ = '')
	{
		if (empty($data_inicio_))
			$data_inicio_ = $ano . '-01-01';
		if (empty($data_fim_))
			$data_fim_ = $ano . '-12-31';

		$sql = "Select count(*) as total, status, data_abertura from vw_$this->tabela where data_abertura >= '$data_inicio_' and data_abertura <= '$data_fim_' group by status";
		$conexao = new ConBD;
		$stmt = $conexao->processa($sql, 0);
		if (!$stmt) {
			echo (mysql_errno($conexao->conecta) . " : Não foi possível selecionar este item devido a um erro.<br>
			Tente novamente mais tarde ou contate o administrador do sistema.");
		} else {
			$dados = '';
			$itens = '';
			$total = 0;
			$total_status = mysql_num_rows($stmt);
			while ($row = mysql_fetch_object($stmt)) {
				$dados[$row->status] = $row->total;
				$total += $row->total;
			}
			if ($total != 0) {
				foreach ($dados as $status => $value) {
					switch ($status) {
						case 'a':
							$status = 'Em Aberto';
							break;
						case 'c':
							$status = 'Concluído';
							break;
						case 's':
							$status = 'Sem Solução';
							break;
						default:
							$status = 'Indefinido';
							break;
					}
					$porcentagem = ($value / $total) *100;
					$itens .= '<strong>' . $status . '</strong>: ' . $value . ' (' . $porcentagem. '%)<br />';

					/* Alteração (11/07) */ 

					//round($porcentagem, 2) -> $porcentagem
					//Isso foi feito pois quando a porcentagem resultava em 100% ele exibia em notação (EX: 1.0E+2%)
					
					//Em caso de querer o resultado com mais casas decimais usar esta abordagem
					//$casas_decimais = 2;
					//$itens .= '<strong>' . $status . '</strong>: ' . $value . ' (' . number_format($porcentagem, $casas_decimais). '%)<br />';
					
					
				}
				$sql = "Select data_abertura, horario_abertura, horario_fechamento, data_fechamento from $this->tabela where data_abertura >= '$data_inicio_' and data_abertura <= '$data_fim_' order by data_abertura";
				$conexao = new ConBD;
				$stmt = $conexao->processa($sql, 0);
				if (!$stmt) {
					echo (mysql_errno($conexao->conecta) . " : Não foi possivel selecionar este item devido a um erro.<br>
					Tente novamente mais tarde ou contate o administrador do sistema.");
				} else {
					$i = 0;
					while ($row = mysql_fetch_object($stmt)) {
						$horai[$i] = $row->data_abertura . " " . $row->horario_abertura;
						$horaf[$i] = $row->data_fechamento . " " . $row->horario_fechamento;
						$horas = $horas + diferenca_horas($horai[$i], $horaf[$i]);
						$data[$i] = converteData(0, $row->data_abertura);
						$i++;
					}
					$horas = $horas / $i;
					$horas_mes = $horas / 12;
				}

				$total_dias = diferenca_dias(converteData(3, $data[0]), converteData(3, $data[$i - 1]));

				$itens = '<div><strong>De ' . $data[0] . ' at&eacute; ' . $data[$i - 1] . '</strong><br /><br />' . $itens;
				if ($total_dias > 31) {
					$itens .= '<strong>Média por Dia</strong>: ' . round($total / ($total_dias - (($total_dias / 30) * 4)), 2) . '<br />';
					$itens .= '<strong>Média por Mês</strong>: ' . round($total / (($total_dias - (($total_dias / 30) * 4)) / 30), 2) . '<br />';
					if ($horas_mes <= 40) {
						$itens .= '<strong>Média dos Atendimentos em Horas(Por Mês) </strong>: <font color="#008000">' . $horas_mes . ' Horas</font><br>';
					} elseif ($horas_mes >= 40 && $horas_mes <= 48) {
						$itens .= '<strong>Média dos Atendimentos em Horas(Por Mês) </strong>: <font color="#FF8C00">' . $horas_mes . ' Horas</font><br>';
					} else {
						$itens .= '<strong>Média dos Atendimentos em Horas(Por Mês) </strong>: <font color="#FF0000">' . $horas_mes . ' Horas</font><br>';
					}
				} else {
					$itens .= '<strong>Média por Dia</strong>: ' . round($total / ($total_dias - (($total_dias / 30) * 4)), 2) . '<br />';
					$itens .= '<strong>Média por Mês</strong>: ' . $total . '<br />';
					if ($horas <= 40) {
						$itens .= '<strong>Média dos Atendimentos em Horas </strong>: <font color="#008000">' . $horas . ' Horas</font><br>';
					} elseif ($horas >= 40 && $horas <= 48) {
						$itens .= '<strong>Média dos Atendimentos em Horas </strong>: <font color="#FF8C00">' . $horas . ' Horas</font><br>';
					} else {
						$itens .= '<strong>Média dos Atendimentos em Horas </strong>: <font color="#FF0000">' . $horas . ' Horas</font><br>';
					}
				}

				$itens .= '<strong>TOTAL</strong>: ' . $total . '</div>'; 

				/* Por Usuario */
				$itens .= '
	<div style="width:49%; float:left;">
	<table border="1" cellpadding="10px" cellspacing="0">
		<tr>
			<td colspan="2" align="center"><strong>Totais de Chamados por Funcionário</strong></td>
		</tr>';
				$sql2 = "Select count(*) as total_funcionario,nome_funcionario from vw_$this->tabela where data_abertura >= '$data_inicio_' and data_abertura <= '$data_fim_' group by id_funcionario order by total_funcionario desc";
				$conexao2 = new ConBD;
				$stmt2 = $conexao2->processa($sql2, 0);
				if (!$stmt2) {
					echo (mysql_errno($conexao2->conecta) . " : Não foi possível selecionar este item devido a um erro.<br>
					Tente novamente mais tarde ou contate o administrador do sistema.");
				} else {
					while ($row_1 = mysql_fetch_object($stmt2)) {
						$itens .= '
		<tr>
			<td>' . $row_1->nome_funcionario . '</td> <td style="color:navy;"><strong>' . $row_1->total_funcionario . '</strong></td>
		</tr>';
					}
				}
				$itens .= '
	</table>
	</div>';

				/* Por Setor */
				$itens .= '
	<div style="width:49%; float:right;">
	<table border="1" cellpadding="10px" cellspacing="0">
		<tr>
			<td colspan="2" align="center"><strong>Totais de Chamados por Setor</strong></td>
		</tr>';
				$sql2 = "Select count(*) as total_setor,cc,nome_setor from vw_$this->tabela where data_abertura >= '$data_inicio_' and data_abertura <= '$data_fim_' group by cc order by total_setor desc";
				$conexao2 = new ConBD;
				$stmt2 = $conexao2->processa($sql2, 0);
				if (!$stmt2) {
					echo (mysql_errno($conexao2->conecta) . " : Não foi possível selecionar este item devido a um erro.<br>
					Tente novamente mais tarde ou contate o administrador do sistema.");
				} else {
					while ($row_1 = mysql_fetch_object($stmt2)) {
						$itens .= '
		<tr>
			<td>' . $row_1->cc . '-' . $row_1->nome_setor . '</td> <td style="color:#161750;"><strong>' . $row_1->total_setor . '</strong></td>
		</tr>';
					}
				}
				$itens .= '
	</table>
	</div>';
			} else {
				$itens = '<font size="2"><center><br>Meta do Departamento de Tecnologia da Informação para o atendimento dos chamados:
						</br><br>
						- Realizar o atendimento do chamado em até 48 horas (havendo exceções para alguns chamados).</font>
						';
			}
			return $itens;
		}
	}
}
