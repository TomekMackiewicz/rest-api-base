import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { 
    MatSidenavModule,
    MatToolbarModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        MatSidenavModule,
        MatToolbarModule,
        BrowserAnimationsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
