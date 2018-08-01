import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {

    constructor(private http: HttpClient) {}

    getUser(id: number) {
        return this.http.get('http://localhost:8000/api/admin/users/' + id);
    }

    getUsers() {
        return this.http.get('http://localhost:8000/api/admin/users')
    }

    deleteUser(user: any) {
        return this.http.delete('http://localhost:8000/api/admin/users/' + user.id);
    }
    
    toogleUserStatus(user: any) {
        return this.http.patch('http://localhost:8000/api/admin/users/' + user.id, user);
    }

}
