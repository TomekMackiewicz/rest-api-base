import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class UserService {

    constructor(private http: HttpClient) {}

    getUser(id: number) {
        return this.http.get('http://localhost:8000/api/profile/' + id);
    }
}
