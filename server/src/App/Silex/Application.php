<?php

namespace App\Silex;

use Aptoma\Silex\Application as BaseApplication;
use Symfony\Component\Debug\Debug;
use Silex\Application as SilexApplication;
use Silex\Provider\TwigServiceProvider;
use Silex\Provider\UrlGeneratorServiceProvider;
use GitList\Provider\GitServiceProvider;
use GitList\Provider\RepositoryUtilServiceProvider;
use GitList\Provider\ViewUtilServiceProvider;
use GitList\Provider\RoutingUtilServiceProvider;
use Symfony\Component\Filesystem\Filesystem;
use Silex\Provider\SecurityServiceProvider;
use Silex\Provider\DoctrineServiceProvider;
use SimpleUser\UserServiceProvider;
use SimpleUser\User;

use Silex\Provider\RememberMeServiceProvider;
use Silex\Provider\SessionServiceProvider;
use Silex\Provider\ServiceControllerServiceProvider;
use Silex\Provider\SwiftmailerServiceProvider;

class Application extends BaseApplication
{

    public function __construct(array $values = array())
    {
        if ($values['debug']) {
            Debug::enable();
        }
        parent::__construct($values);
        $app = $this;

        $this->registerLogger($this);
        $this->registerTwig($this);

        //TENTANDO....
        $this->register(new RememberMeServiceProvider());
        $this->register(new SessionServiceProvider());
        $this->register(new ServiceControllerServiceProvider());
        $this->register(new SwiftmailerServiceProvider());

        $this->register(new DoctrineServiceProvider());
        $this->register(new SecurityServiceProvider());
        $userServiceProvider = new UserServiceProvider();

        $this->register($userServiceProvider);

        $this['db.options'] = $values['db'];

		$this['user.options'] = array(
		    'mailer' => array(
		        'fromEmail' => array(
		            'address' => 'login@fea.capella.pro',
		            'name' => 'Aplicativo Fea',
		        ),
		    ),
            'templates' => array(
                'layout' => 'layout.twig',
                'login' => 'login.twig',
                'list' => 'list.twig',
                'forgot-password' => 'forgot-password.twig',
                'reset-password' => 'reset-password.twig',
                'register' => 'register.twig'
            ),
		);

        $this->mount('/user', $userServiceProvider);

        $this['security.firewalls'] = array(
            'login' => array(
                'pattern' => '^(/user/login|/user/forgot-password|/user/reset-password/.*|/app/.*)$'
            ),
            'secured_area' => array(
                'pattern' => '^.*$',
                'anonymous' => false,
                'form' => array(
                    'login_path' => '/user/login',
                    'check_path' => '/user/login_check'
                ),
                'logout' => array(
                    'logout_path' => '/user/logout',
                ),
                'users' => $this->share(function($this) { return $this['user.manager']; }),
            ),
        );
        $this['twig'] = $this->share($this->extend('twig', function ($twig, $app) {
            $twig->addFilter(new \Twig_SimpleFilter('htmlentities', 'htmlentities'));
            $twig->addFilter(new \Twig_SimpleFilter('md5', 'md5'));
            $twig->addFilter(new \Twig_SimpleFilter('format_date', array($app, 'formatDate')));
            $twig->addFilter(new \Twig_SimpleFilter('format_size', array($app, 'formatSize')));
            return $twig;
        }));

        /* MENSAGEM DE ERRO */
        $this->error(function (\Exception $e, $code) use ($app) {
            if ($app['debug']) {
                return;
            }
            return $app['twig']->render('error.twig', array(
                'message' => $e->getMessage(),
            ));
        });
        
    }
}
