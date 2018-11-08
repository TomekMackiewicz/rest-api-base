<?php

namespace App\Controller;

use App\Mailer\Mailer;
use App\Service\ErrorHandler;
use FOS\RestBundle\Controller\Annotations;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Routing\ClassResourceInterface;
use FOS\RestBundle\View\View;
use FOS\UserBundle\Event\FilterUserResponseEvent;
use FOS\UserBundle\Event\FormEvent;
use FOS\UserBundle\Event\GetResponseNullableUserEvent;
use FOS\UserBundle\Event\GetResponseUserEvent;
use FOS\UserBundle\Form\Factory\FormFactory;
use FOS\UserBundle\FOSUserEvents;
use FOS\UserBundle\Model\UserManagerInterface;
use FOS\UserBundle\Util\TokenGeneratorInterface;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\EventDispatcher\EventDispatcherInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Security\Core\User\UserInterface;

/**
 * Password management.
 * 
 * @Annotations\Prefix("api/password")
 * 
 */
class RestPasswordManagementController extends FOSRestController implements ClassResourceInterface 
{

    private $changeFormFactory;
    private $resettingFormFactory;
    private $userManager;
    private $dispatcher;
    private $errorHandler;
    private $tokenGenerator;
    private $mailer;
    
    public function __construct(
        FormFactory $changeFormFactory,
        FormFactory $resettingFormFactory,
        UserManagerInterface $userManager, 
        EventDispatcherInterface $dispatcher, 
        ErrorHandler $errorHandler,
        TokenGeneratorInterface $tokenGenerator,
        Mailer $mailer)         
    {
        $this->changeFormFactory = $changeFormFactory;
        $this->resettingFormFactory = $resettingFormFactory;
        $this->userManager = $userManager;
        $this->dispatcher = $dispatcher;
        $this->errorHandler = $errorHandler;
        $this->tokenGenerator = $tokenGenerator;
        $this->mailer = $mailer;        
    }      

