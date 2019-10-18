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
use Symfony\Component\HttpFoundation\RequestStack;

/**
 * File controller.
 *
 * @RouteResource("File")
 */
class FileController extends FOSRestController implements ClassResourceInterface
{
    
    public function __construct(RequestStack $requestStack)
    {
        //$this->baseUrl = $requestStack->getCurrentRequest()->getSchemeAndHttpHost();
    }

    private function getBaseUrl()
    {
        return $this->baseUrl;
    }
    
    public function cgetAction()
    {
        $dir = $this->get('kernel')->getProjectDir().'/public/files/';
        $baseUrl = $this->getBaseUrl().'/files/';
        $finder = new Finder();
        $finder->in($dir);
        $files = [];        
               
        $i=0;
        foreach ($finder as $file) {
            $parts = explode('/', $file->getRelativePathname());
            $name = array_values(array_slice($parts, -1))[0];
            $parent = sizeof($parts) > 1 ? array_values(array_slice($parts, -2))[0] : 'root';
            $path = $file->getRelativePath() ? $baseUrl.$file->getRelativePath().'/' : $this->baseUrl;

            $files[$i]['id'] = $this->generateUuid();
            $files[$i]['name'] = $name;
            $files[$i]['parent'] = $parent;
            $files[$i]['isFolder'] = strpos($file, '.') !== false ? false : true;
            $files[$i]['path'] = $path;
            
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
     * Add file / directory.
     * 
     * @param Request $request
     * 
     * @return View
     */    
    public function postAction(Request $request)
    {
        $root = $this->get('kernel')->getProjectDir().'/public/files/';
        // File
        if ($request->files->count() > 0) {           
            $dir = $request->request->get('data');
            foreach ($request->files as $file) {
                $file->move($root.$dir, $file->getClientOriginalName());            
            }
        // Directory    
        } else {
            $fileSystem = new Filesystem();
            $file = $request->request->get('fileElement');
            $path = $root.$file['path'].$file['name'];

            if ($fileSystem->exists($path)) {
                return new View('file.already_exists', Response::HTTP_BAD_REQUEST);
            }

            $fileSystem->mkdir($path, 0777); // TODO set proper                                   
        }
        
        //return ?
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
        $moveTo = $data['body']['moveTo'];
        $newPath = $moveTo ? $moveTo['path'].$moveTo['name'].'/' : $file['path'];
        
        $fileSystem = new Filesystem();    
        $fileSystem->rename($file['path'].$oldName, $newPath.$file['name'], true);        
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
                
        $fileSystem->remove($file['path'].$file['name']);
        
        if ($fileSystem->exists($file['path'].$file['name'])) {
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
