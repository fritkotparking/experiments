<?php
include_once "FirebaseToken.php";

$secret = "J7Eq8smGSEnLbWrXYbFXxR2YAFA3hHd1JodsuMq4";
$tokenGen = new Services_FirebaseTokenGenerator($secret);
$token = $tokenGen->createToken(array("id" => "example"));

print_r($token);
  // Get data only readable by auth.id = "example".
 // $uri = "https://example.firebaseio.com/.json?auth=".$token;
  //var_dump(file_get_contents($uri));