<?php

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

?>