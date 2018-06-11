import { Injectable } from '@angular/core';
import { Response, Headers, RequestOptions } from "@angular/http";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ItemService {

    constructor(private http: HttpClient) {}

    getItem(id: number) {
        return this.http.get('http://localhost:8000/admin/items/' + id);
    }

    getItems() {
        return this.http.get('http://localhost:8000/admin/items')
    }

    createItem(item: any) {        
        return this.http.post('http://localhost:8000/admin/items', item);
    }

    updateItem(item: any) {
        return this.http.patch('http://localhost:8000/admin/items/' + item.id, item);
    }

    deleteItem(item: any) {
        return this.http.delete('http://localhost:8000/admin/items/' + item.id);
    }

}
