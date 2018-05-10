import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Rx';
import { ItemService } from './item.service';
import { AlertService } from '../alert/alert.service';
import { LoaderService } from '../services/loader.service';
import { Item } from './model/item';

@Component({
    selector: 'item-create',
    templateUrl: './item-create.component.html'    
})

export class ItemCreateComponent implements OnInit {

    private item: Item;
    private signature: string = null;

    constructor(
        private itemService: ItemService,
        private alertService: AlertService,
        private loaderService: LoaderService,
        private route: ActivatedRoute,
        private location: Location,
        private ref: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.item = new Item(this.signature);        
    }

    goBack(): void {
        this.location.back();
    }

    createItem(signature: any) { // ?
        this.loaderService.displayLoader(true);
        this.itemService.createItem(this.item).subscribe(
            data => {
                this.loaderService.displayLoader(false);
                this.alertService.success('Item created.');
                this.ref.markForCheck();
            },
            error => {
                this.loaderService.displayLoader(false);
                this.alertService.error("Error saving item! " + error);
                this.ref.markForCheck();
                return Observable.throw(error);
            }
        );
    }

}

