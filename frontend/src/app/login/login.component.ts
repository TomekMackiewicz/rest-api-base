import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AlertService } from '../alert/alert.service';
import { AuthenticationService } from '../services/authentication.service';
import { LoaderService } from '../services/loader.service';
import * as decode from 'jwt-decode';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',       
})

export class LoginComponent implements OnInit {
    model: any = {};
    returnUrl: string;
    private subject = new Subject<any>();
    
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
                let token = data.token;
                if (token) {
                    localStorage.setItem('token', token);
                    localStorage.setItem('currentUsername', decode(token).username);
                    localStorage.setItem('userId', decode(token).userId);
                    this.subject.next(localStorage.getItem('currentUsername'));
                }                
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
