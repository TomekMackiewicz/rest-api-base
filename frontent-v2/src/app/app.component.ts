import { Component, ViewEncapsulation, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { trigger, animate, style, group, animateChild, query, stagger, transition } from '@angular/animations';
import { LoaderService } from './services/loader.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from "rxjs";
import * as jwt_decode from 'jwt-decode';
///import { AuthGuard } from './guards/auth.guard';

const fadeIn = [
    query(':leave', style({ position: 'relative', opacity: 1 }), { optional: true }),
    query(':enter', style({ position: 'absolute', opacity: 0 }), { optional: true }),
    group([
        query(':leave',
            animate('1s', style({ opacity: 0 })),
            { optional: true }),
        query(':enter',
            animate('1s 1s', style({ opacity: 1 })),
            { optional: true })
    ])
];

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('routerAnimations', [
            transition('* => *', fadeIn)
        ])
    ],    
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent implements OnInit, OnDestroy {

    //stateVal = 'slide';
    title = 'Main page';
    subscription: Subscription;
    username: string;    
    objLoaderStatus: boolean;
    isLoggedIn: boolean; // @FIXME - not needed? (logic moved to auth guard)
    isAdmin: boolean;
    opened: boolean = true;
    
    constructor(
        private translate: TranslateService,
        private loaderService: LoaderService,
        private authenticationService: AuthenticationService,
        private router: Router,
        ///private authGuard: AuthGuard
    ) {
        translate.addLangs(["pl", "en"]);
        translate.setDefaultLang('en');
        let browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/pl|en/) ? browserLang : 'en');        
        this.objLoaderStatus = false;
        this.isLoggedIn = false; // @FIXME - not needed? (logic moved to auth guard)
        this.isAdmin = false;        
        this.username = localStorage.getItem('currentUsername');
    }

    ngOnInit() {
        this.authenticationService.currentUsername.subscribe((val: string) => {
            this.username = localStorage.getItem('currentUsername') ? 
                localStorage.getItem('currentUsername') : val;
        });
        this.authenticationService.loggedIn.subscribe((val: boolean) => {
            this.isLoggedIn = 
                !this.isTokenExpired(localStorage.getItem('token')) 
                && localStorage.getItem('currentUsername') ? true : val;
        });
//        this.authGuard.loggedIn.subscribe((val: boolean) => {
//            this.isLoggedIn = !this.authGuard.isTokenExpired() && this.authGuard.isTokenSet();
//            console.log(this.isLoggedIn);
//        });        
        this.authenticationService.admin.subscribe((val: boolean) => {
            this.isAdmin = 
                localStorage.getItem('userRole') == 'ROLE_ADMIN' 
                || localStorage.getItem('userRole') == 'ROLE_SUPER_ADMIN' ? true : val;
        });
        this.loaderService.loaderStatus.subscribe((val: boolean) => {
            this.objLoaderStatus = val ? val : false;
        });      
    }

    getState(outlet: any) {
        return outlet.activatedRouteData.state;
    }

    getTokenExpirationDate(token: string): Date {
        var decoded: any = jwt_decode(token);
        
        if (decoded.exp === undefined) {
            return null;
        }
        
        const date = new Date(0); 
        date.setUTCSeconds(decoded.exp);
        
        return date;
    }

    isTokenExpired(token?: string): boolean {
        if(!token) {
            token = localStorage.getItem('token');
        }
        
        if(!token) {
            return true;
        }
        
        const date = this.getTokenExpirationDate(token);
        
        if(date === undefined) {
            return false;
        }
        
        return !(date.valueOf() > new Date().valueOf());
    }

    prepareRouteTransition(outlet: any) {
//        this.authGuard.loggedIn.subscribe((val: boolean) => {
//            this.isLoggedIn = !this.authGuard.isTokenExpired() && this.authGuard.isTokenSet();
//            console.log(this.isLoggedIn);
//        });         
        //console.log('ttt');
        const animation = outlet.activatedRouteData['animation'] || {};
        return animation['value'] || null;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
