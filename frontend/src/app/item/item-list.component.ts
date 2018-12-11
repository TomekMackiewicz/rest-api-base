import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';
import { ItemService } from './item.service';
import { LoaderService } from '../services/loader.service';
import { AlertService } from '../alert/alert.service';

@Component({
    selector: 'item-list',
    templateUrl: './item-list.component.html'  
})

export class ItemListComponent implements OnInit {
    
    private confirmDelete: string;
    private page: number = 1;
    private total: number;
    public items: Array<Object>;
    
    constructor(
        private itemService: ItemService,
        private loaderService: LoaderService,
        private alertService: AlertService,
        private ref: ChangeDetectorRef,
        private translate: TranslateService
    ) {
        translate.stream('crud.delete_confirm').subscribe(
            (text: string) => { this.confirmDelete = text }
        );               
    }

    ngOnInit() {
        this.getItems();
    }

    pageChanged(event) {
        this.page = event;
        this.getItems();
    }

    getItems() {
        this.loaderService.displayLoader(true);
        this.itemService.getItems(this.page).subscribe(
            (data: any) => {
                this.items = data.items;
                this.total = data.total;
                this.loaderService.displayLoader(false);
                this.ref.detectChanges();
            },
            error => {
                this.alertService.error(error.error.message); // @fixme (translate)
                this.loaderService.displayLoader(false);
                this.ref.detectChanges();
                return Observable.throw(error);
            }
        );
    }

    deleteItem(item: any) {  
        if (confirm(this.confirmDelete + ' ' + item.signature + "?")) {    
            this.loaderService.displayLoader(true);
            this.itemService.deleteItem(item).subscribe(
                (data: string) => {
                    this.getItems();
                    this.loaderService.displayLoader(false);
                    this.ref.markForCheck();
                    this.alertService.success(data, true);
                },
                error => {
                    this.loaderService.displayLoader(false);
                    this.ref.markForCheck();                    
                    this.alertService.error(error.error.message); // @fixme (translate)
                    return Observable.throw(error);
                }
            );
        }
    }

}
