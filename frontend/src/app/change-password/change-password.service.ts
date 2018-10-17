import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ChangePasswordService {

    constructor(private http: HttpClient) {}

    changePassword(currentPassword: string, newPassword: string, confirmPassword: string) {
        let userId = localStorage.getItem('userId');
        return this.http.patch(
            'http://localhost:8000/api/password/'+userId+'/change', { 
                current_password: currentPassword,
                plainPassword: {
                    first: newPassword,
                    second: confirmPassword
                }
            }
        ); 
    }

}
