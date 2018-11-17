<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\ErrorHandler;
use FOS\RestBundle\Controller\Annotations;
use FOS\RestBundle\Controller\Annotations\Get;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Routing\ClassResourceInterface;
use FOS\RestBundle\Controller\Annotations\RouteResource;
use FOS\RestBundle\View\View;
use FOS\UserBundle\Event\FilterUserResponseEvent;
use FOS\UserBundle\Event\GetResponseUserEvent;
use FOS\UserBundle\FOSUserEvents;
use FOS\UserBundle\Event\FormEvent;
use FOS\UserBundle\Form\Factory\FormFactory;
use FOS\UserBundle\Model\UserManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * @RouteResource("api/profile", pluralize=false)
 */
class RestProfileController extends FOSRestController implements ClassResourceInterface
{
    private $userManager;
    private $dispatcher;    
    private $formFactory;

    public function __construct(
        FormFactory $formFactory,
        UserManagerInterface $userManager, 
        EventDispatcherInterface $dispatcher,
        ErrorHandler $errorHandler)         
    {
        $this->formFactory = $formFactory;
        $this->userManager = $userManager;
        $this->dispatcher = $dispatcher; 
        $this->errorHandler = $errorHandler;
    } 
    
    /**
     * Get user profile.
     * 
     * @param UserInterface $user
     * @return UserInterface
     * @throws AccessDeniedHttpException
     * 
     * @ParamConverter("user", class="App:User")
     */
    public function getAction(UserInterface $user)
    {
        if ($user !== $this->getUser()) {
            throw new AccessDeniedHttpException();
        }

        return $user;
    }

    /**
     * Update user profile.
     * 
     * @param Request $request
     * @param UserInterface $user
     *
     * @ParamConverter("user", class="App:User")
     *
     * @return View
     */
    public function putAction(Request $request, UserInterface $user)
    {
        return $this->updateProfile($request, $user, true);
    }

    /**
     * Update user profile.
     * 
     * @param Request $request
     * @param UserInterface $user
     *
     * @ParamConverter("user", class="App:User")
     *
     * @return View
     */
    public function patchAction(Request $request, UserInterface $user)
    {
        return $this->updateProfile($request, $user, false);
    }
    
    /**
     * Update user profile.
     * 
     * @param Request $request
     * @param UserInterface $user
     * @param bool $clearMissing
     * 
     * @return View
     */
    private function updateProfile(Request $request, UserInterface $user, $clearMissing=true)
    {
        $user = $this->getAction($user);
        $event = new GetResponseUserEvent($user, $request);
        $this->dispatcher->dispatch(FOSUserEvents::PROFILE_EDIT_INITIALIZE, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        $form = $this->formFactory->createForm(['csrf_protection' => false]);
        $form->setData($user);
        $form->submit($request->request->all(), $clearMissing);

        if (!$form->isValid()) {
            $errors = $this->errorHandler->handleFormErrors($form);
            return new View($errors, Response::HTTP_BAD_REQUEST);
        }

        $event = new FormEvent($form, $request);
        $this->dispatcher->dispatch(FOSUserEvents::PROFILE_EDIT_SUCCESS, $event);

        $this->userManager->updateUser($user);

        if (null === $response = $event->getResponse()) {           
            return new View('crud.update_success', Response::HTTP_OK);
        }

        $this->dispatcher->dispatch(
            FOSUserEvents::PROFILE_EDIT_COMPLETED, 
            new FilterUserResponseEvent($user, $request, $response)
        );
        
        return new View('crud.update_success', Response::HTTP_OK);
    }    
    
}