    /**
     * Request reset password.
     * 
     * @param Request $request
     * @return JsonResponse
     * 
     * @Annotations\Post("/reset/request") 
     */
    public function requestResetAction(Request $request) 
    {
        $username = $request->request->get('username');
        $user = $this->userManager->findUserByUsernameOrEmail($username);
        $event = new GetResponseNullableUserEvent($user, $request);
        $this->dispatcher
            ->dispatch(FOSUserEvents::RESETTING_SEND_EMAIL_INITIALIZE, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        if (null === $user) {
            return new JsonResponse(
                'user.not_recognised', JsonResponse::HTTP_FORBIDDEN
            );
        }

        $event = new GetResponseUserEvent($user, $request);
        $this->dispatcher->dispatch(FOSUserEvents::RESETTING_RESET_REQUEST, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        if ($user->isPasswordRequestNonExpired(
            $this->container->getParameter('fos_user.resetting.token_ttl'))
        ) {
            return new JsonResponse(
                $this->get('translator')->trans(
                    'resetting.password_already_requested', 
                    [],
                    'FOSUserBundle'), JsonResponse::HTTP_FORBIDDEN
            );
        }

        if (null === $user->getConfirmationToken()) {
            $user->setConfirmationToken($this->tokenGenerator->generateToken());
        }

        /* Dispatch confirm event */
        $event = new GetResponseUserEvent($user, $request);
        $this->dispatcher->dispatch(FOSUserEvents::RESETTING_SEND_EMAIL_CONFIRM, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        $this->mailer->sendResettingEmailMessage($user);
        $user->setPasswordRequestedAt(new \DateTime());
        $this->userManager->updateUser($user);

        /* Dispatch completed event */
        $event = new GetResponseUserEvent($user, $request);
        $this->dispatcher->dispatch(FOSUserEvents::RESETTING_SEND_EMAIL_COMPLETED, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        return new JsonResponse(
            $this->get('translator')->trans(
                'resetting.check_email', 
                ['%tokenLifetime%' => floor(
                    $this->container->getParameter('fos_user.resetting.token_ttl') / 3600
                )], 
                'FOSUserBundle'
            ), JsonResponse::HTTP_OK
        );
    }

    /**
     * Reset user password.
     * 
     * @param Request $request
     * @return JsonResponse
     * 
     * @Annotations\Post("/reset/confirm") 
     */
    public function confirmResetAction(Request $request) 
    {
        $token = $request->request->get('token', null);
        
        if (null === $token) {
            return new JsonResponse(
                'You must submit a token.', 
                JsonResponse::HTTP_BAD_REQUEST
            );
        }
        
        $user = $this->userManager->findUserByConfirmationToken($token);
        
        if (null === $user) {
            return new JsonResponse(
                sprintf(
                    'resetting.wrong_token', 
                    $token
                ), JsonResponse::HTTP_BAD_REQUEST
            );
        }
        
        $event = new GetResponseUserEvent($user, $request);
        $this->dispatcher->dispatch(FOSUserEvents::RESETTING_RESET_INITIALIZE, $event);
        
        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }
        
        $form = $this->resettingFormFactory->createForm([
            'csrf_protection' => false,
            'allow_extra_fields' => true,
        ]);
        
        $form->setData($user);
        $form->submit($request->request->all());
        
        if (!$form->isValid()) {
            $errors = $this->errorHandler->handleFormErrors($form);
            return new View($errors, Response::HTTP_BAD_REQUEST);
        }
        
        $event = new FormEvent($form, $request);
        $this->dispatcher->dispatch(FOSUserEvents::RESETTING_RESET_SUCCESS, $event);
        $this->userManager->updateUser($user);
        
        if (null === $response = $event->getResponse()) {
            return new JsonResponse(
                'resetting.flash.success', JsonResponse::HTTP_OK
            );
        }

        $this->dispatcher->dispatch(
            FOSUserEvents::RESETTING_RESET_COMPLETED, 
            new FilterUserResponseEvent($user, $request, $response)
        );
        
        return new JsonResponse(
            'resetting.flash.success', JsonResponse::HTTP_OK
        );
    }

    /**
     * Change user password.
     * 
     * @param Request $request
     * @param UserInterface $user
     * @return JsonResponse
     * @throws AccessDeniedHttpException
     * 
     * @ParamConverter("user", class="App:User")
     * @Annotations\Patch("/{user}/change")
     */
    public function changeAction(Request $request, UserInterface $user) 
    {       
        if ($user !== $this->getUser()) {
            throw new AccessDeniedHttpException();
        }

        $event = new GetResponseUserEvent($user, $request);
        $this->dispatcher->dispatch(FOSUserEvents::CHANGE_PASSWORD_INITIALIZE, $event);

        if (null !== $event->getResponse()) {
            return $event->getResponse();
        }

        $form = $this->changeFormFactory->createForm([
            'csrf_protection' => false
        ]);
        $form->setData($user);
        $form->submit($request->request->all());

        if (!$form->isValid()) {
            $errors = $this->errorHandler->handleFormErrors($form);
            return new View($errors, Response::HTTP_BAD_REQUEST);
        }

        $event = new FormEvent($form, $request);
        $this->dispatcher->dispatch(FOSUserEvents::CHANGE_PASSWORD_SUCCESS, $event);

        $this->userManager->updateUser($user);

        if (null === $response = $event->getResponse()) {
            return new JsonResponse(
                'change_password.flash.success', 
                JsonResponse::HTTP_OK
            );
        }

        $this->dispatcher->dispatch(
            FOSUserEvents::CHANGE_PASSWORD_COMPLETED, 
            new FilterUserResponseEvent($user, $request, $response));

        return new JsonResponse(
            'change_password.flash.success', 
             JsonResponse::HTTP_OK
        );
    }

}
