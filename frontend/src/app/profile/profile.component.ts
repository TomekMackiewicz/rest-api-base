import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Rx';
import { AlertService } from '../alert/alert.service';
import { LoaderService } from '../services/loader.service';
import { UserService } from '../services/user.service';
import { User } from './model/user';

@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',       
})

export class ProfileComponent implements OnInit {
    
    public user: User;
    
    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private alertService: AlertService,
        private loaderService: LoaderService,
        private ref: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.loaderService.displayLoader(true);
        this.userService.getUser(parseInt(localStorage.getItem('userId')))
            .subscribe(
                (data: User) => { 
                    this.loaderService.displayLoader(false);
                    this.user = data; 
                    this.ref.detectChanges();
                },
                error => {
                    this.loaderService.displayLoader(false);
                    this.alertService.error("Error loading user profile! " + error);
                    this.ref.detectChanges();
                    return Observable.throw(error);
                }                
            );
    }

}
