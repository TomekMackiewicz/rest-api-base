import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // ?
import { FormsModule } from '@angular/forms'; // ?
import { AlertModule } from '../alert/alert.module';
import { UserListComponent } from './user-list.component';
import { UserService } from './user.service';
import { UserRoutingModule } from './user-routing';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        UserRoutingModule,
        AlertModule
    ],
    declarations: [
        UserListComponent
    ],
    providers: [
        UserService
    ]
})
export class UserModule {}
