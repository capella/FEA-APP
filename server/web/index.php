<?php

error_reporting(E_ALL);
ini_set( 'default_charset', 'UTF-8' );
header('Content-Type: text/html; charset=UTF-8');

$app = require __DIR__ . '/../app/app.php';

if ($app instanceof Silex\Application) {
    $app->run();
} else {
    echo 'Failed to initialize application.';
}
