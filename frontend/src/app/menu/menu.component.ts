import { Component, ChangeDetectorRef } from '@angular/core';
import { AlertService } from '../alert/alert.service';
import { LoaderService } from '../services/loader.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})

export class MenuComponent {

    constructor(
        private alertService: AlertService,
        private loaderService: LoaderService,
        private ref: ChangeDetectorRef
    ) {}

    ngOnInit() {}

}
