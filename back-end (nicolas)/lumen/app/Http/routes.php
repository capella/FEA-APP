<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

$app->get('/', function() use ($app) {
    return $app->welcome();
});

//EventsController

$app->post('event', 'App\Http\Controllers\EventsController@createEvento');

$app->put('event/{id}', 'App\Http\Controllers\EventsController@updateEvento');

$app->delete('event/{id}', 'App\Http\Controllers\EventsController@removeEvento');

$app->get('event/{month}', 'App\Http\Controllers\EventsController@getEventos');

//News Controller

$app->post('news', 'App\Http\Controllers\NewsController@createNews');

$app->put('news/{id}', 'App\Http\Controllers\NewsController@updateNews');

$app->delete('news/{id}', 'App\Http\Controllers\NewsController@removeNews');

$app->get('news', 'App\Http\Controllers\NewsController@getNews');