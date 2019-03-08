import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { 
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        MatSidenavModule,
        MatToolbarModule,
        MatIconModule,
        FlexLayoutModule,
        BrowserAnimationsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
