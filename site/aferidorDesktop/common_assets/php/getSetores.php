<?php
require_once("../../../includes/setores.class.php");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if($_SERVER['REQUEST_METHOD'] === 'GET') {

  $setores = new Setores();
  $items = $setores->array_aferidorDesktop();
  $results = array();

  foreach ($items as $key => $value) {
    $results[] = array('label' => $key, 'value' => $value);
      
  }

  header('Content-Type: application/json');
  echo json_encode($results);
}

?>


