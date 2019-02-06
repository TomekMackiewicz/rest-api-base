<?php

namespace App\Controller;

use FOS\RestBundle\Controller\Annotations\RouteResource;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Routing\ClassResourceInterface;
use Symfony\Component\Finder\Finder;
 
/**
 * File controller.
 *
 * @RouteResource("File")
 */
class FileController extends FOSRestController implements ClassResourceInterface
{   
    public function cgetAction()
    {
        $path = $this->get('kernel')->getProjectDir() . '/public/files/';
        $finder = new Finder();
        $finder->in($path);
        $files = [];        
        
        $i=0;
        foreach ($finder as $file) {
            $parts = explode('/', $file->getRelativePathname());
            $name = array_values(array_slice($parts, -1))[0];
            if (sizeof($parts) > 1) {
                $parent = array_values(array_slice($parts, -2))[0];
            } else {
                $parent = '';
            }

            $files[$i]['name'] = $name;
            $files[$i]['parent'] = $parent;
            
            $i++;
        }
        
        return $files;        
    }    
}
