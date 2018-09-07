<?php

namespace App\Service;

/*
 * Collect form errors.
 */
class ErrorHandler
{
    /*
     * @param Form $form
     * 
     * @return array
     */
    public function formErrorsToArray($form)
    {
        $errors = [];
        foreach ($form->getErrors(true) as $error) {
            if ($error->getOrigin()) {
                $errors[$error->getOrigin()->getName()][] = $error->getMessage();
            }
        }
        
        return $errors;
    }
}
