<?php

namespace App\Controller;

use App\Entity\Item;
use App\Service\ErrorHandler;
use FOS\RestBundle\Controller\Annotations\RouteResource;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Routing\ClassResourceInterface;
use FOS\RestBundle\View\View;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
 
/**
 * Item controller.
 *
 * @RouteResource("api/admin/item")
 */
class ItemController extends FOSRestController implements ClassResourceInterface
{
    
    public function __construct(ErrorHandler $errorHandler)
    {
        $this->errorHandler = $errorHandler;
    }
    
    /**
     * Find and display item entity.
     *
     * @param int $id
     * 
     * @return mixed
     */
    public function getAction(int $id)
    {
        $item = $this->getItemRepository()->findOneById($id)->getSingleResult(); 
        if ($item === null) {
            return new View(null, Response::HTTP_NOT_FOUND);
        }  
        
        return $item;
    }    
    
    /**
     * List all item entities.
     * 
     * @return Item
     */
    public function cgetAction()
    {
        $items = $this->getItemRepository()->findAll()->getResult();
        if ($items === null) {
            return new View(null, Response::HTTP_NOT_FOUND);
        }
        
        return $items;
    }
    
    /**
     * Add item entity.
     * 
     * @param Request $request
     * 
     * @return View
     */
    public function postAction(Request $request)
    {
        $form = $this->createForm('App\Form\ItemType', null, [
            'csrf_protection' => false,
        ]);
        $form->submit($request->request->all());
    
        if (!$form->isValid()) {
            $errors = $this->errorHandler->handleFormErrors($form);
            return new View($errors, Response::HTTP_BAD_REQUEST);
        }
        
        $item = $form->getData();
        $em = $this->getDoctrine()->getManager();
        $em->persist($item);
        $em->flush();
        
        return new View('crud.create_success', Response::HTTP_CREATED);
    }
    
    /**
     * Replace item entity.
     * 
     * @param Request $request
     * @param int $id
     * 
     * @return View
     */
    public function putAction(Request $request, int $id)
    {
        $item = $this->getItemRepository()->find($id);

        if ($item === null) {
            return new View(null, Response::HTTP_NOT_FOUND);
        }

        $form = $this->createForm('App\Form\ItemType', $item, [
            'csrf_protection' => false,
        ]);
        $form->submit($request->request->all());

        if (!$form->isValid()) {
            $errors = $this->errorHandler->handleFormErrors($form);
            return new View($errors, Response::HTTP_BAD_REQUEST);
        }

        $em = $this->getDoctrine()->getManager();
        $em->flush();

        return new View('crud.update.success', Response::HTTP_OK);
    }
    
    /**
     * Update item entity.
     * 
     * @param Request $request
     * @param int $id
     * 
     * @return View
     */
    public function patchAction(Request $request, int $id)
    {
        $item = $this->getItemRepository()->find($id);

        if ($item === null) {
            return new View(null, Response::HTTP_NOT_FOUND);
        }

        $form = $this->createForm('App\Form\ItemType', $item, [
            'csrf_protection' => false,
        ]);
        $form->submit($request->request->all(), false);

        if (!$form->isValid()) {
            $errors = $this->errorHandler->handleFormErrors($form);
            return new View($errors, Response::HTTP_BAD_REQUEST);
        }
        
        $item->setLastAction(new \DateTime());
        
        $em = $this->getDoctrine()->getManager();
        $em->flush();

        return new View('crud.update.success', Response::HTTP_OK);
    }
    
    /**
     * Delete item entity.
     * 
     * @param int $id
     * 
     * @return View
     */
    public function deleteAction(int $id)
    {
        $item = $this->getItemRepository()->find($id);

        if ($item === null) {
            return new View(null, Response::HTTP_NOT_FOUND);
        }

        $em = $this->getDoctrine()->getManager();
        $em->remove($item);
        $em->flush();

        return new View('crud.delete_success', Response::HTTP_OK);
    }

    /**
     * Get item repository.
     * 
     * @return ItemRepository
     */
    private function getItemRepository() {
        return $this->get('crv.doctrine_entity_repository.item');
    }
    
}
