import { Injectable } from '@angular/core';

@Injectable()
export class ErrorService {

    //error: any = {};
    
    errorsToArray() {
        
    }
        
    convertError(errors: any) {
        var test = '';
        //var t = <any>{};
        //var error: any = {};
        //console.log(errors.error);
        Object.entries(errors.forEach(
          ([key, value]) => test = test+value[0]+'. '
        ));
        
        return test;        
    }

    displayError(value: boolean) {
        //
    }
}
