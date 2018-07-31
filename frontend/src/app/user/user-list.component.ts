import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { UserService } from './user.service';
import { LoaderService } from '../services/loader.service';
import { AlertService } from '../alert/alert.service';

@Component({
    selector: 'user-list',
    templateUrl: './user-list.component.html'  
})

export class UserListComponent implements OnInit {

    public users: Array<Object>;

    constructor(
        private userService: UserService,
        private loaderService: LoaderService,
        private alertService: AlertService,
        private ref: ChangeDetectorRef
    ) {}

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
                this.alertService.error("Error loading users! " + error);
                this.loaderService.displayLoader(false);
                this.ref.detectChanges();
                return Observable.throw(error);
            }
        );
    }

    deleteUser(user: any) {
        if (confirm("Are you sure you want to delete user " + user.username + "?")) {
            this.loaderService.displayLoader(true);
            this.userService.deleteUser(user).subscribe(
                data => {
                    this.getUsers();
                    this.loaderService.displayLoader(false); // potrzebne tu?
                    this.ref.markForCheck(); // potrzebne tu?
                    this.alertService.success("User deleted.");
                },
                error => {
                    this.loaderService.displayLoader(false);
                    this.ref.markForCheck();                    
                    this.alertService.error("Error deleting user! " + error);
                    return Observable.throw(error);
                }
            );
        }
    }

}