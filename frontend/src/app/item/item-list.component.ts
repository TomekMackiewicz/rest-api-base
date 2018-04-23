import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ItemService } from './item.service';
import { LoaderService } from '../services/loader.service';
import { AlertService } from '../alert/alert.service';

@Component({
    selector: 'item-list',
    templateUrl: './item-list.component.html'  
})

export class ItemListComponent implements OnInit {

    public items: Array<Object>;

    constructor(
        private itemService: ItemService,
        private loaderService: LoaderService,
        private alertService: AlertService,
        private ref: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.getItems();
    }

    getItems() {
        this.loaderService.displayLoader(true);
        this.itemService.getItems().subscribe(
            data => {
                this.items = data;
                this.loaderService.displayLoader(false);
                this.ref.detectChanges();
            },
            error => {
                this.alertService.error("Error loading items! " + error);
                this.loaderService.displayLoader(false);
                this.ref.detectChanges();
                return Observable.throw(error);
            }
        );
    }

    deleteItem(item: any) {
        if (confirm("Are you sure you want to delete " + item.signature + "?")) {
            this.loaderService.displayLoader(true);
            this.itemService.deleteItem(item).subscribe(
                data => {
                    this.getItems();
                    this.loaderService.displayLoader(false); // potrzebne tu?
                    this.ref.markForCheck(); // potrzebne tu?
                    this.alertService.success("Item deleted.");
                },
                error => {
                    this.loaderService.displayLoader(false);
                    this.ref.markForCheck();                    
                    this.alertService.error("Error deleting item! " + error);
                    return Observable.throw(error);
                }
            );
        }
    }

}
