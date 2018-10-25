<?php

namespace App\Controller;
// @Fixme - remove unused
use App\Entity\User;
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
 * User controller.
 *
 * @RouteResource("api/admin/users")
 */
class UserController extends FOSRestController implements ClassResourceInterface
{
    /**
     * Finds and displays user entity.
     *
     * @param int $id
     * @return mixed
     * @throws \Doctrine\ORM\NoResultException
     * @throws \Doctrine\ORM\NonUniqueResultException
     */
    public function getAction(int $id)
    {
        $user = $this->getUserRepository()->findOneByIdQuery($id)->getSingleResult(); 
        if ($user === null) {
            return new View(null, Response::HTTP_NOT_FOUND);
        }  
        
        return $user;
    }    
    
    /**
     * Lists all users entities.
     * 
     * @return User
     */
    public function cgetAction()
    {
        return $this->getUserRepository()->findAllQuery()->getResult();
    }
        
    /**
     * Deletes user entity.
     * 
     * @param int $id
     * @return View
     */
    public function deleteAction(int $id)
    {
        $user = $this->getUserRepository()->find($id);

        if ($user === null) {
            return new View(null, Response::HTTP_NOT_FOUND);
        }

        $em = $this->getDoctrine()->getManager();
        $em->remove($user);
        $em->flush();

        return new View('crud.delete_success', Response::HTTP_OK);
    }

    /**
     * Update user entity.
     * 
     * @param Request $request
     * @param int $id
     * @return View
     */
    public function patchAction(Request $request, int $id)
    {
        $user = $this->getUserRepository()->find($id);

        if ($user === null) {
            return new View(null, Response::HTTP_NOT_FOUND);
        }

        $form = $this->createForm('App\Form\UserType', $user, [
            'csrf_protection' => false,
        ]);
        
        $form->submit($request->request->all(), false);      

        if (!$form->isValid()) {
            return $form;
        }

        $em = $this->getDoctrine()->getManager();
        $em->flush();

        $routeOptions = [
            'id' => $user->getId(),
            '_format' => $request->get('_format'),
        ];

        return new View('user.status_change', Response::HTTP_OK);
    }    
    
    /**
     * @return UserRepository
     */
    private function getUserRepository() {
        return $this->get('crv.doctrine_entity_repository.user');
    }
    
}
