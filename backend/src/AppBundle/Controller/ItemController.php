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
//    /**
//     * Lists all item entities.
//     *
//     * @Route("/", name="admin_item_index")
//     * @Method("GET")
//     */
//    public function indexAction()
//    {
//        $em = $this->getDoctrine()->getManager();
//
//        $items = $em->getRepository('AppBundle:Item')->findAll();
//
//        return $this->render('item/index.html.twig', array(
//            'items' => $items,
//        ));
//    }

//    /**
//     * Creates a new item entity.
//     *
//     * @Route("/new", name="admin_item_new")
//     * @Method({"GET", "POST"})
//     */
//    public function newAction(Request $request)
//    {
//        $item = new Item();
//        $form = $this->createForm('AppBundle\Form\ItemType', $item);
//        $form->handleRequest($request);
//
//        if ($form->isSubmitted() && $form->isValid()) {
//            $em = $this->getDoctrine()->getManager();
//            $em->persist($item);
//            $em->flush();
//
//            return $this->redirectToRoute('admin_item_show', array('id' => $item->getId()));
//        }
//
//        return $this->render('item/new.html.twig', array(
//            'item' => $item,
//            'form' => $form->createView(),
//        ));
//    }

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
        return $this->getDoctrine()->getRepository('AppBundle:Item')->find($id);
    }    
    
//    /**
//     * Displays a form to edit an existing item entity.
//     *
//     * @Route("/{id}/edit", name="admin_item_edit")
//     * @Method({"GET", "POST"})
//     */
//    public function editAction(Request $request, Item $item)
//    {
//        $deleteForm = $this->createDeleteForm($item);
//        $editForm = $this->createForm('AppBundle\Form\ItemType', $item);
//        $editForm->handleRequest($request);
//
//        if ($editForm->isSubmitted() && $editForm->isValid()) {
//            $this->getDoctrine()->getManager()->flush();
//
//            return $this->redirectToRoute('admin_item_edit', array('id' => $item->getId()));
//        }
//
//        return $this->render('item/edit.html.twig', array(
//            'item' => $item,
//            'edit_form' => $editForm->createView(),
//            'delete_form' => $deleteForm->createView(),
//        ));
//    }
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
}
