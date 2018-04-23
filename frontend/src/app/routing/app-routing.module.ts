import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
///import { AuthGuard } from '../guards/auth.guard';
import { PageNotFoundComponent } from '../404/page-not-found.component';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';

const routes: Routes = [
    {path: '', 
        children:[
            {path: '', component: MenuComponent, outlet: 'header'},
            {path: '', component: FooterComponent, outlet: 'footer'},                
        ]   
    },
//    {path: '**', 
//        component: PageNotFoundComponent
//    }    
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}
