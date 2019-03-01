import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import * as decode from 'jwt-decode';
import { Router, ActivatedRoute } from '@angular/router';
import { LoaderService } from '../services/loader.service';

@Injectable()
export class AuthenticationService {

    private adminUrl = this.route.snapshot.queryParams['adminUrl'] || '/admin/items';
    private userUrl = this.route.snapshot.queryParams['userUrl'] || '/user/profile';
    public currentUsername: BehaviorSubject<string> = new BehaviorSubject<string>('');
    public admin: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    loginError: EventEmitter<any> = new EventEmitter();
    
    getUsername(value: string) {
        this.currentUsername.next(value);
    }  

    isAdmin(value: boolean) {
        this.admin.next(value);
    }

    isLoggedIn(value: boolean) {
        this.loggedIn.next(value);
    }
                
    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
        private router: Router,
        private loaderService: LoaderService           
    ) {};
       
    login(username: string, password: string) {
        this.loaderService.displayLoader(true); 
        return this.http.post<any>('http://localhost:8000/api/login_check', { 
            username: username, 
            password: password
        }).subscribe(
            data => {
                var token: any = decode(data.token);
                if (token) {                
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('currentUsername', token.username);
                    localStorage.setItem('userId', token.userId);
                    localStorage.setItem('userRole', token.roles[0]);                    
                    this.getUsername(localStorage.getItem('currentUsername'));
                    this.isLoggedIn(true);
                    if (token.roles[0] == 'ROLE_ADMIN' || token.roles[0] == 'ROLE_SUPER_ADMIN') {
                        this.isAdmin(true);
                        this.router.navigate([this.adminUrl]);
                    } else {
                        this.router.navigate([this.userUrl]);
                    }                
                }                
                this.loaderService.displayLoader(false);
            },
            error => {
                 this.loaderService.displayLoader(false);
                 this.loginError.emit(error.error);
            }
        );
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUsername');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        this.isLoggedIn(false);
        this.isAdmin(false);
        this.getUsername('');
    }
        
    register(email: string, username: string, password: string, confirmPassword: string) {
        return this.http.post('http://localhost:8000/api/register', { 
            email: email, 
            username: username, 
            plainPassword: {
                first: password,
                second: confirmPassword
            } 
        }).catch((error) => {
            return Observable.throw(error)
        });               
    }       
}

