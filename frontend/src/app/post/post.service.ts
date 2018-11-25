import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class PostService {

    constructor(private http: HttpClient) {}

    getPost(id: number) {
        return this.http.get('http://localhost:8000/api/admin/posts/' + id);
    }

    getPosts() {
        return this.http.get('http://localhost:8000/api/admin/posts')
    }

    createPost(title: string, body: string) {        
        return this.http.post<any>('http://localhost:8000/api/admin/posts', { 
            title: title,
            body: body
        });
    }

    updatePost(post: any) {
        return this.http.patch('http://localhost:8000/api/admin/posts/' + post.id, post);
    }

    deletePost(post: any) {
        return this.http.delete('http://localhost:8000/api/admin/posts/' + post.id);
    }

}
