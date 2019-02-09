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
            $parent = sizeof($parts) > 1 ? array_values(array_slice($parts, -2))[0] : 'root';

            $files[$i]['id'] = $this->generateUuid();
            $files[$i]['name'] = $name;
            $files[$i]['parent'] = $parent;
            $files[$i]['isFolder'] = strpos($file, '.') !== false ? false : true;
            
            $i++;
        }
        
        foreach ($files as &$file) {
            if ($file['parent'] !== 'root') {
                $file['parent'] = $this->addParentId($file['parent'], $files);
            }
        }
               
        return $files;        
    }
    
    private function addParentId($parent, $files)
    {
        foreach ($files as $file) {
            if ($file['name'] == $parent) {
                return $file['id'];
            }
        }        
    }
    
    private function generateUuid() 
    {
        return sprintf( '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ),
            mt_rand( 0, 0xffff ),
            mt_rand( 0, 0x0fff ) | 0x4000,
            mt_rand( 0, 0x3fff ) | 0x8000,
            mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff ), mt_rand( 0, 0xffff )
        );
    }
    
}
