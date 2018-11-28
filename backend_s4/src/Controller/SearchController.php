<?php

// https://github.com/FriendsOfSymfony/FOSElasticaBundle/blob/master/doc/usage.md

namespace App\Controller;

use FOS\RestBundle\Controller\Annotations\RouteResource;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Routing\ClassResourceInterface;
 
/**
 * Search controller.
 *
 * @RouteResource("api/search", pluralize=false)
 */
class SearchController extends FOSRestController implements ClassResourceInterface
{
    /**
     * Get searched posts
     * 
     * @param string $text
     * @return JSON
     */
    public function getAction($text)
    {       
        $finder = $this->container->get('fos_elastica.finder.app.post');
        $results = $finder->find($text); 
        
        return $results;
    } 

}