import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { 
    MatCardModule, 
    MatProgressSpinnerModule, 
    MatMenuModule, 
    MatButtonModule, 
    MatDividerModule, 
    MatIconModule, 
    MatExpansionModule, 
    MatListModule, 
    MatToolbarModule, 
    MatButtonToggleModule,
    MatRippleModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule
} from '@angular/material';
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
import { AboutComponent } from './front/about/about.component';
import { ContactComponent } from './front/contact/contact.component';

import { LoaderService } from './services/loader.service';
import { ErrorService } from './services/error.service';
//import { ErrorMatcher } from './services/error-matcher';
import { AuthGuard } from './guards/auth.guard';
import { AuthenticationService } from './services/authentication.service';
import { ChangePasswordService } from './change-password/change-password.service';
import { ResetPasswordService } from './password-reset/reset-password.service';
import { ConfirmResetPasswordService } from './password-reset-confirm/reset-password-confirm.service';
import { UserService } from './services/user.service'; // a ta w folderze user???
import { ProfileService } from './profile/profile.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EqualValidator } from './shared/validate-equal.directive';
import { PatternValidator } from './shared/pattern-validator.directive';

import { FileService } from './file-explorer/file.service';
import { FileExplorerModule } from './file-explorer/file-explorer.module';
import { FileComponent } from './file/file.component';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
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
        FileComponent,
        EqualValidator,
        PatternValidator,
        AboutComponent,
        ContactComponent    
  ],
  imports: [
        FormsModule,
        ReactiveFormsModule,        
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatProgressSpinnerModule,
        FlexLayoutModule,
        ItemModule,
        PostModule,
        UserModule,
        FileExplorerModule,
        AppRoutingModule,
        MatMenuModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatExpansionModule,
        MatListModule,
        MatToolbarModule,
        MatButtonToggleModule,
        MatRippleModule,
        MatSidenavModule,
        MatFormFieldModule,
        MatInputModule,
        MatChipsModule,      
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
        FileService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true
        }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
