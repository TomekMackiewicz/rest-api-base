import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // ?
import { FormsModule } from '@angular/forms'; // ?
import { AlertModule } from '../alert/alert.module';
import { ItemListComponent } from './item-list.component';
import { ItemEditComponent } from './item-edit.component';
import { ItemCreateComponent } from './item-create.component';
import { ItemService } from './item.service';
import { ItemRoutingModule } from './item-routing';
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
        ItemRoutingModule,
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
        ItemListComponent,
        ItemEditComponent,
        ItemCreateComponent
    ],
    providers: [
        ItemService
    ]
})
export class ItemModule {}
