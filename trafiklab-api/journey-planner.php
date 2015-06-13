<?php
header("Content-Type: application/json");

$format = "json";
$apikey = "d140bb539f004795b1add230f5f85e48";

$url = "api.sl.se/api2/TravelplannerV2/trip.$format?key=$apikey";

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
