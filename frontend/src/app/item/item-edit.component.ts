import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Rx';
import { ItemService } from './item.service';
import { AlertService } from '../alert/alert.service';
import { LoaderService } from '../services/loader.service';
import { Item } from './model/item';

@Component({
    selector: 'item-edit',
    templateUrl: './item-edit.component.html'    
})

export class ItemEditComponent implements OnInit {

    public item: Item;

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute,
        private location: Location,
        private alertService: AlertService,
        private loaderService: LoaderService,
        private ref: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.loaderService.displayLoader(true);
        this.route.params
            .switchMap((params: Params) => this.itemService.getItem(+params['id']))
            .subscribe(
                data => { 
                    this.loaderService.displayLoader(false);
                    this.item = data; 
                    this.ref.detectChanges();
                },
                error => {
                    this.loaderService.displayLoader(false);
                    this.alertService.error("Error loading item! " + error);
                    this.ref.detectChanges();
                    return Observable.throw(error);
                }                
            );
    }

    goBack(): void {
        this.location.back();
    }

    updateItem() {
        this.loaderService.displayLoader(true);
        this.itemService.updateItem(this.item).subscribe(
            data => {
                this.loaderService.displayLoader(false);
                this.alertService.success('Item updated.');
                this.ref.markForCheck();
            },
            error => {
                this.loaderService.displayLoader(false);
                this.alertService.error("Error updating item! " + error);
                this.ref.markForCheck();
                return Observable.throw(error);
            }
        );
    }

}
