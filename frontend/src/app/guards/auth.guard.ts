import { Injectable, EventEmitter } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
//import { AlertService } from '../alert/alert.service';

@Injectable()
export class AuthGuard implements CanActivate {
    
    //loggedIn: EventEmitter<any> = new EventEmitter();

    constructor(
        private router: Router,
        //private alertService: AlertService
    ) {}

    public getToken(): string {        
        return localStorage.getItem('token');        
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.getToken()) {
            //this.router.navigate(['/denied'], {queryParams: {returnUrl: state.url}});
            return true;            
        }        
        
//        if (!this.isTokenExpired()) {
//            return true;
//        }
        
        //this.loggedIn.emit(false);
        //this.alertService.error('Logged out!', true);
        this.router.navigate(['/'], {queryParams: {returnUrl: state.url}});

//        localStorage.removeItem('token');
//        localStorage.removeItem('currentUsername');
//        localStorage.removeItem('userId');
//        localStorage.removeItem('userRole');        
//                
        return false;
    }
    
//    getTokenExpirationDate(token: string): Date {
//        var decoded: any = jwt_decode(token);
//        
//        if (decoded.exp === undefined) {
//            return null;
//        }
//        
//        const date = new Date(0); 
//        date.setUTCSeconds(decoded.exp);
//        
//        return date;
//    }
//
//    isTokenExpired(): boolean { 
//        var token = this.getToken();
//              
//        if(!token) {
//            return true;
//        }
//        
//        const date = this.getTokenExpirationDate(token);
//        
//        if(date === undefined) {
//            return false;
//        }
//        
//        return !(date.valueOf() > new Date().valueOf());
//    } 
//    
//    isTokenSet() {
//        var token = this.getToken();
//              
//        if(!token) {
//            return false;
//        } 
//        
//        return true;       
//    }   
}
