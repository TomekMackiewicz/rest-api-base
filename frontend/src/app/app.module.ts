import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, Http } from '@angular/http'; //change to common?
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TokenInterceptor } from './services/token-interceptor';
import { ItemModule } from './item/item.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { AppRoutingModule } from './routing/app-routing.module';
import { AlertModule } from './alert/alert.module'; 

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { FooterComponent } from './footer/footer.component';
import { PageNotFoundComponent } from './404/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ResetPasswordComponent } from './password-reset/reset-password.component';
import { ConfirmResetPasswordComponent } from './password-reset-confirm/reset-password-confirm.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileEditComponent } from './profile/profile-edit.component';
import { AccessDeniedComponent } from './denied/denied.component';

import { LoaderService } from './services/loader.service';
import { ErrorService } from './services/error.service';
import { AuthGuard } from './guards/auth.guard';
import { AuthenticationService } from './services/authentication.service';
import { ChangePasswordService } from './change-password/change-password.service';
import { ResetPasswordService } from './password-reset/reset-password.service';
import { ConfirmResetPasswordService } from './password-reset-confirm/reset-password-confirm.service';
import { UserService } from './services/user.service'; // a ta w folderze user???
import { ProfileService } from './profile/profile.service';

import { EqualValidator } from './shared/validate-equal.directive';
import { PatternValidator } from './shared/pattern-validator.directive';

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
        ResetPasswordComponent,
        ConfirmResetPasswordComponent,
        RegisterComponent,
        ProfileComponent,
        ProfileEditComponent,
        AccessDeniedComponent,
        EqualValidator,
        PatternValidator     
  ],
  imports: [        
        HttpModule,
        FormsModule,
        ReactiveFormsModule,        
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ItemModule,
        PostModule,
        UserModule,
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
        ErrorService,
        UserService,
        ProfileService,
        ChangePasswordService,
        ResetPasswordService,
        ConfirmResetPasswordService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
