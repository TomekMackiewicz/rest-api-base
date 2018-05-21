import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../alert/alert.service';
import { AuthenticationService } from '../services/authentication.service'; //?
import { LoaderService } from '../services/loader.service';

@Component({
    selector: 'change-password',
    templateUrl: './change-password.component.html',       
})

export class ChangePasswordComponent {
    model: any = {};
    user: any = localStorage.getItem('currentUsername');

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private loaderService: LoaderService) {}

    ngOnInit() {
        // 
    }

    changePassword() {
        this.loaderService.displayLoader(true);
        this.authenticationService.changePassword(this.user, this.model.currentPassword, this.model.newPassword, this.model.confirmPassword)
            .subscribe(
            data => {
                this.loaderService.displayLoader(false);
            },
            error => {
                this.alertService.error(error);
                this.loaderService.displayLoader(false);
            });
    }

}
