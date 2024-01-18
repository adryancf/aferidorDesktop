<?php
require_once("../../../includes/setores.class.php");

$setores = new Setores();
//$q = strtolower($_GET["q"]);
//if (!$q) return;
$items = $setores->array_();
$results = array();

foreach ($items as $key => $value) {
    $results[] = array('label' => $key, 'value' => $value);
}

header('Content-Type: application/json');
echo json_encode($results);

?>


