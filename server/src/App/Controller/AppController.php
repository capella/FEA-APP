<?php

namespace App\Controller;

use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * AppController parte do app 
 *
 * Eh nessa parte em que os json sao produzidos. 
 *
 */
class AppController
{
    /**
     * @var App\Silex\Aplication
     */
    private $app;

    public function __construct($app)
    {
        $this->app = $app;        
        $this->app->error(function (\Exception $e, $code) use ($app) {
            return $app->json(array(
                'message' => $e->getMessage(),
            ));
        });
    }

    public function newappuserAction(Request $request){
        $sql = "INSERT INTO users_app (`uuid`, `sendcode`, `system`, `lastdata`) 
                VALUES (? ,? ,? ,CURRENT_TIMESTAMP)
                ON DUPLICATE KEY UPDATE `sendcode`= ?, `lastdata` = CURRENT_TIMESTAMP;";
        $data = array(
            $request->request->get('uuid'),
            $request->request->get('sendcode'),
            $request->request->get('system'),
            $request->request->get('sendcode')
        );
        $post = $this->app['db']->executeUpdate($sql, $data);
        return $this->app->json($post);
    }

    public function noticiasAction($start, $end){
        $noticias = $this->app['db']->fetchAll('SELECT id, titulo, text, imgurl, time FROM noticias ORDER BY time DESC LIMIT '.$start.','.$end);
        return $this->app->json($noticias);
    }

    public function eventosAction($mes, $ano){
        $noticias = $this->app['db']->fetchAll('
            SELECT *
            FROM eventos 
            WHERE MONTH(data) = '.$mes.' AND YEAR(data) = '.$ano);
        return $this->app->json($noticias);
    }

    public function bandejao()
    {
        //preciso arrumar umas coisas
        $array = array(
            //"FÍSICA" => "http://www.usp.br/coseas/cardapiofisica.html",
            //"QUÍMICA" => "http://www.usp.br/coseas/cardapioquimica.html",
            "CENTRAL" => "http://www.usp.br/coseas/cardapio.html",
        );

        $data_final = array();

        foreach ($array as $nome => $url) {

            $html = \simplehtmldom\file_get_html($url);
            $data = array();
            $dia = "";

            foreach($html->find('td') as $element){
                $count = 0;
                $jantar = 1;
                $listaalimentos = $element->find('pre');
                foreach($listaalimentos as $pre) {

                    $texto = $this->limpa($pre->plaintext);
                    if($texto != "" && $texto != " "){
                        if($count == 0 && $dia != $texto) {
                            $dia = $texto;
                            $jantar = 0;
                        } else if($dia != $texto) {
                            if($jantar){
                                if(strpos($texto, 'kcal'))
                                    $data[$dia]['dinner']['kcal'] = preg_replace('/\D+/', '', $texto);
                                else
                                    $data[$dia]['dinner']['comidas'][] = $texto;
                            } else {
                                if(strpos($texto, 'kcal'))
                                    $data[$dia]['lunch']['kcal'] = preg_replace('/\D+/', '', $texto);
                                else
                                    $data[$dia]['lunch']['comidas'][] = $texto;
                            }
                        }
                        //if($texto)
                        //$a .=mb_detect_encoding($texto) . '<br>';
                    }
                    $count++;
                }
            }

            $data_final[$nome] = $data;
        }



        return $this->app->json($data_final);
        //return $a;
    }

    private function limpa($txt){
        $txt = utf8_encode($txt);
        $txt = str_replace("&nbsp;", '', $txt);
        //$txt = ucwords(strtolower($txt));
        /*$txt = html_entity_decode($txt, ENT_QUOTES, "UTF-8");
        $txt = str_replace(" De ", ' de ', $txt);
        $txt = str_replace(" Da ", ' da ', $txt);
        $txt = str_replace(" Do ", ' do ', $txt);
        $txt = str_replace(" E ", ' e ', $txt);
        $txt = str_replace(" Ao ", ' ao ', $txt);
        $txt = str_replace(" A ", ' a ', $txt);
        $txt = str_replace(" As ", ' as ', $txt);*/
        return $txt;
    } 
}
