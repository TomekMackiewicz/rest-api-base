import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Rx';
import { ItemService } from './item.service';
import { AlertService } from '../alert/alert.service';
import { LoaderService } from '../services/loader.service';
import { ErrorService } from '../services/error.service';
import { Item } from './model/item';

@Component({
    selector: 'item-edit',
    templateUrl: './item-edit.component.html'    
})

export class ItemEditComponent implements OnInit {

    private item: Item;

    validation: any = {
        signature: <string> '',
        status: <string> '',
        signatureMsg: <string> '',
        statusMsg: <string> ''
    };

    constructor(
        private itemService: ItemService,
        private route: ActivatedRoute,
        private location: Location,
        private alertService: AlertService,
        private loaderService: LoaderService,
        private errorService: ErrorService,
        private ref: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.loaderService.displayLoader(true);
        this.route.params
            .switchMap((params: Params) => this.itemService.getItem(+params['id']))
            .subscribe(
                (data: Item) => { 
                    this.loaderService.displayLoader(false);
                    this.item = data; 
                    this.ref.detectChanges();
                },
                error => {
                    this.loaderService.displayLoader(false);
                    this.alertService.error(error.error.message);
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
        this.errorService.nullErrors(this.validation);
        this.itemService.updateItem(this.item).subscribe(
            (data: string) => {
                this.errorService.nullErrors(this.validation);
                this.loaderService.displayLoader(false);
                this.alertService.success(data, true);
                this.ref.markForCheck();
            },
            errors => {
                this.errorService.handleErrors(this.validation, errors.error);
                this.loaderService.displayLoader(false);
                this.ref.markForCheck();
                
                return Observable.throw(errors);
            }
        );
    }

}
