<?php
require_once("usuarios.class.php");
require_once("funcionarios.class.php");
//require_once("problemasconhecidos.class.php");
require_once("setores.class.php");

// function problemaConhecido($id){
// 	$problemaconhecido = new Problemasconhecidos();
// 	$dados = $problemaconhecido->listar($id);
// 	return $dados["nome_problemasconhecido"];
// }

function nomeFuncionario($id){
	$funcionario = new Funcionarios();
	$dados = $funcionario->listar($id);
	return $dados["nome_funcionario"];
}
function nomeSetor($id){
	$setores = new Setores();
	$dados = $setores->listar($id);
	return $dados["cc"]." - ".$dados["nome_setor"];
}
function filtro(){
	if($_POST['remover'] != 1){
		if($_POST['campo'] != ""){
			$campo = $_POST['campo'];
			$where = $_POST['where'];
			$tipo_busca = $_POST['tipo_busca'];
			$numporpagina = $_POST['numporpagina'];
			$fk_setor = $_POST['fk_setor'];
			if($tipo_busca == "q")
				$busca = " where $campo like'%$where%'";
			else
				$busca = " where $campo = '$where'";
			$jsAux = "document.getElementById('numporpagina').value = '".$numporpagina."'; ";
			$jsAux = "document.getElementById('campo').value = '".$campo."'; ";
			$jsAux .= "document.getElementById('tipo_busca').value = '".$tipo_busca."'; ";
			$jsAux .= "document.getElementById('where').value = '".$where."'; ";
			$filtro = "&campo=$campo&where=$where&tipo_busca=$tipo_busca&numporpagina=$numporpagina";
			if(!empty($fk_setor)){
				$filtro .= "&fk_setor=$fk_setor";
				$busca .= " and fk_setor = $fk_setor";
			}
		}elseif(isset($_POST['numporpagina']) or isset($_POST['fk_setor'])){
			$numporpagina = $_POST['numporpagina'];
			$fk_setor = $_POST['fk_setor'];
			if(empty($numporpagina))
				$numporpagina = 10;
			
			
			$jsAux = "document.getElementById('numporpagina').value = '".$numporpagina."'; ";
			$filtro = "&numporpagina=$numporpagina";
			if(!empty($fk_setor)){
				$filtro .= "&fk_setor=$fk_setor";
				$busca .= " where fk_setor = $fk_setor";
			}
		}elseif(isset($_POST['campo'])){
			$jsAux = "document.getElementById('span_erromsg').innerHTML = 'Selecione um campo para a busca.'; ";
		}elseif(isset($_GET['campo'])){
			$campo = $_GET['campo'];
			$where = $_GET['where'];
			$tipo_busca = $_GET['tipo_busca'];
			$numporpagina = $_GET['numporpagina'];
			$fk_setor = $_GET['fk_setor'];
			if($tipo_busca == "q")
				$busca = " where $campo like'%$where%'";
			else
				$busca = " where $campo = '$where'";
			$jsAux = "document.getElementById('numporpagina').value = '".$numporpagina."'; ";
			$jsAux = "document.getElementById('campo').value = '".$campo."'; ";
			$jsAux .= "document.getElementById('tipo_busca').value = '".$tipo_busca."'; ";
			$jsAux .= "document.getElementById('where').value = '".$where."'; ";
			$filtro = "&campo=$campo&where=$where&tipo_busca=$tipo_busca&numporpagina=$numporpagina";
			if(!empty($fk_setor)){
				$filtro .= "&fk_setor=$fk_setor";
				$busca .= " and fk_setor = $fk_setor";
			}
		}elseif(isset($_GET['numporpagina']) or isset($_GET['fk_setor'])){
			$numporpagina = $_GET['numporpagina'];
			$fk_setor = $_GET['fk_setor'];
			if(empty($numporpagina))
				$numporpagina = 10;
			
			
			$jsAux = "document.getElementById('numporpagina').value = '".$numporpagina."'; ";
			$filtro = "&numporpagina=$numporpagina";
			if(!empty($fk_setor)){
				$filtro .= "&fk_setor=$fk_setor";
				$busca .= " where fk_setor = $fk_setor";
			}
		}else{
			$busca = "";
			$filtro = "";
		}
	}else{
		$busca = "";
		$filtro = "";
	}
	$retorno = array(
		"campo" => $campo,
		"where" => $where,
		"tipo_busca" => $tipo_busca,
		"busca" => $busca,
		"filtro" => $filtro,
		"numporpagina" => $numporpagina,
		"fk_setor" => $fk_setor,
		"jsAux" => $jsAux
	);
	return $retorno;
}
function busca($campos,$campoDepartamento = 0){
	$campos = explode(";",$campos);
	
	$dados = array();
	$select = '<select name="campo" id="campo">';
	foreach($campos as $valor){
		list($nome,$value) = explode(",",$valor);
		$select .= '<option value="'.$value.'">'.$nome.'</option>';
	}
	$select .= '</select>';
	?>
<table class="tabela">
	<tr>
    	<form action="<?php echo $_SERVER['SCRIPT_NAME'].'?'.$_SERVER['QUERY_STRING'] ?>" method="POST">
		
        <!--
			<td>
				<strong>Resultados por página</strong></td><td><input type="text" name="numporpagina" id="numporpagina" value="<?php echo $_GET['numporpagina']?>" />    
			</td>
		-->

        <?php if($campoDepartamento > 0){?>
        <td>
        	<strong>Departamento</strong></td>
        <td>
        	<?php $setores = new Setores();
				$fk_set = $_POST['fk_setor'];
				if(empty($fk_set))
					$fk_set = $_GET['fk_setor'];
				echo($setores->gerarSelect($fk_set));
			 ?>
        </td>
        <?php } ?>
    </tr>
    <tr>
    	<td><strong>Pesquisar</strong></td><td><input type="text" name="where" id="where" value="" /></td>
        <td>
        	<?php echo $select ?>            
        </td>
        <td>
        	<select name="tipo_busca" id="tipo_busca">
            	<option value="q">Qualquer parte do campo</option>
        		<option value="e">Palavra exata</option>
            </select>
        </td>
        <td><input type="submit" value="Pesquisar" class="botao" /></td>
        </form>
        <form action="<?php echo $_SERVER['SCRIPT_NAME'].'?'.$_SERVER['QUERY_STRING'] ?>" method="POST">
        <td><input type="hidden" name="remover" value="1" /><input type="submit" value="Remover filtros" class="botao" /></td>
        </form>
        </tr>
    </tr>
</table>
	<?php }
