import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) {}

    public getToken(): string {
        //return localStorage.getItem('token');
        let tokenObj = JSON.parse(localStorage.getItem('token'));
        return tokenObj !== null ? tokenObj.token : null;        
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.getToken()) {
            return true;
        }
        this.router.navigate(['/denied'], {queryParams: {returnUrl: state.url}});
        return false;
    }
}
