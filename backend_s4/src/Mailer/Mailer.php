<?php

namespace App\Mailer;

use FOS\UserBundle\Mailer\MailerInterface;
use FOS\UserBundle\Model\UserInterface;
use Symfony\Component\Dotenv\Dotenv;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;

/*
 * Mailer.
 */
class Mailer implements MailerInterface
{
    protected $mailer;
    protected $router;
    protected $twig;
    protected $parameters;

    public function __construct(
        \Swift_Mailer $mailer, 
        UrlGeneratorInterface $router, 
        \Twig_Environment $twig, 
        array $parameters)
    {
        $this->mailer = $mailer;
        $this->router = $router;
        $this->twig = $twig;
        $this->parameters = $parameters;
    }
    
    /**
     * Send confirmation email.
     * 
     * @param UserInterface $user
     */
    public function sendConfirmationEmailMessage(UserInterface $user)
    {
        $template = $this->parameters['template']['confirmation'];
        $url = $this->router->generate(
            'fos_user_registration_confirm', 
            array('token' => $user->getConfirmationToken()), 
            UrlGeneratorInterface::ABSOLUTE_URL
        );

        $context = array(
            'user' => $user,
            'confirmationUrl' => $url
        );

        $this->sendMessage(
            $template, 
            $context, 
            $this->parameters['from_email']['confirmation'], 
            $user->getEmail()
        );
    }
    
    /**
     * Send resetting email.
     * 
     * @param UserInterface $user
     */
    public function sendResettingEmailMessage(UserInterface $user)
    {
        $template = $this->parameters['template']['resetting'];
        $dotenv = new Dotenv();
        $dotenv->load(__DIR__.'/../../.env');
        $passwordResetUrl = getenv('PASSWORD_RESET_URL');
        $url = $passwordResetUrl.'/'.$user->getConfirmationToken();

        $context = [
            'user' => $user,
            'confirmationUrl' => $url
        ];

        $this->sendMessage(
            $template, 
            $context, 
            $this->parameters['from_email']['resetting'],
            $user->getEmail()
        );
    }

    /**
     * Send message.
     * 
     * @param string $templateName
     * @param array  $context
     * @param string $fromEmail
     * @param string $toEmail
     */
    protected function sendMessage($templateName, $context, $fromEmail, $toEmail)
    {
        $context = $this->twig->mergeGlobals($context);
        $template = $this->twig->loadTemplate($templateName);
        $subject = $template->renderBlock('subject', $context);
        $textBody = $template->renderBlock('body_text', $context);
        $htmlBody = $template->renderBlock('body_html', $context);

        $message = (new \Swift_Message($subject));
        $message->setFrom($fromEmail);
        $message->setTo($toEmail);        
        
        if (!empty($htmlBody)) {
            $message->setBody($htmlBody, 'text/html')
                    ->addPart($textBody, 'text/plain');
        } else {
            $message->setBody($textBody);
        }

        $this->mailer->send($message);
    }
}

