import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProfileService {

    constructor(private http: HttpClient) {}

    getUser(id: number) {
        return this.http.get('http://localhost:8000/api/profile/' + id);
    }

    patchUser(user: any) {
        return this.http.patch('http://localhost:8000/api/profile/' + user.id, { 
            email: user.email,
            current_password: user.currentPassword
        });
    }
}
