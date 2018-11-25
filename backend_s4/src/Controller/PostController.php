<?php

namespace App\Controller;

use App\Entity\Post;
use App\Service\ErrorHandler;
use FOS\RestBundle\Controller\Annotations\RouteResource;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Routing\ClassResourceInterface;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
 
/**
 * Post controller.
 *
 * @RouteResource("api/admin/post")
 */
class PostController extends FOSRestController implements ClassResourceInterface
{
    
    public function __construct(ErrorHandler $errorHandler)
    {
        $this->errorHandler = $errorHandler;
    }
    
    /**
     * Find and display post entity.
     *
     * @param int $id
     * 
     * @return mixed
     */
    public function getAction(int $id)
    {
        $post = $this->getPostRepository()->findOneById($id)->getSingleResult(); 
        if (post === null) {
            return new View(null, Response::HTTP_NOT_FOUND);
        }  
        
        return $post;
    }    
    
    /**
     * List all post entities.
     * 
     * @return Post
     */
    public function cgetAction()
    {
        $posts = $this->getPostRepository()->findAll()->getResult();
        if ($posts === null) {
            return new View(null, Response::HTTP_NOT_FOUND);
        }
        
        return $posts;
    }
    
    /**
     * Add post entity.
     * 
     * @param Request $request
     * 
     * @return View
     */
    public function postAction(Request $request)
    {
        $form = $this->createForm('App\Form\PostType', null, [
            'csrf_protection' => false,
        ]);
        $form->submit($request->request->all());
    
        if (!$form->isValid()) {
            $errors = $this->errorHandler->handleFormErrors($form);
            return new View($errors, Response::HTTP_BAD_REQUEST);
        }
        
        $post = $form->getData();
        $post->setCreated(new \DateTime());
        $em = $this->getDoctrine()->getManager();
        $em->persist($post);
        $em->flush();
        
        return new View('crud.create_success', Response::HTTP_CREATED);
    }
    
    /**
     * Replace post entity.
     * 
     * @param Request $request
     * @param int $id
     * 
     * @return View
     */
    public function putAction(Request $request, int $id)
    {
        $post = $this->getPostRepository()->find($id);
        $post->setUpdated(new \DateTime());

        if ($post === null) {
            return new View(null, Response::HTTP_NOT_FOUND);
        }

        $form = $this->createForm('App\Form\PostType', $post, [
            'csrf_protection' => false,
        ]);
        $form->submit($request->request->all());

        if (!$form->isValid()) {
            $errors = $this->errorHandler->handleFormErrors($form);
            return new View($errors, Response::HTTP_BAD_REQUEST);
        }

        $em = $this->getDoctrine()->getManager();
        $em->flush();

        return new View('crud.update_success', Response::HTTP_OK);
    }
    
    /**
     * Update post entity.
     * 
     * @param Request $request
     * @param int $id
     * 
     * @return View
     */
    public function patchAction(Request $request, int $id)
    {
        $post = $this->getPostRepository()->find($id);

        if ($post === null) {
            return new View(null, Response::HTTP_NOT_FOUND);
        }

        $form = $this->createForm('App\Form\PostType', $post, [
            'csrf_protection' => false,
        ]);
        $form->submit($request->request->all(), false);

        if (!$form->isValid()) {
            $errors = $this->errorHandler->handleFormErrors($form);
            return new View($errors, Response::HTTP_BAD_REQUEST);
        }
        
        $post->setUpdated(new \DateTime());
        
        $em = $this->getDoctrine()->getManager();
        $em->flush();

        return new View('crud.update_success', Response::HTTP_OK);
    }
    
    /**
     * Delete post entity.
     * 
     * @param int $id
     * 
     * @return View
     */
    public function deleteAction(int $id)
    {
        $post = $this->getPostRepository()->find($id);

        if ($post === null) {
            return new View(null, Response::HTTP_NOT_FOUND);
        }

        $em = $this->getDoctrine()->getManager();
        $em->remove($post);
        $em->flush();

        return new View('crud.delete_success', Response::HTTP_OK);
    }

    /**
     * Get post repository.
     * 
     * @return PostRepository
     */
    private function getPostRepository() {
        return $this->get('crv.doctrine_entity_repository.post');
    }
    
}
