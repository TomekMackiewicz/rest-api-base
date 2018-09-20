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
                $formattedKey = $this->toCamelCase($error->getOrigin()->getName());
                $errors[$formattedKey] = $error->getMessage();
            }           
        }

        return $errors;
    }
    
    /**
     * Helper function to convert form keys to camel case.
     * (FOS User Bundle is inconsistent)
     * 
     * @param type $string
     * 
     * @return string
     */
    private function toCamelCase($string)
    {
        $func = create_function('$c', 'return strtoupper($c[1]);');
        return preg_replace_callback('/_([a-z])/', $func, $string);
    }
}
