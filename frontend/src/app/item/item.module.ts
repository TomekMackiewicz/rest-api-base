import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // ?
import { FormsModule } from '@angular/forms'; // ?
///import { DataTablesModule } from 'angular-datatables';
import { AlertModule } from '../alert/alert.module';
import { ItemListComponent } from './item-list.component';
import { ItemEditComponent } from './item-edit.component';
import { ItemCreateComponent } from './item-create.component';
import { ItemService } from './item.service';
import { ItemRoutingModule } from './item-routing';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ItemRoutingModule,
        ///DataTablesModule,
        AlertModule
    ],
    declarations: [
        ItemListComponent,
        ItemEditComponent,
        ItemCreateComponent
    ],
    providers: [
        ItemService
    ]
})
export class ItemModule {}
