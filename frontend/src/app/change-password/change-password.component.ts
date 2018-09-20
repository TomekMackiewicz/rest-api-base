import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../alert/alert.service';
import { ChangePasswordService } from './change-password.service';
import { LoaderService } from '../services/loader.service';
import { ErrorService } from '../services/error.service';

@Component({
    selector: 'change-password',
    templateUrl: './change-password.component.html',       
})

export class ChangePasswordComponent {
    model: any = {};

    validation = {
        currentPassword: <boolean> true,
        first: <boolean> true,
        confirmPassword: <boolean> true,
        currentPasswordMsg: <string> '',
        firstMsg: <string> ''
    };    

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private changePasswordService: ChangePasswordService,
        private alertService: AlertService,
        private loaderService: LoaderService,
        private errorService: ErrorService,
        private ref: ChangeDetectorRef) {}

    changePassword() {
        this.loaderService.displayLoader(true);
        this.changePasswordService.changePassword(
            this.model.currentPassword, 
            this.model.first, 
            this.model.second
        ).subscribe(
            (data: any) => {
                for (let err in this.validation) {
                    this.validation[err] = true;
                    this.validation[err+'Msg'] = '';
                }                
                this.loaderService.displayLoader(false);
                this.alertService.success(data, true);
                this.ref.markForCheck();
            },
            errors => {
                for (let err in errors.error) {
                    this.validation[err] = false;
                    this.validation[err+'Msg'] = errors.error[err];
                }
                this.loaderService.displayLoader(false);
                this.ref.markForCheck();
            }
        );
    }

}
