import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Rx';
import { ItemService } from './item.service';
import { AlertService } from '../alert/alert.service';
import { LoaderService } from '../services/loader.service';
import { ErrorService } from '../services/error.service';
import { Item } from './model/item';

@Component({
    selector: 'item-create',
    templateUrl: './item-create.component.html'    
})

export class ItemCreateComponent implements OnInit {

    private item: Item;
    private signature: string = null;
    private status: number;
    private returnUrl: string;

    validation: any = {
        signature: <string> '',
        status: <string> '',
        signatureMsg: <string> '',
        statusMsg: <string> ''
    };

    constructor(
        private itemService: ItemService,
        private alertService: AlertService,
        private loaderService: LoaderService,
        private errorService: ErrorService,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private ref: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.item = new Item(this.signature, this.status);
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/items';        
    }

    goBack(): void {
        this.location.back();
    }

    createItem(signature: string, status: number) {         
        this.loaderService.displayLoader(true);
        this.errorService.nullErrors(this.validation);
        this.itemService.createItem(signature, status).subscribe(
            data => {
                this.errorService.nullErrors(this.validation);
                this.loaderService.displayLoader(false);
                this.alertService.success(data, true);
                this.router.navigate([this.returnUrl]);
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

