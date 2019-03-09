import {  
    ReactiveFormsModule,  
    NG_VALIDATORS,  
    FormsModule,  
    FormGroup,  
    FormControl,  
    ValidatorFn,  
    Validator  
 } from '@angular/forms';
 
 import { Directive } from '@angular/core';

@Directive({  
    selector: '[patternValidator][ngModel]',  
    providers: [{  
        provide: NG_VALIDATORS,  
        useExisting: PatternValidator,  
        multi: true
    }]  
 })
 
export class PatternValidator implements Validator {
    validator: ValidatorFn;

    constructor() {  
       this.validator = this.patternValidator();  
    }

    validate(c: FormControl) {  
        return this.validator(c);  
    }

    patternValidator(): ValidatorFn {  
        return (c: FormControl) => {  
            let isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(c.value);  
            if (isValid) {  
                return null;  
            } else {  
                return {  
                    patternValidator: {  
                        valid: false  
                    }  
                };  
            }  
        }  
    }  
}
