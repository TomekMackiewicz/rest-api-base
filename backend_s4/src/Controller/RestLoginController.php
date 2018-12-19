<?php

namespace App\Controller;

use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Controller\Annotations\Route;
use FOS\RestBundle\Routing\ClassResourceInterface;

class RestLoginController extends FOSRestController implements ClassResourceInterface
{
    /** 
     * @Route("/login", methods={"POST"})
     */
    public function postAction()
    {
        // route handled by Lexik JWT Authentication Bundle
        throw new \DomainException('You should never see this');
    }
}

