import { Injectable } from '@angular/core';

@Injectable()
export class ErrorService {    
        
    handleErrors(validation, errors) {
        for (let err in errors) {
            validation[err] = false;
            validation[err+'Msg'] = errors[err];
        }        
    }
    
    nullErrors(validation) {
        for (let err in validation) {
            validation[err] = true;
            validation[err+'Msg'] = null;
        }        
    }    

}
