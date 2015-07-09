<?php

/**
 * This file should be included from app.php, and is where you hook
 * up routes to controllers.
 *
 * @link http://silex.sensiolabs.org/doc/usage.html#routing
 * @link http://silex.sensiolabs.org/doc/providers/service_controller.html
 */

// WEB
$app->get('/', 'app.default_controller:indexAction')->bind('home');

$app->get('/noticias', 'app.default_controller:mostranoticiasAction')->bind('noticias');
$app->post('/noticias', 'app.default_controller:noticiasnewAction');
$app->get('/noticia/{id}', 'app.default_controller:noticiaeditAction')->bind('noticias.edit');
$app->post('/noticia/{id}', 'app.default_controller:noticiaeditAction');
$app->get('/noticia_del/{id}', 'app.default_controller:noticiadeleteAction')->bind('noticias.delete');

$app->get('/eventos', 'app.default_controller:mostraeventosAction')->bind('eventos');
$app->post('/eventos', 'app.default_controller:mostraeventosAction');
$app->get('/evento_del/{id}', 'app.default_controller:eventodeleteAction')->bind('eventos.delete');


$app->get('/users', 'app.default_controller:mostrausersAction')->bind('users');
$app->get('/user/new', 'app.default_controller:newUser')->bind('user.new');
$app->post('/user/new', 'app.default_controller:newUser');


// APLICATIVO
$app->get('/app/bandejao.json', 'app.app_json:bandejao');
$app->get('/app/{start}/{end}/noticias.json', 'app.app_json:noticiasAction');
$app->post('/app/user.json', 'app.app_json:newappuserAction');
$app->get('/app/{mes}/{ano}/eventos.json', 'app.app_json:eventosAction');