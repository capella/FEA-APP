<?php

namespace App\Controller;

use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use InvalidArgumentException;

/**
 * DefaultController is here to help you get started.
 *
 * You would probably put most of your actions in other more domain specific
 * controller classes.
 *
 * Controllers are completely separated from Silex, any dependencies should be
 * injected through the constructor. When used with a smart controller resolver,
 * the Request object can be automatically added as an argument if you use type
 * hinting.
 *
 * @author Gunnar Lium <gunnar@aptoma.com>
 */
class DefaultController {

    /**
     * @var \Twig_Environment
     */
    private $twig;

    /**
     * @var LoggerInterface
     */
    private $logger;

    /**
     * @var User
     */
    private $user;

    /**
     * @var db
     */
    private $db;

    /** @var UserManager */
    protected $userManager;

    public function __construct(\Twig_Environment $twig, LoggerInterface $logger, \SimpleUser\User $user, \SimpleUser\UserManager $userManager, $db) {
        $this->twig = $twig;
        $this->logger = $logger;
        $this->user = $user;
        $this->userManager = $userManager;
        $this->db = $db;
    }

    /**
     * Mostra a tela inicial
     *
     * @return Response
     */
    public function indexAction() {
        $this->logger->debug('Executing DefaultController::indexAction');
        return $this->twig->render('index.twig');
    }

    /**
     * Mostra as noticias cadastradas
     *
     * @return Response
     */
    public function mostranoticiasAction() {
        $articles = $this->db->fetchAll('select * from noticias');
        $this->logger->debug('Executing DefaultController::indexAction');
        return $this->twig->render('noticias.twig', array(
            'noticias' => $articles
        ));
    }

    /**
     * Mostra os dispositivos cadastrados
     *
     * @return Response
     */
    public function mostrausersAction() {
        $usuarios_app = $this->db->fetchAll('select * from users_app');
        $this->logger->debug('Executing DefaultController::indexAction');
        return $this->twig->render('usuarios.twig', array(
            'users' => $usuarios_app
        ));
    }

    /**
     * Mostra e cria evento.
     *
     * @param Request $request
     * @return Response
     */
    public function mostraeventosAction(Request $request) {
        if ($request->isMethod('POST')) {
            if($request->get('title')){
                $last = $this->db->insert('eventos', array(
                    'title' => $request->get('title'),
                    'lat' => $request->get('lat'),
                    'lon' => $request->get('lon'),
                    'text' => $request->get('text'),
                    'data' => $request->get('data'),
                    'endereco' => $request->get('endereco'),
                    'userid' => $this->user->getId()
                ));
            }
        }

        $eventos = $this->db->fetchAll('select endereco, id, text, title, data as start from eventos');
        $this->logger->debug('Executing DefaultController::indexAction');
        return $this->twig->render('eventos.twig', array(
            'eventos' => $eventos,
            'data' => json_encode($eventos)
        ));
    }

    /**
     * Mostra e edita noticia
     *
     * Dependendo do tipo de requisucao, toma um procedimento.
     *
     * @param $id
     * @param Request $request
     * @return Response
     */
    public function noticiaeditAction($id, Request $request) {
        $error = null;
        $ok = null;
        $allowed = array("image/jpeg", "image/gif", "image/png");
        if ($request->isMethod('POST')) {
            try {
                $path = __DIR__.'/../../../web/images/';
                $file = $request->files->get('upload');
                if($file){
                    if(!in_array($file->getClientMimeType(), $allowed)) {
                        $error = "Tipo de arquivo não aceito! (".$file->getClientMimeType().")";
                    } else {
                        $filename = time().'_'.$file->getClientOriginalName();
                        $file->move($path,$filename);
                        $this->db->update('noticias', array('imgurl' => 'http://fea.capella.pro/images/'.$filename), array('id' => $id));
                    }
                }
                $this->db->update('noticias', array('text' => $request->request->get('text')), array('id' => $id));
            } catch (InvalidArgumentException $e) {
                $error = $e->getMessage();
            }
        }

        $sql = "SELECT * FROM noticias WHERE id = ?";
        $noticia = $this->db->fetchAssoc($sql, array((int) $id));

        return $this->twig->render('noticias_edit.twig', array(
            'noticia' => $noticia,
            'error' => $error,
            'ok' => $ok
        ));
    }

    /**
     * Cria uma nova noticia
     *
     * @param Request $request
     * @return Response
     */
    public function noticiasnewAction(Request $request) {
        $titulo = $request->get('titulo');
        $last;
        if($request->get('titulo')){
            $last = $this->db->insert('noticias', array(
                'titulo' => $titulo,
                'userid' => $this->user->getId()
            ));
        }
        return $this->noticiaeditAction($this->db->lastInsertId(), new Request());  
    }

    /**
     * Deletar noticia
     *
     * @param $id
     * @return Response
     */
    public function noticiadeleteAction($id) {
        $this->db->delete('noticias', array('id' => $id));
        return $this->mostranoticiasAction();
    }

    /**
     * Deletar evento
     *
     * @param $id
     * @return Response
     */
    public function eventodeleteAction($id) {
        $this->db->delete('eventos', array('id' => $id));
        return $this->mostraeventosAction(new Request());
    }

    /**
     * Register action.
     *
     * @param Application $app
     * @param Request $request
     * @return Response
     */
    public function newUser(Request $request) {
    	$error = null;
    	$ok = null;
        if ($request->isMethod('POST')) {
            try {
                $user2 = $this->createUserFromRequest($request);
                if ($error = $this->userManager->validatePasswordStrength($user2, $request->request->get('password'))) {
                    throw new InvalidArgumentException($error);
                } else {
                    $this->userManager->insert($user2);
                    // Log the user in to the new account.
		            $ok = "Usuário criado com sucesso";
                }
            } catch (InvalidArgumentException $e) {
                $error = $e->getMessage();
            }
        }
    	return $this->twig->render('register.twig', array(
    		'error' => $error,
    		'ok' => $ok
    	));
    }

    /**
     * @param Request $request
     * @return User
     * @throws InvalidArgumentException
     */
    protected function createUserFromRequest(Request $request) {
        if ($request->request->get('password') != $request->request->get('confirm_password')) {
            throw new InvalidArgumentException('Passwords don\'t match.');
        }
        $user = $this->userManager->createUser(
            $request->request->get('email'),
            $request->request->get('password'),
            $request->request->get('name') ?: null);
        if ($username = $request->request->get('username')) {
            $user->setUsername($username);
        }
        $errors = $this->userManager->validate($user);
        if (!empty($errors)) {
            throw new InvalidArgumentException(implode("\n", $errors));
        }
        return $user;
    }

}
