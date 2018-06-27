import { Component, ViewEncapsulation, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { trigger, animate, style, group, animateChild, query, stagger, transition } from '@angular/animations';
import { LoaderService } from './services/loader.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from "rxjs";

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
    currentUsername: string;
    subscription: Subscription;
    objLoaderStatus: boolean;
    isLoggedIn: BehaviorSubject<string>;

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
        this.objLoaderStatus = false;
        this.isLoggedIn = authenticationService.isLoggedIn();
        this.currentUsername = this.isLoggedIn.getValue();
    }

    ngOnInit() {
        this.loaderService.loaderStatus.subscribe((val: boolean) => {
            this.objLoaderStatus = val;
        });        
    }

    getState(outlet: any) {
        return outlet.activatedRouteData.state;
    }

    prepareRouteTransition(outlet: any) {
        const animation = outlet.activatedRouteData['animation'] || {};
        return animation['value'] || null;
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
