<?php
require_once("classes/funcionarios.class.php");
$funcionarios = new Funcionarios();
$q = strtolower($_GET["q"]);

if (!$q) return;

$items = $funcionarios->array_();

$results = array();

foreach ($items as $key=>$value) {
	if (strpos(strtolower($key), $q) !== false) {
		$results[] = array('label' => $key, 'value' => $value);
	}
}

header('Content-Type: application/json');
echo json_encode($results);

?>