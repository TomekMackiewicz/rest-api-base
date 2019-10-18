import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { ItemListComponent } from './item-list.component';
import { ItemEditComponent } from './item-edit.component';
import { ItemCreateComponent } from './item-create.component';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';

const itemRoutes: Routes = [
    { path: 'admin', 
        children: [
            { path: 'items/create', component: ItemCreateComponent },
            { path: 'items/:id', component: ItemEditComponent },
            {
                path: 'items', 
                component: ItemListComponent,
                data: { 
                    animation: { value: 'item-list' }
                }                
            },            
        ],        
        canActivate: [ AuthGuard ]
    }   
];

@NgModule({
    imports: [
        RouterModule.forChild(itemRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class ItemRoutingModule {}

