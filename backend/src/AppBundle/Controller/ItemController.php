<?php

namespace AppBundle\Controller;

use AppBundle\Entity\Item;
use FOS\RestBundle\View\View;
use FOS\RestBundle\Controller\Annotations;
use FOS\RestBundle\View\RouteRedirectView;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Routing\ClassResourceInterface;
use FOS\RestBundle\Controller\Annotations\RouteResource;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Form\FormTypeInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;

/**
 * Item controller.
 *
 * @RouteResource("admin/item")
 */
class ItemController extends FOSRestController implements ClassResourceInterface
{
    /**
     * Finds and displays a item entity.
     *
     * @param int $id
     * @return mixed
     * @throws \Doctrine\ORM\NoResultException
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getAction(int $id)
    {
        $item = $this->getItemRepository()->findOneByIdQuery($id)->getSingleResult(); 
        if ($item === null) {
            return new View(null, Response::HTTP_NOT_FOUND);
        }  
        
        return $item;
    }    
    
    /**
     * Lists all items entities.
     * 
     * @return Item
     */
    public function cgetAction()
    {
        return $this->getItemRepository()->findAllQuery()->getResult();
    }
    
    /**
     * Adds item entity.
     * 
     * @param Request $request
     * @return mixed
     */
    public function postAction(Request $request)
    {
        $form = $this->createForm('AppBundle\Form\ItemType', null, [
            'csrf_protection' => false,
        ]);

        $form->submit($request->request->all());

        if (!$form->isValid()) {
            return $form;
        }
        
        $item = $form->getData();

        $em = $this->getDoctrine()->getManager();
        $em->persist($item);
        $em->flush();

        $routeOptions = [
            'id' => $item->getId(),
            '_format' => $request->get('_format'),
        ];

        return $this->routeRedirectView('get_item', $routeOptions, Response::HTTP_CREATED);
    }
    
    public function putAction(Request $request, int $id)
    {
        $item = $this->getItemRepository()->find($id);

        if ($item === null) {
            return new View(null, Response::HTTP_NOT_FOUND);
        }

        $form = $this->createForm('AppBundle\Form\ItemType', $item, [
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

        return $this->routeRedirectView('get_item', $routeOptions, Response::HTTP_NO_CONTENT);
    }

    public function patchAction(Request $request, int $id)
    {
        $item = $this->getItemRepository()->find($id);

        if ($item === null) {
            return new View(null, Response::HTTP_NOT_FOUND);
        }

        $form = $this->createForm('AppBundle\Form\ItemType', $item, [
            'csrf_protection' => false,
        ]);

        $form->submit($request->request->all(), false);      

        if (!$form->isValid()) {
            return $form;
        }

        $em = $this->getDoctrine()->getManager();
        $em->flush();

        $routeOptions = [
            'id' => $item->getId(),
            '_format' => $request->get('_format'),
        ];

        return $this->routeRedirectView('get_item', $routeOptions, Response::HTTP_NO_CONTENT);
    }
    
//
//    /**
//     * Deletes a item entity.
//     *
//     * @Route("/{id}", name="admin_item_delete")
//     * @Method("DELETE")
//     */
//    public function deleteAction(Request $request, Item $item)
//    {
//        $form = $this->createDeleteForm($item);
//        $form->handleRequest($request);
//
//        if ($form->isSubmitted() && $form->isValid()) {
//            $em = $this->getDoctrine()->getManager();
//            $em->remove($item);
//            $em->flush();
//        }
//
//        return $this->redirectToRoute('admin_item_index');
//    }
//
//    /**
//     * Creates a form to delete a item entity.
//     *
//     * @param Item $item The item entity
//     *
//     * @return \Symfony\Component\Form\Form The form
//     */
//    private function createDeleteForm(Item $item)
//    {
//        return $this->createFormBuilder()
//            ->setAction($this->generateUrl('admin_item_delete', array('id' => $item->getId())))
//            ->setMethod('DELETE')
//            ->getForm()
//        ;
//    }

    /**
     * @return ItemRepository
     */
    private function getItemRepository() {
        return $this->get('crv.doctrine_entity_repository.item');
    }
    
}
