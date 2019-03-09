import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // ?
import { FormsModule } from '@angular/forms'; // ?
import { AlertModule } from '../alert/alert.module';
import { PostListComponent } from './post-list.component';
import { PostEditComponent } from './post-edit.component';
import { PostCreateComponent } from './post-create.component';
import { PostService } from './post.service';
import { PostRoutingModule } from './post-routing';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PostRoutingModule,
        ReactiveFormsModule,
        AlertModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })        
    ],
    declarations: [
        PostListComponent,
        PostEditComponent,
        PostCreateComponent
    ],
    providers: [
        PostService
    ]
})
export class PostModule {}
