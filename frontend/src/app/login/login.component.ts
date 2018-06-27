import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',       
})

export class LoginComponent implements OnInit {
    
    model: any = {};
    
    constructor(
        private authenticationService: AuthenticationService,
        private ref: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.authenticationService.logout();
    }

    login() {
        this.authenticationService.login(this.model.username, this.model.password);
        this.ref.markForCheck();
    }

}
