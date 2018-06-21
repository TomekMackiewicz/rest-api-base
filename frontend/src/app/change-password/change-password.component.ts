import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../alert/alert.service';
import { ChangePasswordService } from './change-password.service';
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
        private changePasswordService: ChangePasswordService,
        private alertService: AlertService,
        private loaderService: LoaderService,
        private ref: ChangeDetectorRef) {}

    ngOnInit() {
        // 
    }

    changePassword() {
        this.loaderService.displayLoader(true);
        this.changePasswordService.changePassword(
            this.model.currentPassword, 
            this.model.newPassword, 
            this.model.confirmPassword
        ).subscribe(
            (data: any) => {
                this.loaderService.displayLoader(false);
                this.alertService.success('Success', true);
                this.ref.markForCheck();
            },
            error => {                
                this.loaderService.displayLoader(false);
                this.alertService.error(error);
                this.ref.markForCheck();
            }
        );
    }

}
