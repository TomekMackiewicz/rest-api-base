import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) {}

    public getToken(): string {        
        return localStorage.getItem('token');        
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.getToken()) {
            return true;
        }
        this.router.navigate(['/denied'], {queryParams: {returnUrl: state.url}});
        return false;
    }
}
