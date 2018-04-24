import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { Observable } from 'rxjs/Rx';

@Injectable()
export class ItemService {

    constructor(private http: Http) {}

    getItem(id: number) {
        return this.http.get
            ('http://localhost:8000/admin/items/' + id)
            .map((res: Response) => res.json());
    }

    getItems() {
        return this.http.get
            ('http://localhost:8000/admin/items')
            .map((res: Response) => res.json());
    }

    createItem(item: any) {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = item;
        
        return this.http.post
            ('http://localhost:8000/admin/items', body, options);
    }

    updateItem(item: any) {
        let headers = new Headers({'Content-Type': 'application/json'});
        let options = new RequestOptions({headers: headers});
        let body = item;

        return this.http.patch
            ('http://localhost:8000/admin/items/' + item.id, body, options);
    }

    deleteItem(item: any) {
        return this.http.delete
            ('http://localhost:8000/admin/items/' + item.id);
    }

}
