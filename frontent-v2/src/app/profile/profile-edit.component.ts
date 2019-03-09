import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs';
import { AlertService } from '../alert/alert.service';
import { LoaderService } from '../services/loader.service';
import { ProfileService } from './profile.service';
import { ErrorService } from '../services/error.service';
import { User } from '../user/model/user';

@Component({
    selector: 'profile-edit',
    templateUrl: './profile-edit.component.html',       
})

export class ProfileEditComponent implements OnInit {
    
    public user: User;

    validation: any = {
        email: <string> '',
        currentPassword: <string> '',
        emailMsg: <string> '',
        currentPasswordMsg: <string> ''
    };    
        
    constructor(
        private profileService: ProfileService,
        private route: ActivatedRoute,
        private location: Location,
        private alertService: AlertService,
        private loaderService: LoaderService,
        private errorService: ErrorService,
        private ref: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.loaderService.displayLoader(true);
        this.profileService.getUser(parseInt(localStorage.getItem('userId')))
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
    
    goBack(): void {
        this.location.back();
    }

    updateProfile() {
        this.loaderService.displayLoader(true);
        this.errorService.nullErrors(this.validation);
        this.profileService.patchUser(this.user).subscribe(
            (data: string) => {
                console.log(data);
                this.errorService.nullErrors(this.validation);
                this.loaderService.displayLoader(false);
                this.alertService.success(data, true);
                this.ref.markForCheck();
            },
            errors => {
                console.log(errors.error);
                this.errorService.handleErrors(this.validation, errors.error);
                this.loaderService.displayLoader(false);
                this.ref.markForCheck();
                
                return Observable.throw(errors);
            }
        );
    }    

}

