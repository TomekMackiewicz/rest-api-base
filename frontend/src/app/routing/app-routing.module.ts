import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from '../404/page-not-found.component';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';
import { LoginComponent } from '../login/login.component';
import { LogoutComponent } from '../logout/logout.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { ResetPasswordComponent } from '../password-reset/reset-password.component';
import { ConfirmResetPasswordComponent } from '../password-reset-confirm/reset-password-confirm.component';
import { RegisterComponent } from '../register/register.component';
import { ProfileComponent } from '../profile/profile.component';
import { ProfileEditComponent } from '../profile/profile-edit.component';
import { AuthGuard } from '../guards/auth.guard';
import { AccessDeniedComponent } from '../denied/denied.component';
import { FileComponent } from '../file/file.component';
import { AboutComponent } from '../front/about/about.component';
import { ContactComponent } from '../front/contact/contact.component';

const routes: Routes = [
    {path: 'about', 
        component: AboutComponent                      
    },
    {path: 'contact', 
        component: ContactComponent                      
    },    
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
    {path: 'reset-password', 
        component: ResetPasswordComponent,
        data: {
            animation: {
                value: 'reset-password',
            }
        }                
    },
    { path: 'confirm-reset-password/:token', 
        component: ConfirmResetPasswordComponent,
        data: {
            animation: {
                value: 'confirm-reset-password',
            }
        }  
    },     
    {path: 'user/profile', 
        component: ProfileComponent,
        data: {
            animation: {
                value: 'profile',
            }
        }                
    },
    {path: 'user/profile/edit/:id', 
        component: ProfileEditComponent,
        data: {
            animation: {
                value: 'profile',
            }
        }                
    },         
    {path: 'user/change-password', 
        component: ChangePasswordComponent,
        data: {
            animation: {
                value: 'change-password',
            }
        },          
        canActivate: [AuthGuard]                
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
        children:[
            {path: 'files', component: FileComponent}                
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
