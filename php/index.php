<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json; charset=utf-8');

require('./vendor/autoload.php');

$client = new Google_Client();
try {
    $client->setAuthConfig("./stable-device-335608-firebase-adminsdk-9istn-9e1551861f.json");
    $client->addScope(Google\Service\FirebaseCloudMessaging::CLOUD_PLATFORM);

    $savedTokenJson = readSavedToken();

    if ($savedTokenJson) {
        // the token exists, set it to the client and check if it's still valid
        $client->setAccessToken($savedTokenJson);
        $accessToken = $savedTokenJson;
        if ($client->isAccessTokenExpired()) {
            // the token is expired, generate a new token and set it to the client
            $accessToken = generateToken($client);
            $client->setAccessToken($accessToken);
        }
    } else {
        // the token doesn't exist, generate a new token and set it to the client
        $accessToken = generateToken($client);
        $client->setAccessToken($accessToken);
    }

    echo json_encode($accessToken["access_token"]);
} catch (Google_Exception $e) {
    return $e;
}

//Using a simple file to cache and read the toke, can store it in a databse also
function readSavedToken()
{
    $tk = @file_get_contents('token.cache');
    if ($tk) return json_decode($tk, true);
    else return false;
}
function writeToken($tk)
{
    file_put_contents("token.cache", $tk);
}

function generateToken($client)
{
    $client->fetchAccessTokenWithAssertion();
    $accessToken = $client->getAccessToken();

    $tokenJson = json_encode($accessToken);
    writeToken($tokenJson);

    return $accessToken;
}