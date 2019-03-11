import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { AlertService } from '../alert/alert.service';

@Component({
    selector: 'logout',
    template: ''
})

export class LogoutComponent {
    returnUrl: string;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.authenticationService.logout();
        this.alertService.success('user.logged_out');
        this.returnUrl = '/';                     
        this.router.navigate([this.returnUrl]);         
    }
   
}
