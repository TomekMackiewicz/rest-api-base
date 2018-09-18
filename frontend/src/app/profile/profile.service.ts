import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ProfileService {

    constructor(private http: HttpClient) {}

    getUser(id: number) {
        return this.http.get('http://localhost:8000/api/profile/' + id);
    }

//    putUser(id: number) {
//        return this.http.put('http://localhost:8000/api/profile/' + id);
//    }
//    
//    patchUser(id: number) {
//        return this.http.patch('http://localhost:8000/api/profile/' + id);
//    }
}
