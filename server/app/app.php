<?php
use Symfony\Component\HttpFoundation\Request;
use App\Controller\DefaultController;
use App\Controller\AppController;
use App\Silex\Application;

$startTime = microtime(true);
require_once __DIR__ . '/../vendor/autoload.php';

// This is the default config. See `deploy_config/README.md' for more info.

// Apply custom config if available
if (file_exists(__DIR__ . '/../config.php')) {
    include __DIR__ . '/../config.php';
} else {
    die('Crie o arquivo de config.php.');
}

// Initialize Application
$app = new Application($config);

/**
 * Register controllers as services
 * @link http://silex.sensiolabs.org/doc/providers/service_controller.html
 **/
$app['app.default_controller'] = $app->share(
    function () use ($app) {
        return new DefaultController(
            $app['twig'], 
            $app['logger'], 
            $app['user'],
            $app['user.manager'],
            $app['db']
        );
    }
);

$app['app.app_json'] = $app->share(
    function () use ($app) {
        return new AppController($app);
    }
);

// Map routes to controllers
include __DIR__ . '/routing.php';

return $app;
