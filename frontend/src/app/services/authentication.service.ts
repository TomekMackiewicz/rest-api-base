import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http'; // @angular/common/http
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {

    private subject = new Subject<any>();

    getUsername(): Observable<any> {
        return this.subject.asObservable();
    }

    constructor(private http: Http) {
        var currentUsername = localStorage.getItem('currentUsername');        
    }

    login(username: string, password: string) {
        return this.http.post('http://localhost:8000/api/login_check', { 
            username: username, 
            password: password 
        }).map((response: Response) => {
            let token = response.json();
            if (token) {
                localStorage.setItem('token', JSON.stringify(token));
                localStorage.setItem('currentUsername', username);
                this.subject.next(localStorage.getItem('currentUsername'));
            }
        }).catch((response) => {
            let error = this.handleError(response);
            return Observable.throw(error)
        });
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUsername');
        this.subject.next();
    }
    
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
    
    changePassword(user:number, currentPassword: string, newPassword: string, confirmPassword: string) {
        return this.http.patch('http://localhost:8000/api/password/'+user+'/change', { 
            currentPassword: currentPassword, 
            newPassword: newPassword,
            confirmPassword: confirmPassword, 
        })
            .map((response: Response) => {
                // ...
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

