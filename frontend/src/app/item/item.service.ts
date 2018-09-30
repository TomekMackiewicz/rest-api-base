import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ItemService {

    constructor(private http: HttpClient) {}

    getItem(id: number) {
        return this.http.get('http://localhost:8000/api/admin/items/' + id);
    }

    getItems() {
        return this.http.get('http://localhost:8000/api/admin/items')
    }

    createItem(signature: string, status: number) {        
        return this.http.post<any>('http://localhost:8000/api/admin/items', { 
            signature: signature,
            status: status
        });
    }

    updateItem(item: any) {
        return this.http.patch('http://localhost:8000/api/admin/items/' + item.id, item);
    }

    deleteItem(item: any) {
        return this.http.delete('http://localhost:8000/api/admin/items/' + item.id);
    }

}
