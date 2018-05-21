import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
///import { AuthGuard } from '../guards/auth.guard';
import { PageNotFoundComponent } from '../404/page-not-found.component';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { LoginComponent } from '../login/login.component';
import { LogoutComponent } from '../logout/logout.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { RegisterComponent } from '../register/register.component';
//import { ItemListComponent } from '../item/item-list.component';
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
    {path: 'change-password', 
        component: ChangePasswordComponent,
        data: {
            animation: {
                value: 'change-password',
            }
        }                
    },
    {path: 'register', 
        component: RegisterComponent,
        data: {
            animation: {
                value: 'register',
            }
        }                
    },         
    {path: 'admin',
        redirectTo: '/admin/items',          
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