function status($status){
	switch($status){
		case"a": return "Em aberto";
		break;
		case"c": return "Concluido";
		break;	
		case"s": return "Sem solucao";
		break;
		default: return "Em aberto";
		break;
	}
}
function carrega_img(){
	$total_img = 0;
	// pega o endereço do diretório
	//$diretorio = getcwd();
	$diretorio = './images/banner_randon';
	//die($diretorio); 
	// abre o diretório
	$ponteiro  = opendir($diretorio);
	// monta os vetores com os itens encontrados na pasta
	while ($nome_itens = readdir($ponteiro)) {
		if ($nome_itens!="." && $nome_itens!=".." && $nome_itens !="Thumbs.db"){ 
			$itens[$total_img] = $nome_itens;
			$total_img++;
		}
	}
	//for ($i=0;$i < $total_img;$i++){
	//		echo("$i : ".$itens[$i] ."<br />");
	//}
	$img = "";
	$img = 'images/banner_randon/' . $itens[mt_rand(0,$total_img-1)];
	return($img);
}
function converteData($tipo,$data){
	if(empty($data)){
		$data = "";
	}elseif($tipo == 1){//Usuario para BD
		list($dia,$mes,$ano) = explode("/",$data);
		$data = $ano."-".$mes."-".$dia;
	}elseif($tipo == 2){//Bd para Comparacao de datas.
		list($ano,$mes,$dia) = explode("-",$data);
		$data = $mes."/".$dia."/".$ano;
	}elseif($tipo == 3){//Usuario para Comparacao de datas.
		list($dia,$mes,$ano) = explode("/",$data);
		$data = $mes."/".$dia."/".$ano;
	}else{//BD para Usuario
		list($ano,$mes,$dia) = explode("-",$data);
		$data = $dia."/".$mes."/".$ano;
	}
	return($data);
}
function diferenca_dias($inicial,$final){
  $inicial = strtotime($inicial); // 07/04/2003 (mm/dd/aaaa) data menor
  $final = strtotime($final);    // 07/10/2003 (mm/dd/aaaa) data maior
  return ($final-$inicial)/86400; //transformação do timestamp em dias
}
function diferenca_horas($inicial,$final){
  $inicial = strtotime($inicial); // 07/04/2003 (mm/dd/aaaa) data menor
  $final = strtotime($final);    // 07/10/2003 (mm/dd/aaaa) data maior
  return ($final-$inicial)/3600; //transformação do timestamp em dias
}

?>