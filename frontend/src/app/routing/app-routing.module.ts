import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
///import { AuthGuard } from '../guards/auth.guard';
import { PageNotFoundComponent } from '../404/page-not-found.component';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { LoginComponent } from '../login/login.component';
import { LogoutComponent } from '../logout/logout.component';
import { ItemListComponent } from '../item/item-list.component';
import { AuthGuard } from '../guards/auth.guard';
import { AccessDeniedComponent } from '../denied/denied.component';

const routes: Routes = [
    {path: 'login', 
        component: LoginComponent,
        data: {
            animation: {
                value: 'login',
            }
        }                       
    },
    {path: 'logout', 
        component: LogoutComponent,
        data: {
            animation: {
                value: 'logout',
            }
        }                
    },
    {path: 'admin', 
        children: [
            { 
                path: 'items', 
                component: ItemListComponent, 
                data: { 
                    animation: { value: 'items' }
                }
            },               
        ],         
        canActivate: [AuthGuard]        
    },
    {path: '', 
        children:[
            {path: '', component: MenuComponent, outlet: 'header'},
            {path: '', component: FooterComponent, outlet: 'footer'},                
        ]   
    },
    {path: 'denied', 
        component: AccessDeniedComponent
    },    
    {path: '**', 
        component: PageNotFoundComponent
    }        
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}
