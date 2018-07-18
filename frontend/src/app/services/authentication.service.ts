import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import * as decode from 'jwt-decode';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderService } from '../services/loader.service';
import { AlertService } from '../alert/alert.service';

@Injectable()
export class AuthenticationService {

    private returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/items';
    public currentUsername: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public admin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    getUsername(value: string) {
        this.currentUsername.next(value);
    }  

    isAdmin(value: boolean) {
        this.admin.next(value);
    }

    isLoggedIn(value: boolean) {
        this.loggedIn.next(value);
    }
                
    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
        private router: Router,
        private loaderService: LoaderService,
        private alertService: AlertService           
    ) {};
       
    login(username: string, password: string) {
        this.loaderService.displayLoader(true);        
        return this.http.post<any>('http://localhost:8000/api/login_check', { 
            username: username, 
            password: password
        }).subscribe(
            data => {
                let token = data.token;
                if (token) {                    
                    localStorage.setItem('token', token);
                    localStorage.setItem('currentUsername', decode(token).username);
                    localStorage.setItem('userId', decode(token).userId);
                    // Not nice, but what to do...
                    localStorage.setItem('userRole', decode(token).roles[0]);                    
                    this.getUsername(localStorage.getItem('currentUsername'));
                    this.isLoggedIn(true);
                    if (decode(token).roles[0] == 'ROLE_ADMIN' || decode(token).roles[0] == 'ROLE_SUPER_ADMIN') {
                        this.isAdmin(true);
                    }
                }
                this.router.navigate([this.returnUrl]);
                this.loaderService.displayLoader(false);
            },
            error => {
                this.alertService.error(error);
                this.loaderService.displayLoader(false);
            });        
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUsername');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        this.isLoggedIn(false);
        this.isAdmin(false);
        this.getUsername('');
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

