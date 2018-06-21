import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ChangePasswordService {

    constructor(private http: HttpClient) {}

    changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
        return this.http.post(
            'http://localhost:8000/api/password/1/change', { 
                current_password: currentPassword,
                plainPassword: {
                    first: newPassword,
                    second: confirmPassword
                }
            }
        ); 
    }

}
