<?php
header("Content-Type: application/json");

$format = "json";
$apikey = "7ccd885affcc48cd8dcb1bd601e71031";

$url = "http://api.sl.se/api2/typeahead.$format?key=$apikey";

foreach ($_GET as $key => $value) {
	$url .= "&$key=" . urlencode($value);
}

$curl = curl_init();

curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($curl, CURLOPT_URL, $url);

$result = curl_exec($curl);
curl_close($curl);

echo $result;
?>
