import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class FlagGuard implements CanActivate {

    constructor(private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log(localStorage.getItem("allow"));
        if(localStorage.getItem("allow") === "true") {
            let allow = false;
            localStorage.setItem("allow", JSON.stringify(allow));
            return true;
        }
        else {
            this.router.navigate(['/denied'], {queryParams: {returnUrl: state.url}});
            return false;
        }
    }
}
