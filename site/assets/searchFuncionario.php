<?php
require_once("../../includes/funcionarios.class.php");
$funcionarios = new Funcionarios();
$q = strtolower($_GET["q"]);
if (!$q) return;
$items = $funcionarios->array_();
$results = array();

foreach ($items as $key=>$value) {
	if (strpos(strtolower($key), $q) !== false) {
		//echo "$key|$value\n";
		$results[] = array('label' => $key, 'value' => $value);

	}
}

header('Content-Type: application/json');
echo json_encode($results);

?>