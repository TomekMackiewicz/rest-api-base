import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { AlertService } from '../alert/alert.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',       
})

export class LoginComponent implements OnInit {
    
    model: any = {};
    
    constructor(
        private authenticationService: AuthenticationService,
        private ref: ChangeDetectorRef,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.authenticationService.logout();
    }

    login() {
        this.authenticationService.login(this.model.username, this.model.password);
        this.authenticationService.loginError.subscribe(
            (error) => {
                this.alertService.error(error.message);
                this.ref.markForCheck();
            }
        );
    }

}
