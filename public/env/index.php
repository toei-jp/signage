<?php
$appConfigFromServer = [
    'STATUS_THRESHOLD_CROWDED' => $_SERVER['STATUS_THRESHOLD_CROWDED'],
    'CINERINO_SCHEDULE_FETCH_TIMEOUT' => $_SERVER['CINERINO_SCHEDULE_FETCH_TIMEOUT'],
    'authConfig' => [
        'region' => $_SERVER['COGNITO_REGION'],
        'userPoolId' => $_SERVER['COGNITO_USER_POOL_ID'],
        'userPoolWebClientId' => $_SERVER['COGNITO_USER_POOL_CLIENT_ID']
    ],
    'cognitoUser' => [
        'userId' => $_SERVER['COGNITO_USER_ID'],
        'password'=> $_SERVER['COGNITO_USER_PASSWORD'],
    ],
    'CINERINO_API_ENDPOINT' => $_SERVER['CINERINO_API_ENDPOINT'],
];

header('Content-Type: application/json; charset=UTF-8');
echo json_encode($appConfigFromServer);
?>
