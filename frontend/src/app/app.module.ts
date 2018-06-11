import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule, Http } from '@angular/http'; //change to common?
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ItemModule } from './item/item.module';
import { AppRoutingModule } from './routing/app-routing.module';
import { AlertModule } from './alert/alert.module';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { PageNotFoundComponent } from './404/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { AccessDeniedComponent } from './denied/denied.component';

import { LoaderService } from './services/loader.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthenticationService } from './services/authentication.service';

import { EqualValidator } from './shared/validate-equal.directive';
import { PatternValidator } from './shared/pattern-validator.directive';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './services/token-interceptor'

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
    declarations: [
        AppComponent,
        MenuComponent,
        FooterComponent,
        PageNotFoundComponent,
        LoginComponent,
        LogoutComponent,
        ChangePasswordComponent,
        RegisterComponent,
        ProfileComponent,
        AccessDeniedComponent,
        EqualValidator,
        PatternValidator     
  ],
  imports: [
        HttpClientModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,        
        BrowserModule,
        BrowserAnimationsModule,
        ItemModule,
        AppRoutingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),    
        AlertModule    
  ],
  providers: [
        AuthGuard,
        AuthenticationService,
        LoaderService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
