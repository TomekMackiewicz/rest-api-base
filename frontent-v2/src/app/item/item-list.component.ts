import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ItemService } from './item.service';
//import { LoaderService } from '../services/loader.service';
import { AlertService } from '../alert/alert.service';
import { Item } from './model/item';

@Component({
    selector: 'item-list',
    templateUrl: './item-list.component.html'  
})

export class ItemListComponent implements AfterViewInit {
    
    private confirmDelete: string;
    private page: number = 1;
    perPage: number = 10;
    private total: number = 0;
    public items: Array<Item>;
    displayedColumns: string[] = ['select', 'signature', 'status'];
    isLoadingResults = true;
    
    dataSource: MatTableDataSource<Item>;
    selection = new SelectionModel<Item>(true, []);
    
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
          
    constructor(
        private itemService: ItemService,
        //private loaderService: LoaderService,
        private alertService: AlertService,
        private ref: ChangeDetectorRef,
        private translate: TranslateService
    ) {
        translate.stream('crud.delete_confirm').subscribe(
            (text: string) => { this.confirmDelete = text }
        );               
    }

    ngAfterViewInit() {            
        this.sort.sortChange.subscribe(() => {
            this.paginator.pageIndex = 0;
            this.getItems(); 
        });
        this.getItems(); 
    }    

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }    
            
    pageChanged(event) {
        this.page = event.pageIndex+1;
        this.perPage = event.pageSize;
        this.getItems();
      }       

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        if (this.paginator) {
            this.paginator.firstPage();
        }        
    }      
          
    getItems() {
        this.itemService.getItems(this.sort.active, this.sort.direction, this.page, this.perPage).subscribe(
            (data: any) => {
                this.items = data.items;
                this.total = data.total;
                this.dataSource = new MatTableDataSource(this.items);   
                this.isLoadingResults = false;
                this.ref.detectChanges();
            },
            error => {
                this.alertService.error(error.error.message); // @fixme (translate)
                this.isLoadingResults = false;
                this.ref.detectChanges();
                return Observable.throw(error);
            }
        );
    }

    test() {
        console.log(this.selection);
    }

    deleteItem(item: any) {  
        if (confirm(this.confirmDelete + ' ' + item.signature + "?")) {    
            //this.loaderService.displayLoader(true);
            this.itemService.deleteItem(item).subscribe(
                (data: string) => {
                    this.getItems();
                    //this.loaderService.displayLoader(false);
                    this.ref.markForCheck();
                    this.alertService.success(data, true);
                },
                error => {
                    //this.loaderService.displayLoader(false);
                    this.ref.markForCheck();                    
                    this.alertService.error(error.error.message); // @fixme (translate)
                    return Observable.throw(error);
                }
            );
        }
    }

}
