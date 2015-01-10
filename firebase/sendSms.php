<?php
// Download/Install the PHP helper library from twilio.com/docs/libraries.
// This line loads the library

if(isset($_POST['number'])):
	
	$dir = dirname(__FILE__) . "/../libraries/twilio/Services/Twilio.php";
	require($dir);
	
	// Your Account Sid and Auth Token from twilio.com/user/account
	$sid = "AC6e3a23dcf90d43228a8e32c2e2f7d6ef"; 
	$token = "bea5c472422918109bffee182f62605a";
	$client = new Services_Twilio($sid, $token);
	
	$shorturl = shortenURL("http://experiments.spud.be/firebase/mobile.html?code=" . $_POST['code']);
	$sms = "Surf naar deze url: " . $shorturl;
	$success = 1;
	
	$number = ($_POST['number'] == "") ? "+32497546018" : $_POST['number'];
	 
	try{
		$message = $client->account->sms_messages->create("+14843834771", $number, $sms, array());
		$data = $message->sid;
	}catch(Exception $e){
		$success = 0;
		$data = "error";
	}
	
	echo json_encode(array("result" => $success, "data" => $data, "url" => $shorturl));

endif;

function shortenURL($urltoshorten) {
	$username = "fritkotparking";
	$api = "R_935e6c9591ff3854e63f958773041150";
	$format = "txt";
	$apiurl = "http://api.bitly.com";
	// check here if the URL is valid or not
	$bitlyconnector = $apiurl.'/v3/shorten?login='.$username.'&apiKey='.$api.'&uri='.urlencode($urltoshorten).'&format='.$format;
	return http($bitlyconnector);
}

/*CURL is a library you should prefer in all cases when considering
  cross domain calls
*/
function http($bitlyconnector) {
	$ch = curl_init();
	$timeout = 10;
	curl_setopt($ch,CURLOPT_URL,$bitlyconnector);
	curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
	curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,$timeout);
	$response = curl_exec($ch);
	curl_close($ch);
	return $response;
}
