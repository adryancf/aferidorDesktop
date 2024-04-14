<?php
require_once("../includes/funcionarios.class.php");
$funcionarios = new Funcionarios();
$q = strtolower($_GET["q"]);

if (!$q) return;

$items = $funcionarios->array_();
//print_r ($items);

$results = array();

foreach ($items as $key=>$value) {
	if (strpos(strtolower($key), $q) !== false) {
		$results[] = array('label' => $key, 'value' => $value);
	}
  //echo $value.id_funcionario;
}

header('Content-Type: application/json');
echo json_encode($results);

?>