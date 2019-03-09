import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ConfirmResetPasswordService {

    constructor(private http: HttpClient) {}

    submitPassword(token: string, newPassword: string, confirmPassword: string) {
        return this.http.post(
            'http://localhost:8000/api/password/reset/confirm', { 
                token: token,
                plainPassword: {
                    first: newPassword,
                    second: confirmPassword
                }
            }
        ); 
    }
}
