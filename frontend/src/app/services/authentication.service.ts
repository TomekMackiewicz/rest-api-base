import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {

    private subject = new Subject<any>();

    getUsername(): Observable<any> {
        return this.subject.asObservable();
    }

    constructor(
        private http: HttpClient 
    ) {
        //var currentUsername = localStorage.getItem('currentUsername');  // zob. app.component.ts      
    }

    login(username: string, password: string) {
        return this.http.post<any>('http://localhost:8000/api/login_check', { 
            username: username, 
            password: password
            });        
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUsername');
        localStorage.removeItem('userId');
        this.subject.next();
    }
        
    // spr, czego chce api - analogicznie do: https://github.com/codereviewvideos/fos-rest-and-user-bundle-integration/blob/master/src/AppBundle/Features/password_change.feature
    register(email: string, username: string, password: string) {
        return this.http.post('http://localhost:8000/api/register', { 
            email: email, 
            username: username, 
            plainPassword: password 
        }).catch((response) => {
            let error = this.handleError(response);
            return Observable.throw(error)
        });               
    }

    private handleError(error: any) {
        let errorResponse = JSON.parse(error._body);
        if (errorResponse.hasOwnProperty('errors')) {     
            var errors = new String(this.getErrors(errorResponse.errors));
        } else {        
            var errors = new String();
        }     
        let errMsg = Object.keys(errors).length !== 0 && errors.constructor !== Object ? 
            errors : errorResponse.message ? errorResponse.message : 'Something went wrong.';

        return errMsg;
    }
    
    getErrors(formErrors: any): String {       
        let errors = Object.values(formErrors.children);
        let msg = new String();
        for (let err of errors) {
            if (err.errors) { 
                msg = msg.concat(err.errors[0]);
                msg = msg.concat("\n");
            }           
        }        
               
        return msg;              
    }    
        
}

