<?php

$config = array(
    'debug' => true,
    'cache' => false,
    'timer.start' => $startTime,
    'monolog.name' => 'silex-bootstrap',
    'monolog.level' => \Monolog\Logger::DEBUG,
    'monolog.logfile' => __DIR__ . '/app/log/app.log',
    'twig.path' => __DIR__ . '/src/App/views',
    'twig.options' => array(
        'cache' => __DIR__ . '/app/cache/twig',
    ),
    'db' => array(
	    'driver'   => 'pdo_mysql',
	    'host'     => 'localhost',
	    'dbname'   => 'FEA_APP',
	    'user'     => 'fea',
	    'password' => 'WqnB5tvT7H8hZXhn',
	    'charset'   => 'utf8'
    )
);
