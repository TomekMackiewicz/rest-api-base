import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ItemModule } from './item/item.module';
import { AppRoutingModule } from './routing/app-routing.module';
import { AlertModule } from './alert/alert.module';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { PageNotFoundComponent } from './404/page-not-found.component';

import { LoaderService } from './services/loader.service';
///import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    FooterComponent,
    PageNotFoundComponent
  ],
  imports: [
    HttpModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AlertModule,
    ItemModule
  ],
  providers: [
    LoaderService,
    ///AuthGuard  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
