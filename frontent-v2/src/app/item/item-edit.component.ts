import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ItemService } from './item.service';
import { AlertService } from '../alert/alert.service';
import { LoaderService } from '../services/loader.service';
import { Item } from './model/item';

@Component({
    selector: 'item-edit',
    templateUrl: './item-edit.component.html'    
})

export class ItemEditComponent implements OnInit {

    item: Item;

    itemForm = this.fb.group({
        id: [''],
        signature: new FormControl('', [Validators.required, Validators.maxLength(32)]),
        status: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
        last_action: ['']
    });

    constructor(
        private fb: FormBuilder,
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
                (data: Item) => {
                    this.loaderService.displayLoader(false);
                    this.itemForm.controls['signature'].setAsyncValidators(this.uniquenessValidator(this.itemService, data.id));
                    data.last_action = new Date();
                    this.item = data;
                    this.itemForm.setValue(data);
                    this.ref.detectChanges();
                },
                error => {
                    this.loaderService.displayLoader(false);
                    this.alertService.error(error.error.message);
                    this.ref.detectChanges();
                }                
            );
    }

    uniquenessValidator(itemService, id: number) {
        return (control: AbstractControl) => {
            return itemService.getItem(id).map(res => {
                return res.item ? null : { duplicated: true };
            });
        }
    }

    getSignatureErrorMessage() {          
        return this.itemForm.get('signature').hasError('required') ? 'form.required' :
               this.itemForm.get('signature').hasError('maxlength') ? 'form.validation.field.too_long' :
               this.itemForm.get('signature').hasError('duplicated') ? 'crud.duplicated' : '';
    }
    
    getStatusErrorMessage() {
        return this.itemForm.get('status').hasError('required') ? 'form.required' :
               this.itemForm.get('status').hasError('pattern') ? 'form.validation.digits' : '';        
    }
  
    goBack(): void {
        this.location.back();
    }

    updateItem() {
        this.loaderService.displayLoader(true);
        this.itemService.updateItem(this.itemForm.value).subscribe(
            (data: string) => {
                this.loaderService.displayLoader(false);
                this.alertService.success(data, true);
                this.ref.markForCheck();
            },
            error => {
                this.alertService.error(error.error);
                this.loaderService.displayLoader(false);
                this.ref.markForCheck();
            }
        );
    }
}
