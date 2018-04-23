import { Component, ChangeDetectorRef } from '@angular/core';
import { ItemService } from '../item/item.service';
import { AlertService } from '../alert/alert.service';
import { LoaderService } from '../services/loader.service';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})

export class MenuComponent {

    public categories: any;
    public forms: any;

    constructor(
        private categoriesService: ItemService,
        private alertService: AlertService,
        private loaderService: LoaderService,
        private ref: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.loaderService.displayLoader(true);
        this.getCategories();
        this.loaderService.displayLoader(false);
    }

    getCategories() {
        this.categoriesService.getItems().subscribe(
            data => {
                this.categories = data;
                this.ref.detectChanges();
            },
            error => {
                this.alertService.error("Error loading categories! " + error);
                this.ref.detectChanges();
            }
        );
    }

}
