import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './user.service';
import { LoaderService } from '../services/loader.service';
import { AlertService } from '../alert/alert.service';

@Component({
    selector: 'user-list',
    templateUrl: './user-list.component.html'  
})

export class UserListComponent implements OnInit {

    private confirmDelete: string;
    public users: Array<Object>;

    constructor(
        private userService: UserService,
        private loaderService: LoaderService,
        private alertService: AlertService,
        private ref: ChangeDetectorRef,
        private translate: TranslateService
    ) {
        translate.stream('crud.delete_confirm').subscribe(
            (text: string) => { this.confirmDelete = text }
        );
    }

    ngOnInit() {
        this.getUsers();
    }

    getUsers() {
        this.loaderService.displayLoader(true);
        this.userService.getUsers().subscribe(
            (data: Object[]) => {
                this.users = data;
                this.loaderService.displayLoader(false);
                this.ref.detectChanges();
            },
            error => {
                this.alertService.error(error.error.message);
                this.loaderService.displayLoader(false);
                this.ref.detectChanges();
                return Observable.throw(error);
            }
        );
    }

    deleteUser(user: any) {
        if (confirm(this.confirmDelete + ' ' +  user.username + "?")) {
            this.loaderService.displayLoader(true);
            this.userService.deleteUser(user).subscribe(
                data => {
                    this.getUsers();
                    this.loaderService.displayLoader(false);
                    this.ref.markForCheck();
                    this.alertService.success(data);
                },
                error => {
                    this.loaderService.displayLoader(false);
                    this.ref.markForCheck();                    
                    this.alertService.error(error.error.message); // @fixme (translate)
                    return Observable.throw(error);
                }
            );
        }
    }
    
    toogleUserStatus(user: any) {
        user.enabled = user.enabled ? false : true;
        this.loaderService.displayLoader(true);
        this.userService.toogleUserStatus(user).subscribe(
            data => {
                this.getUsers();
                this.loaderService.displayLoader(false);
                this.ref.markForCheck();
                this.alertService.success(data);
            },
            error => {
                this.loaderService.displayLoader(false);
                this.ref.markForCheck();                    
                this.alertService.error(error.error.message); // @fixme (translate)
                return Observable.throw(error);
            }
        );
    }

}
