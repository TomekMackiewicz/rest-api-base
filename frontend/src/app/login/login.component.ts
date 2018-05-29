import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../alert/alert.service';
import { AuthenticationService } from '../services/authentication.service';
import { LoaderService } from '../services/loader.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',       
})

export class LoginComponent implements OnInit {
    model: any = {};
    returnUrl: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private loaderService: LoaderService,
        private ref: ChangeDetectorRef) {}

    ngOnInit() {
        this.authenticationService.logout();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/items';
    }

    login() {
        this.loaderService.displayLoader(true);
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
            data => {
                this.router.navigate([this.returnUrl]);
                this.loaderService.displayLoader(false);
                this.ref.markForCheck();
            },
            error => {
                this.alertService.error(error);
                this.loaderService.displayLoader(false);
                this.ref.markForCheck();
            });
    }

}
