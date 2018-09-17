import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../alert/alert.service';
import { ConfirmResetPasswordService } from './reset-password-confirm.service';
import { LoaderService } from '../services/loader.service';

@Component({
    selector: 'reset-password-confirm',
    templateUrl: './reset-password-confirm.component.html',       
})

export class ConfirmResetPasswordComponent {
    model: any = {};
    token: any;
    private sub: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private confirmResetPasswordService: ConfirmResetPasswordService,
        private alertService: AlertService,
        private loaderService: LoaderService,
        private ref: ChangeDetectorRef) {}

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
           this.token = params['token'];
        });       
    }

    confirmResetPassword() {
        this.loaderService.displayLoader(true);
        this.confirmResetPasswordService.submitPassword(
            this.token, 
            this.model.newPassword, 
            this.model.confirmPassword
        ).subscribe(
            (data: any) => {
                this.loaderService.displayLoader(false);
                this.alertService.success('Success', true);// zamienić na json response
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
