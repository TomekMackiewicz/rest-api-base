import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { UserListComponent } from './user-list.component';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';

const userRoutes: Routes = [
    { path: 'admin', 
        children: [           
            {
                path: 'users', 
                component: UserListComponent,
                data: { 
                    animation: { value: 'user-list' }
                }                
            },            
        ],        
        canActivate: [ AuthGuard ]
    }   
];

@NgModule({
    imports: [
        RouterModule.forChild(userRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class UserRoutingModule {}

