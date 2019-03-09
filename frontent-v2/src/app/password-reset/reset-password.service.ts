import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ResetPasswordService {

    constructor(private http: HttpClient) {}

    resetPassword(username: string) {
        return this.http.post(
            'http://localhost:8000/api/password/reset/request', { 
                username: username
            }
        ); 
    }

}
