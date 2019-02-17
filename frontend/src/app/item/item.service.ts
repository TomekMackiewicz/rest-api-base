import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ItemService {

    constructor(private http: HttpClient) {}

    getItem(id: number) {
        return this.http.get('http://localhost:8000/api/admin/items/' + id);
    }

    getItems(sort: string, order: string, page: any, perPage: number) {
        sort = sort ? sort : 'signature';
        order = order ? order : 'asc';
        return this.http.get(
            'http://localhost:8000/api/admin/items?page=' 
            + page + '&perPage=' + perPage + '&sort=' + sort + '&order=' + order
        );
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
