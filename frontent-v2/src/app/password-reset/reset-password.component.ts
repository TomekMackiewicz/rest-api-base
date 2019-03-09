import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../alert/alert.service';
import { ResetPasswordService } from './reset-password.service';
import { LoaderService } from '../services/loader.service';

@Component({
    selector: 'reset-password',
    templateUrl: './reset-password.component.html',       
})

export class ResetPasswordComponent {
    model: any = {
        username: <string> ''
    };
    
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private resetPasswordService: ResetPasswordService,
        private alertService: AlertService,
        private loaderService: LoaderService,
        private ref: ChangeDetectorRef) {}

    ngOnInit() {
        // 
    }

    resetPassword() {
        this.loaderService.displayLoader(true);
        this.resetPasswordService.resetPassword(
            this.model.username
        ).subscribe(
            (data: any) => {
                this.loaderService.displayLoader(false);
                this.alertService.success(data, true);
                this.ref.markForCheck();
            },
            errors => {               
                this.loaderService.displayLoader(false);
                this.alertService.error(errors.error);
                this.ref.markForCheck();
            }
        );
    }

}
