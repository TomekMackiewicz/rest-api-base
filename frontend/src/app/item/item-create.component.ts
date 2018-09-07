import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

    constructor(
        private itemService: ItemService,
        private alertService: AlertService,
        private loaderService: LoaderService,
        private errorService: ErrorService,
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
            errors => {
                console.log(JSON.stringify(errors.error));
//var resultArray = Object.keys(errors.error).map(function(personNamedIndex){
//    let person = errors.error[personNamedIndex];
//    // do something with person
//    return person;
//});             
//console.log(resultArray);   
                var dupa = this.errorService.convertError(errors.error);
                //console.log(errors.error);
//                var test = '';
//                Object.entries(errors.error).forEach(
//                  ([key, value]) => test = test+value[0]+'. '
//                );  
                //console.log(dupa);                              
                //console.log(errors.error);//this.item.signature = value[0];
                this.loaderService.displayLoader(false);
                this.alertService.error("Error saving item! " + errors.error);
                this.ref.markForCheck();
                return Observable.throw(errors);
            }
        );
    }

}

