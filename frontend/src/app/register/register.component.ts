import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../alert/alert.service';
import { AuthenticationService } from '../services/authentication.service';
import { LoaderService } from '../services/loader.service';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',       
})

export class RegisterComponent {
    model: any = {};
    returnUrl: string;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private loaderService: LoaderService) {}

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/login';
    }

    register() {
        this.loaderService.displayLoader(true);
        this.authenticationService
            .register(
                this.model.email, 
                this.model.username, 
                this.model.password
            )
            .subscribe(
                data => {
                    this.loaderService.displayLoader(false);
                    this.alertService.success('Success');
                    //this.router.navigate([this.returnUrl]);                   
                },
                error => {
                    //console.log('dupa');
                    this.loaderService.displayLoader(false);
                    this.alertService.error(error);
                }
            );
    }
    
}
