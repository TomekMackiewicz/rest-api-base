import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';
import { ItemService } from './item.service';
//import { LoaderService } from '../services/loader.service';
import { AlertService } from '../alert/alert.service';
import {MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
    selector: 'item-list',
    templateUrl: './item-list.component.html'  
})

export class ItemListComponent implements OnInit, AfterViewInit {
    
    private confirmDelete: string;
    private page: number = 1;
    private total: number;
    public items: Array<Object>;
    displayedColumns: string[] = ['signature', 'status'];
    isLoadingResults = true;
    order: string = 'desc';
    
    private paginator: MatPaginator;
    private sort: MatSort;
    dataSource: any;
        
//    @ViewChild(MatSort) set matSort(ms: MatSort) {
//      this.sort = ms;
//      this.setDataSourceAttributes();
//    }
//
//    @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
//      this.paginator = mp;
//      this.setDataSourceAttributes();
//    }
//
//    setDataSourceAttributes() {
//      this.dataSource.paginator = this.paginator;
//      this.dataSource.sort = this.sort;
//
//  //    if (this.paginator && this.sort) {
//  //      this.applyFilter('');
//  //    }
//    }
  
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

    ngOnInit() {        
    }

    ngAfterViewInit() {
        //this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        this.getItems();        
    }    
        
    pageChanged(event) {
        console.log(event);
        this.page = event.pageIndex+1;
        this.getItems();
      }       

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }      
          
    getItems() {
        this.itemService.getItems(this.sort, this.order, this.page).subscribe(
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
