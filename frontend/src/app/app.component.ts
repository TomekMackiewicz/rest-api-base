import { Component, ViewEncapsulation, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthenticationService } from './services/authentication.service';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { trigger, animate, style, group, animateChild, query, stagger, transition } from '@angular/animations';
import { LoaderService } from './services/loader.service';
import { TranslateService } from '@ngx-translate/core';
import { NgForm } from '@angular/forms';

const slide = [
    query(':enter, :leave', style({ position: 'fixed', width:'100%' }), { optional: true }),
    group([
        query(':enter', [
            style({ transform: 'translateX(100%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
        ], { optional: true }),
        query(':leave', [
            style({ transform: 'translateX(0%)' }),
            animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))
        ], { optional: true }),
    ])
];

const fadeIn = [
    query(':leave', style({ position: 'absolute', left: 0, right: 0, opacity: 1 }), { optional: true }),
    query(':enter', style({ position: 'absolute', left: 0, right: 0, opacity: 0 }), { optional: true }),
    group([
        query(':leave',
            animate('.4s', style({ opacity: 0 })),
            { optional: true }),
        query(':enter',
            animate('.4s .4s', style({ opacity: 1 })),
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
    username: any;
    subscription: Subscription;
    objLoaderStatus: boolean;

    constructor(
        private translate: TranslateService,
        private loaderService: LoaderService,
        private authenticationService: AuthenticationService,
        private router: Router
    ) {
        translate.addLangs(["pl", "en", "uk"]);
        translate.setDefaultLang('pl');
        let browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/pl|en/) ? browserLang : 'pl');            
        //this.username = localStorage.getItem('currentUsername');
        //this.username = this.authGuard.isLogged();        
        this.objLoaderStatus = false;
    }

    ngOnInit() {        
        //this.authenticationService.getUsername().subscribe(currentUsername => this.username = currentUsername);
        this.loaderService.loaderStatus.subscribe((val: boolean) => {
            this.objLoaderStatus = val;
        });        
    }

    getState(outlet) {
        return outlet.activatedRouteData.state;
    }

    prepareRouteTransition(outlet) {
        const animation = outlet.activatedRouteData['animation'] || {};
        return animation['value'] || null;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
