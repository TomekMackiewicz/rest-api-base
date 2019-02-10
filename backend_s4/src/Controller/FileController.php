<?php

namespace App\Controller;

use FOS\RestBundle\Controller\Annotations\RouteResource;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Routing\ClassResourceInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Finder\Finder;
use Symfony\Component\Filesystem\Filesystem;
use FOS\RestBundle\View\View;

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
            $files[$i]['path'] = $path.$file->getRelativePath();
            
            $i++;
        }
        
        foreach ($files as &$file) {
            if ($file['parent'] !== 'root') {
                $file['parent'] = $this->addParentId($file['parent'], $files);
            }
        }
               
        return $files;        
    }

    /**
     * Add file / folder.
     * 
     * @param Request $request
     * 
     * @return View
     */    
    public function postAction(Request $request)
    {
        $fileSystem = new Filesystem();
        $root = $this->get('kernel')->getProjectDir().'/public/files/';
        $file = $request->request->get('fileElement');
        $path = $root.$file['path'].$file['name'];

        if ($fileSystem->exists($path)) {
            return new View('file.already_exists', Response::HTTP_BAD_REQUEST);
        }        
        
        if ($file['isFolder'] === true) {
            $fileSystem->mkdir($path, 0777); // TODO set proper                        
        } else {
            $fileSystem->touch($path);         
        }

    }

    /**
     * Rename file / folder.
     * 
     * @param Request $request
     * 
     * @return View
     */
    public function patchAction(Request $request)
    { 
        $data = json_decode($request->getContent(), true);
        $file = $data['body']['file'];
        $oldName = $data['body']['oldName'];
        
        $fileSystem = new Filesystem();    
        $fileSystem->rename($file['path'].$oldName, $file['path'].$file['name'], true);        
    }    
    
    /**
     * Delete file / folder.
     * 
     * @param Request $request
     * 
     * @return View
     */
    public function deleteAction(Request $request)
    {        
        $fileSystem = new Filesystem();
        $file = json_decode($request->getContent(), true);
                 
        $fileSystem->remove($file['path']);
        
        if ($fileSystem->exists($file['path'])) {
            return new View('file.delete_error', Response::HTTP_BAD_REQUEST);
        }
        
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
