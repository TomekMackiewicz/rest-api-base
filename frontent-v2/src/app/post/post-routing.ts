import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { PostListComponent } from './post-list.component';
import { PostEditComponent } from './post-edit.component';
import { PostCreateComponent } from './post-create.component';
import { MenuComponent } from '../menu/menu.component';
import { FooterComponent } from '../footer/footer.component';

const postRoutes: Routes = [
    { path: 'admin', 
        children: [
            { path: 'posts/create', component: PostCreateComponent },
            { path: 'posts/:id', component: PostEditComponent },           
            {
                path: 'posts', 
                component: PostListComponent,
                data: { 
                    animation: { value: 'post-list' }
                }                
            },            
        ],        
        canActivate: [ AuthGuard ]
    }   
];

@NgModule({
    imports: [
        RouterModule.forChild(postRoutes)
    ],
    exports: [
        RouterModule
    ]
})

export class PostRoutingModule {}

