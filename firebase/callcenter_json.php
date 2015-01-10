<?php
header('Content-disposition: attachment; filename=callcenter.json');
header('Content-type: application/json');

$json = array(
	"phone-operators" => array(
		"op1" => array(
			"status"			=> "closed",
			"id"				=> "op1",
			"status_changed"	=>	date("Y-m-d H:i:s"),
			"name"				=> "Jos"
		),
		"op2" => array(
			"status"			=> "closed",
			"id"				=> "op2",
			"status_changed"	=>	date("Y-m-d H:i:s"),
			"name"				=> "Anita"
		),
		"op3" => array(
			"status"			=> "closed",
			"id"				=> "op3",
			"status_changed"	=>	date("Y-m-d H:i:s"),
			"name"				=> "Jean"
		),
		"op4" => array(
			"status"			=> "closed",
			"id"				=> "op4",
			"status_changed"	=>	date("Y-m-d H:i:s"),
			"name"				=> "Maria"
		),
		"op5" => array(
			"status"			=> "closed",
			"id"				=> "op5",
			"status_changed"	=>	date("Y-m-d H:i:s"),
			"name"				=> "Mark"
		),
		"op6" => array(
			"status"			=> "closed",
			"id"				=> "op6",
			"status_changed"	=>	date("Y-m-d H:i:s"),
			"name"				=> "Franois"
		),
		"op7" => array(
			"status"			=> "closed",
			"id"				=> "op7",
			"status_changed"	=>	date("Y-m-d H:i:s"),
			"name"				=> "Myriam"
		),
		"op8" => array(
			"status"			=> "closed",
			"id"				=> "op8",
			"status_changed"	=>	date("Y-m-d H:i:s"),
			"name"				=> "Marie-Therese"
		),
		"op9" => array(
			"status"			=> "closed",
			"id"				=> "op9",
			"status_changed"	=>	date("Y-m-d H:i:s"),
			"name"				=> "Eva"
		),
		"op10" => array(
			"status"			=> "closed",
			"id"				=> "op10",
			"status_changed"	=>	date("Y-m-d H:i:s"),
			"name"				=> "Bert"
		)
	)
);

echo json_encode($json);