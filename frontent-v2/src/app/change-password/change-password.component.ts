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
    model: any = {
        currentPassword: <string> '',
        first: <string> '',
        second: <string> ''
    };

    validation: any = {
        currentPassword: <boolean> true,
        first: <boolean> true,
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
                this.errorService.nullErrors(this.validation);               
                this.loaderService.displayLoader(false);
                this.alertService.success(data, true);
                this.ref.markForCheck();
            },
            errors => {
                this.errorService.handleErrors(this.validation, errors.error);
                this.loaderService.displayLoader(false);
                this.ref.markForCheck();
            }
        );
    }

}
