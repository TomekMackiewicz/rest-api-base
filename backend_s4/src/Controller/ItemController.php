<?php

namespace App\Controller;

use App\Entity\Item;
use App\Service\ErrorHandler;
use FOS\RestBundle\Controller\Annotations\RouteResource;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Routing\ClassResourceInterface;
use FOS\RestBundle\View\RouteRedirectView;
use FOS\RestBundle\View\View;
use Symfony\Component\Form\FormTypeInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
 
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
     * 
     * @throws \Doctrine\ORM\NoResultException
     * @throws \Doctrine\ORM\NonUniqueResultException
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
        return $this->getItemRepository()->findAll()->getResult();
    }
    
    /**
     * Add item entity.
     * 
     * @param Request $request
     * 
     * @return View|\Symfony\Component\Form\Form
     */
    public function postAction(Request $request)
    {
        $form = $this->createForm('App\Form\ItemType', null, [
            'csrf_protection' => false,
        ]);
        $form->submit($request->request->all());
    
        if (!$form->isValid()) {
            $errors = $this->errorHandler->formErrorsToArray($form);
            return new View($errors, Response::HTTP_BAD_REQUEST);
        }
        
        $item = $form->getData();
        $em = $this->getDoctrine()->getManager();
        $em->persist($item);
        $em->flush();

        $routeOptions = ['id' => $item->getId(), '_format' => $request->get('_format')];

        return $this->routeRedirectView('get_item', $routeOptions, Response::HTTP_CREATED);
    }
    
    /**
     * Replace item entity.
     * 
     * @param Request $request
     * @param int $id
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
            return $form;
        }

        $em = $this->getDoctrine()->getManager();
        $em->flush();

        $routeOptions = [
            'id' => $item->getId(),
            '_format' => $request->get('_format'),
        ];

        return $this->routeRedirectView(
            'get_items',
            $routeOptions,
            Response::HTTP_NO_CONTENT
        );
    }
    
    /**
     * Update item entity.
     * 
     * @param Request $request
     * @param int $id
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
            return $form;
        }
        
        $item->setLastAction(new \DateTime());
        
        $em = $this->getDoctrine()->getManager();
        $em->flush();

        $routeOptions = [
            'id' => $item->getId(),
            '_format' => $request->get('_format'),
        ];

        return $this->routeRedirectView(
            'get_items',
            $routeOptions,
            Response::HTTP_NO_CONTENT
        );
    }
    
    /**
     * Deletes item entity.
     * 
     * @param int $id
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

        return new View(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * @return ItemRepository
     */
    private function getItemRepository() {
        return $this->get('crv.doctrine_entity_repository.item');
    }
    
}
